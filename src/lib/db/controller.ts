import type { Proyeccion, Solicitud, Config, UAB, Destino } from '../types';

import { db, colProyeccion, colSolicitudes, colConfig } from '../client/firebase';

import { EstadoSolicitud } from '../util/enums';

import {
	getFirestore,
	collection,
	onSnapshot,
	doc,
	addDoc,
	setDoc,
	getDocs,
	getDoc,
	deleteDoc,
	updateDoc,
	query,
	where,
	orderBy,
	limit,
	type DocumentData, QuerySnapshot
} from 'firebase/firestore';
import { GroupBy } from '$src/lib/util/utils';

import type { UserResponse } from '../types';

function getSnapshotData(querySnapshot: QuerySnapshot<DocumentData, DocumentData>) {
	const data: any[] = [];
	querySnapshot.forEach((doc) => {
		data.push({
			...doc.data(),
			id: doc.id
		});
	});
	return data;
}

function compararDestinos(destinos1: Destino[], destinos2: Destino[]) {
	// Si se agrego o elimino algun destino
	if (destinos1.length !== destinos2.length) {
		return false;
	}

	// Si no son los mismos destinos
	for (const destino of destinos1) {
		const exists = destinos2.some(
			(d) => d.municipio === destino.municipio && d.departamento === destino.departamento
		);
		if (!exists) return false;
	}

	return true;
}

class DBController {
	async loadData(): Promise<{ lugares: string[]; uabs: UAB[]; riesgos: object }> {
		const docSnap = await getDoc(doc(db, 'config', 'data'));
		const data = docSnap.data() as DocumentData;

		const lugares = data.lugares;
		const uabs = data.uabs.map((uab: any) => {
			const data: UAB = {
				codigo: uab.CODIGO_UAB.toString(),
				nombre: uab.NOMBRE_UAB.toString(),
				correo: uab.CORREO_UAB.toString()
			};

			return data;
		});
		const riesgos = GroupBy(data.riesgos, ({ TIPO }) => TIPO);

		return {
			lugares,
			uabs,
			riesgos
		};
	}

	async loadConfig(): Promise<Config> {
		const docSnap = await getDoc(doc(db, 'config', 'config'));
		return docSnap.data() as Config;
	}

	async getUser(email: string): Promise<UserResponse | null> {
		const userRef = await getDoc(doc(db, 'users', email));
		const exists = userRef.exists();
		return exists ? (userRef.data() as UserResponse) : null;
	}

	async getCantidadRegistros() {
		const queryProyeccion = await getDocs(colProyeccion);
		const querySolicitudes = await getDocs(colSolicitudes);

		return {
			proyeccion: queryProyeccion.size,
			solicitud: querySolicitudes.size
		};
	}

	/* Proyeccion */
	async createProyeccion(proyeccion: Proyeccion) {
		const lastInd = await this.getLastInd();
		const key = lastInd + 1;

		proyeccion.id = key;
		await setDoc(doc(db, 'proyeccion', key.toString()), proyeccion);
		return key;
	}

	async getProyeccion(key: string): Promise<Proyeccion | null> {
		const docSnap = await getDoc(doc(db, 'proyeccion', key));
		return docSnap.exists() ? (docSnap.data() as Proyeccion) : null;
	}

	async updateProyeccion(proyeccion: Proyeccion) {
		const docRef = doc(db, 'proyeccion', proyeccion.id.toString());
		await updateDoc(docRef, proyeccion as object);
	}

	async deleteProyeccion(key: string) {
		await deleteDoc(doc(db, 'proyeccion', key.toString()));
	}

	/* Solicitud */
	async createSolicitud(solicitud: Solicitud) {
		const docRef = doc(db, 'solicitudes', solicitud.idProyeccion.toString());
		await setDoc(docRef, solicitud);
	}

	async getSolicitud(key: string): Promise<Solicitud | null> {
		const docSnap = await getDoc(doc(db, 'solicitudes', key));
		return docSnap.exists() ? docSnap.data() as Solicitud : null;
	}

	async updateCampoSolicitud(id: string, data: { [key: string]: any }) {
		const docRef = doc(db, 'solicitudes', id);
		await updateDoc(docRef, data);
	}

	async updateInternalData(data: any) {
		const docRef = doc(db, 'config', 'data');
		await setDoc(docRef, data);
	}

	async getInternalData() {
		const docReference = doc(db, 'config', 'data');
		const docSnap = await getDoc(docReference);
		return docSnap.data();
	}

	async deleteSolicitud(key: string) {
		await deleteDoc(doc(db, 'solicitud', key.toString()));
	}

	async getProyeccionesByDocente(email: string): Promise<Proyeccion[]> {
		const q = query(colProyeccion, where('email', '==', email));
		const querySnapshot = await getDocs(q);
		return getSnapshotData(querySnapshot).sort((a: Proyeccion, b: Proyeccion) => a.id - b.id) as Proyeccion[];
	}

	async getSolicitudesByDocente(email: string): Promise<Solicitud[]> {
		const q = query(colSolicitudes, where('email', '==', email));
		const querySnapshot = await getDocs(q);
		return getSnapshotData(querySnapshot).sort((a: Solicitud, b: Solicitud) => a.id - b.id) as Solicitud[];
	}

	async getRegistros() {
		const querySnapshot = await getDocs(colProyeccion);
		return getSnapshotData(querySnapshot);
	}

	async getSolicitudes(): Promise<Solicitud[]> {
		const querySnapshot = await getDocs(colSolicitudes);
		const solicitudes = getSnapshotData(querySnapshot);
		return solicitudes.sort((a, b) => a.id - b.id);
	}

	async getSalidasAprobadas() {
		const q = query(colProyeccion, where('estado', '==', EstadoSolicitud.APROBADA));
		const querySnapshot = await getDocs(q);
		return getSnapshotData(querySnapshot);
	}

	async asignarDocente(id: string, correoDocente: string) {
		const docenteRef = await getDoc(doc(db, 'users', correoDocente));

		if (docenteRef.exists()) {
			const docRef = doc(db, 'proyeccion', id);
			await updateDoc(docRef, { email: correoDocente });
			return true;
		} else {
			return false;
		}
	}

	async updateSolicitud(id: string, solicitud: Solicitud) {
		const docRef = doc(db, 'solicitudes', id);

		const docSnap = await getDoc(docRef);
		const prevData: Solicitud = (await docSnap.data()) as Solicitud;

		// Si hubo un cambio de destino, se debe desagendar la solicitud
		if (compararDestinos(solicitud.destinos, prevData.destinos)) {
			solicitud.agendado = false;
			solicitud.revisado = false;
			solicitud.estado = EstadoSolicitud.SIN_ASIGNAR;
		}

		await updateDoc(docRef, solicitud as object);
	}

	async updateActaSolicitudfunction(solicitud: Solicitud) {
		const docRef = doc(db, 'solicitudes', solicitud.idProyeccion.toString());
		await updateDoc(docRef, { acta: solicitud.acta });
	}

	async updateCostoSolicitudfunction(solicitud: Solicitud) {
		const docRef = doc(db, 'solicitudes', solicitud.idProyeccion.toString());
		await updateDoc(docRef, { costo: solicitud.costo });
	}

	async updateComiteSolicitudfunction(solicitud: Solicitud) {
		const docRef = doc(db, 'solicitudes', solicitud.idProyeccion.toString());
		await updateDoc(docRef, { comite: solicitud.comite });
	}

	async updateEstadoSolicitudfunction(solicitud: Solicitud) {
		const docRef = doc(db, 'solicitudes', solicitud.idProyeccion.toString());
		await updateDoc(docRef, {
			agendado: solicitud.agendado,
			revisado: solicitud.revisado,
			estado: solicitud.estado
		});
	}

	async getLastInd(): Promise<number> {
		const q = query(colProyeccion, orderBy('id', 'desc'), limit(1));
		const lastDoc = await getDocs(q);

		if (lastDoc.empty) {
			return 1;
		}

		const lastInd = lastDoc.docs[0].data().id;

		return lastInd;
	}

	async getLastIndSolicitud() {
		const querySolicitudes = await getDocs(colSolicitudes);
		return querySolicitudes.size;
	}

	async setProyeccionSolicitada(id: string) {
		const refProyeccion = doc(db, 'proyeccion', id);
		await updateDoc(refProyeccion, {
			solicitada: true
		});
	}

	async setCampoConfig(campo: string, valor: string) {
		const docRef = doc(db, 'config', 'config');
		await updateDoc(docRef, {
			[campo]: valor
		});
	}

	async getConfig() {
		const docSnap = await getDoc(doc(db, 'config', 'config'));
		return docSnap.data();
	}
}

export const dbController = new DBController();
