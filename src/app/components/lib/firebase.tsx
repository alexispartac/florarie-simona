import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAwxCdDX2xS0cnTIYsYGRTzqDS_a558STg",
  authDomain: "poezia-florilor-9bb89.firebaseapp.com",
  projectId: "poezia-florilor-9bb89",
  storageBucket: "poezia-florilor-9bb89.firebasestorage.app",
  messagingSenderId: "126106674310",
  appId: "1:126106674310:web:d9e4609ee3d89593cb9d07"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };