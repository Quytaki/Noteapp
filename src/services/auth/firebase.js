import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCxM3qt2bxXKZnma1dzMiwH7KcqSB-norI",
  authDomain: "danentang-db5fa.firebaseapp.com",
  databaseURL: "https://danentang-db5fa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "danentang-db5fa",
  storageBucket: "danentang-db5fa",
  messagingSenderId: "203765434463",
  appId: "1:203765434463:web:e4d42afb6e6099356173ea"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
