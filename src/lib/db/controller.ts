import type { Proyeccion } from '../types';

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
	where
} from 'firebase/firestore';

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
	async loadData() {
		const docSnap = await getDoc(doc(db, 'config', 'data'));
		const data = docSnap.data();

		const lugares = data.lugares;
		const uabs = data.uabs;
		const riesgos = data.riesgos;

		return {
			lugares,
			uabs,
			riesgos
		};
	}

	async loadConfig() {
		const docSnap = await getDoc(doc(db, 'config', 'config'));
		return docSnap.data();
	}

	async getUser(email: string): Promise<UserResponse | null> {
		const userRef = await getDoc(doc(db, 'users', email));
		const exists = userRef.exists();
		return exists ? (userRef.data() as UserResponse) : null;
	}

	/* Proyeccion */
	async createProyeccion(proyeccion: Proyeccion) {
		const lastInd = await this.getLastInd();
		const key = (lastInd + 1).toString();

		await setDoc(doc(db, 'proyeccion', key), proyeccion);
		return key;
	}

	async updateProyeccion(proyeccion: Proyeccion) {
		const docRef = doc(db, 'proyeccion', proyeccion.id);
		await updateDoc(docRef, proyeccion as object);
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

	async deleteProyeccion(key: string) {
		await deleteDoc(doc(db, 'proyeccion', key.toString()));
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

	async getSolicitud(key: string) {
		const docSnap = await getDoc(doc(db, 'solicitudes', key));
		return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } : null;
	}

	async getRegistros() {
		const querySnapshot = await getDocs(colProyeccion);
		return getSnapshotData(querySnapshot);
	}

	async getRegistrosSize() {
		const queryProyeccion = await getDocs(colProyeccion);
		const querySolicitudes = await getDocs(colSolicitudes);

		return {
			proyecciones: queryProyeccion.size,
			solicitudes: querySolicitudes.size
		};
	}

	async getSolicitudes() {
		const querySnapshot = await getDocs(colSolicitudes);
		return getSnapshotData(querySnapshot);
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

	async updateSolicitudfunction(id: string, solicitud) {
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

	async saveSolicitudfunction(solicitud) {
		const docRef = doc(db, 'solicitudes', solicitud.idProyeccion.toString());
		await setDoc(docRef, solicitud.export());
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

	async setSalidaSolicitadafunction(id: string) {
		const refProyeccion = doc(db, 'proyeccion', id);
		await updateDoc(refProyeccion, {
			solicitada: true
		});
	}

	async setCampoConfigfunction(key: string, value: string) {
		const docRef = doc(db, 'config', 'config');
		await updateDoc(docRef, {
			[key]: value
		});
	}

	async getConfig() {
		const docSnap = await getDoc(doc(db, 'config', 'config'));
		return docSnap.data();
	}
}

export const dbController = new DBController();
