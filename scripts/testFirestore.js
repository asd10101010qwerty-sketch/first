import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyATE9IAYiXgc4sQtbGKAJt36zS1t35014o",
  authDomain: "sprint-market.firebaseapp.com",
  projectId: "sprint-market",
  storageBucket: "sprint-market.firebasestorage.app",
  messagingSenderId: "748534342859",
  appId: "1:748534342859:web:85a034f602ab51226e274e",
  measurementId: "G-L0W5JJE57J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const testDoc = doc(db, "telegram_sessions", "test_session");
    await setDoc(testDoc, {
      authenticated: true,
      userName: "Sprint383",
      phone: "+998949392521",
      timestamp: Date.now()
    });
    console.log("SUCCESS: Firestore write worked!");
    const snap = await getDoc(testDoc);
    console.log("READ DATA:", snap.data());
  } catch (err) {
    console.error("FIRESTORE ERROR:", err.message);
  }
}

test();
