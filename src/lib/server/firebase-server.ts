import admin from 'firebase-admin';

import type { ServiceAccount } from 'firebase-admin';
import { SERVICE_ACOUNT_STRING } from '$env/static/private';

const serviceAccount = JSON.parse(SERVICE_ACOUNT_STRING) as ServiceAccount;
const cert = admin.credential.cert(serviceAccount);
admin.initializeApp({ credential: cert });

export { admin };
