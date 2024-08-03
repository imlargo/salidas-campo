import admin from 'firebase-admin';

import type { ServiceAccount } from 'firebase-admin';

const serviceAccountString = '';

const serviceAccount = JSON.parse(serviceAccountString) as ServiceAccount;
const cert = admin.credential.cert(serviceAccount);
admin.initializeApp({ credential: cert });

export { admin };
