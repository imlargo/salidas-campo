import type { Proyeccion, Solicitud, Config, UAB } from '../types';

import { db, colProyeccion, colSolicitudes, colConfig } from '../client/firebase';

import { solicitudStatus } from '../util/enums';

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
	type DocumentData
} from 'firebase/firestore';
import { GroupBy } from '$src/lib/util/utils';

import type { UserResponse } from '../types';

function getSnapshotData(querySnapshot) {
	const data = [];
	querySnapshot.forEach((doc) => {
		data.push({
			...doc.data(),
			id: doc.id
		});
	});
	return data;
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
		const key = (lastInd + 1).toString();

		proyeccion.id = key;
		await setDoc(doc(db, 'proyeccion', key), proyeccion);
		return key;
	}

	async getProyeccion(key: string): Promise<Proyeccion | null> {
		const docSnap = await getDoc(doc(db, 'proyeccion', key));
		return docSnap.exists() ? (docSnap.data() as Proyeccion) : null;
	}

	async updateProyeccion(proyeccion: Proyeccion) {
		const docRef = doc(db, 'proyeccion', proyeccion.id);
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
		return docSnap.exists() ? ({ ...docSnap.data(), id: docSnap.id } as Solicitud) : null;
	}

	async updateCampoSolicitud(id: string, data: { [key: string]: any }) {
		const docRef = doc(db, 'solicitudes', id);
		await updateDoc(docRef, data);
	}

	async updateInternalData(data) {
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

	async getProyeccionesByDocente(email: string) {
		const q = query(colProyeccion, where('email', '==', email));
		const querySnapshot = await getDocs(q);
		return getSnapshotData(querySnapshot);
	}

	async getSolicitudesByDocente(email: string) {
		const q = query(colSolicitudes, where('email', '==', email));
		const querySnapshot = await getDocs(q);
		return getSnapshotData(querySnapshot);
	}

	async getRegistro(key: string) {
		const docSnap = await getDoc(doc(db, 'proyeccion', key));
		return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } : null;
	}

	async getRegistros() {
		const querySnapshot = await getDocs(colProyeccion);
		return getSnapshotData(querySnapshot);
	}

	async getSolicitudes(): Promise<Solicitud[]> {
		const querySnapshot = await getDocs(colSolicitudes);
		const solicitudes = getSnapshotData(querySnapshot);
		return solicitudes
			.sort((a, b) => parseInt(a.id) - parseInt(b.id))
			.map((solicitud) => {
				solicitud.estado = solicitud.estado.toString();
				return solicitud;
			});
	}

	async getSalidasAprobadas() {
		const q = query(colProyeccion, where('estado', '==', solicitudStatus.APROBADA));
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

	async updateSolicitud(id: string, solicitud) {
		const datosSolicitud = solicitud.export();

		const docRef = doc(db, 'solicitudes', id);
		const docSnap = await getDoc(docRef);
		const prevData = await docSnap.data();

		// Si NO hubo un cambio de destino, no se debe desagendar la solicitud
		if (prevData.destino === datosSolicitud.destino) {
			datosSolicitud.agendado = prevData.agendado;
			datosSolicitud.revisado = prevData.revisado;
			datosSolicitud.estado = prevData.estado;
		}

		await updateDoc(docRef, datosSolicitud);
	}

	async updateActaSolicitudfunction(solicitud) {
		const docRef = doc(db, 'solicitudes', solicitud.idProyeccion.toString());
		await updateDoc(docRef, { acta: solicitud.acta });
	}

	async updateCostoSolicitudfunction(solicitud) {
		const docRef = doc(db, 'solicitudes', solicitud.idProyeccion.toString());
		await updateDoc(docRef, { costo: solicitud.costo });
	}

	async updateComiteSolicitudfunction(solicitud) {
		const docRef = doc(db, 'solicitudes', solicitud.idProyeccion.toString());
		await updateDoc(docRef, { comite: solicitud.comite });
	}

	async updateEstadoSolicitudfunction(solicitud) {
		const docRef = doc(db, 'solicitudes', solicitud.idProyeccion.toString());
		await updateDoc(docRef, {
			agendado: solicitud.agendado,
			revisado: solicitud.revisado,
			estado: solicitud.estado
		});
	}

	async getLastInd() {
		const queryProyeccion = await getDocs(colProyeccion);
		return queryProyeccion.size;
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
