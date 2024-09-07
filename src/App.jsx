import React, { useEffect, useState } from "react";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Player from "./pages/Player/Player";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MovieModel from "./pages/MovieModel/MovieModel";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import WatchList from "./pages/WatchList/WatchList";

const App = () => {
  const { pathname } = useLocation();
  const [title, setTitle] = useState("");
  // const [user, setUser] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setTitle(pathname.split("/").filter((part) => part !== "")[0]);
    onAuthStateChanged(auth, async (user) => {
      if (user && pathname === "/login") {
        navigate("/");
      }
    });
  }, [pathname]);
  return (
    <div>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/player/:id" element={<Player />} /> */}
        <Route path="/detail/:id" element={<MovieDetail />} />
        <Route
          path="/tv-shows"
          element={
            <MovieModel title={title} setTitle={setTitle} query={"tv"} />
          }
        />
        <Route
          path="/movies"
          element={
            <MovieModel title={title} setTitle={setTitle} query={"movie"} />
          }
        />
        <Route
          path="/new-popular"
          element={
            <MovieModel
              title={title}
              setTitle={setTitle}
              category={"popular"}
            />
          }
        />
        <Route path="/my-list" element={<WatchList />} />
      </Routes>
    </div>
  );
};

export default App;
