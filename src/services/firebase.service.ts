import { initializeApp } from 'firebase/app';
import fs from 'fs';
import path from 'path';
import {
  getStorage, ref, uploadBytes, getDownloadURL,
  // deleteObject,
} from 'firebase/storage';
import { log } from 'src/log';

/**
 * This module serves as a minimal interface to Firebase Storage, providing functionalities
 * to efficiently manage the storage, retrieval, and deletion of files within Firebase Storage.
 * It encapsulates operations such as uploading the file-example.log file and deleting files
 * from a specified Firebase Storage bucket, abstracting the Firebase Storage SDK's complexity.
 *
 * Before utilizing this module, ensure you have performed the following setup steps:
 *
 * 1. **Firebase Project Setup**:
 *    - Create a Firebase account and a new project in the Firebase Console.
 *    - Navigate to the "Storage" section in your Firebase project and activate Firebase Storage.
 *
 * 2. **Configuration Keys**:
 *    - Obtain your Firebase project's configuration keys from the Firebase Console under
 *      Project Settings > General > Your apps.
 *    - Populate a `.env` file in your project's root with these keys:
 *      ```
 *      FIREBASE_API_KEY=<YOUR_API_KEY>
 *      FIREBASE_AUTH_DOMAIN=<YOUR_AUTH_DOMAIN>
 *      FIREBASE_PROJECT_ID=<YOUR_PROJECT_ID>
 *      FIREBASE_STORAGE_BUCKET=<YOUR_STORAGE_BUCKET>
 *      FIREBASE_MESSAGING_SENDER_ID=<YOUR_MESSAGING_SENDER_ID>
 *      FIREBASE_APP_ID=<YOUR_APP_ID>
 *      ```
 *
 * 3. **Storage Rules**:
 *    - Define appropriate Firebase Storage rules for your project's needs. For development,
 *      you might start with:
 *      ```
 *      service firebase.storage {
 *        match /b/{bucket}/o {
 *          match /{allPaths=**} {
 *            allow read, write: if true;
 *          }
 *        }
 *      }
 *      ```
 *      Adjust these rules to enforce the desired access control in production.
 */

// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export default app;

const firebaseBucketFolderName = 'file-folder';

/**
 * Here's a functional example of how to upload a file to Firebase Storage.
 * Import and call this function from any module to upload the file-example.log file
 * to Firebase Storage.
 */
export async function uploadLogFile() {
  const fileName = 'file-example.log';
  const filePath = path.resolve(__dirname, '../../file-example.log');
  const buffer = fs.readFileSync(filePath);

  const storageRef = ref(storage, `${firebaseBucketFolderName}/${fileName}`);

  await uploadBytes(storageRef, buffer);

  const fileUrl = await getDownloadURL(storageRef);

  log.info('File available at', fileUrl);
}

// export async function deleteFileFromBucket(fileName: string) {
//   await deleteObject(ref(storage, `${firebaseBucketFolderName}/${fileName}`));
// }
