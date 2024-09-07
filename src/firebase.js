// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  where,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNQhmtJDEQEqsmR-RoCtErOJEC6wI_zsU",
  authDomain: "netflix-clone-3d1ec.firebaseapp.com",
  projectId: "netflix-clone-3d1ec",
  storageBucket: "netflix-clone-3d1ec.appspot.com",
  messagingSenderId: "779750893791",
  appId: "1:779750893791:web:e9782855bfd6e8e59de16a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Login successful!");
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = () => {
  signOut(auth);
};

const addToWatchlist = async (
  movieId,
  title,
  posterPath,
  backdropPath,
  releaseDate,
  overview,
  media_type
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You need to be logged in to add to watchlist");
      return;
    }
    const watchlistRef = collection(db, "watchlist");
    await addDoc(watchlistRef, {
      userId: user.uid,
      movieId,
      title,
      posterPath,
      backdropPath,
      releaseDate,
      overview,
      media_type,
    });
    toast.success("Added to watchlist");
  } catch (error) {
    console.error("Error adding to watchlist: ", error);
    toast.error("Failed to add to watchlist");
  }
};

const getWatchlist = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You need to be logged in to view your watchlist");
      return [];
    }
    const q = query(
      collection(db, "watchlist"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const watchlist = querySnapshot.docs.map((doc) => doc.data());
    return watchlist;
  } catch (error) {
    console.error("Error fetching watchlist: ", error);
    toast.error("Failed to fetch watchlist");
    return [];
  }
};

const deleteFromWatchList = async (movieId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You need to be logged in to delete from watchlist");
      return;
    }

    const watchlistRef = collection(db, "watchlist");
    const q = query(
      watchlistRef,
      where("userId", "==", user.uid),
      where("movieId", "==", movieId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast.error("Movie not found in your watchlist");
      return;
    }
    querySnapshot.forEach(async (docSnapshot) => {
      console.log("docSnapshot", docSnapshot);
      await deleteDoc(doc(db, "watchlist", docSnapshot.id));
      toast.success("Removed from watchlist");
    });
  } catch (error) {
    console.error("Error removing from watchlist: ", error);
    toast.error("Failed to remove from watchlist");
  }
};

export {
  auth,
  signup,
  login,
  logout,
  db,
  addToWatchlist,
  getWatchlist,
  deleteFromWatchList,
};
