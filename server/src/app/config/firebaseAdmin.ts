import {
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from 'firebase-admin/app';

import { getMessaging } from 'firebase-admin/messaging';

import serviceAccount from '../secrets/eduquest-push-firebase-adminsdk-fbsvc-c50bdf7b79.json';

// Firebase initialize
const app =
  getApps().length > 0
    ? getApps()[0]!
    : initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
      });

// Firebase Messaging
export const firebaseMessaging = getMessaging(app);