import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBqcaaiwCHi0RwkHduOf8Kj5cWppTs1Gm0",
  authDomain: "freelancer-marketplace-b16b2.firebaseapp.com",
  projectId: "freelancer-marketplace-b16b2",
  storageBucket: "freelancer-marketplace-b16b2.firebasestorage.app",
  messagingSenderId: "98007237240",
  appId: "1:98007237240:web:7d164409a505fb43a9238d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "admin@freelancehub.com", "Admin123!");
    const user = userCredential.user;
    
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: "System Admin",
      role: "admin",
      createdAt: new Date().toISOString(),
      profilePic: ''
    });
    console.log("Admin account created successfully!");
    process.exit(0);
  } catch (error) {
    // If already exists, we could just log in and update the role
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
