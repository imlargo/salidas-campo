import type { RequestHandler } from './$types';
import { admin } from '$src/lib/server/firebase-server';
import { APPS_SCRIPT_API } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { ROL } from '$lib/util/enums';
import type { UserData } from '$src/lib/types';
import type { DecodedIdToken } from 'firebase-admin/auth';

export const GET: RequestHandler = async ({ locals, cookies }) => {
	const rawUserData = cookies.get('userData');
	const sessionToken = cookies.get('session');
	const isValid = locals.user && locals.userData && rawUserData && sessionToken;

	if (!isValid) {
		return json({
			ok: false
		});
	}

	const decodedUser: DecodedIdToken = await admin.auth().verifySessionCookie(sessionToken, false);

	if (decodedUser.uid !== locals.user.uid) {
		return json({
			ok: false
		});
	}

	if (userData.rol !== ROL.ADMIN) {
		return json({
			ok: false
		});
	}

	const { docentes, admins, uabs } = await fetch(APPS_SCRIPT_API, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			type: 'updateUsersData'
		})
	}).then((res) => res.json());

	const collectionPath = 'users';

	const db = admin.firestore();

	await clearData(db, collectionPath);

	const data = {};

	for (const docente of docentes) {
		data[docente.CORREO.toString()] = {
			ROL: docente.ROL,
			CODIGO_UAB: docente.CODIGO_UAB.toString()
		};
	}
	for (const adminEmail of admins) {
		data[adminEmail.toString()] = {
			ROL: 'ADMIN',
			CODIGO_UAB: '3400'
		};
	}
	for (const uab of uabs) {
		data[uab.CORREO_UAB.toString()] = {
			ROL: 'UAB',
			CODIGO_UAB: uab.CODIGO_UAB.toString()
		};
	}

	const result = await addData(db, collectionPath, data);

	return json({
		ok: true
	});
};

async function clearData(db: admin.firestore.Firestore, collectionPath: string) {
	try {
		const collectionRef = db.collection(collectionPath);
		const snapshot = await collectionRef.get();

		// Delete documents in a batch
		const batch = db.batch();
		snapshot.docs.forEach((doc) => {
			batch.delete(doc.ref);
		});
		await batch.commit();

		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function addData(
	db: admin.firestore.Firestore,
	collectionPath: string,
	data: Record<string, any>
) {
	try {
		// Get a new write batch
		const batch = db.batch();

		for (const [key, value] of Object.entries(data)) {
			const documentRef = db.collection(collectionPath).doc(key);
			batch.set(documentRef, value);
		}

		// Commit the batch
		await batch.commit();

		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
