import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { auth, logout } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import SearchModel from "../SearchModel/SearchModel";

const Navbar = () => {
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const inputRef = useRef(null);
  const navRef = useRef();
  const navigate = useNavigate();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZGM0NDg0YzkyMDA4ZWFmM2FlYmFkYWVlMzlmNmMxZCIsInN1YiI6IjY2MzQ3ZDg5MzU4ZGE3MDEyYTU1MzY3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hAhBW3Cd4YEj_OaelklUXq0JZx7Iz2RNJX_LDe8KnC4",
    },
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/search/multi?query=${search}`, options)
      .then((response) => response.json())
      .then((response) => setDataSearch(response.results))
      .catch((err) => console.error(err));
  }, [search]);

  useEffect(() => {
    onAuthStateChanged(auth, async (data) => {
      setUser(data);
    });
    // window.addEventListener("scroll", () => {
    //   if (window.scrollY >= 80) {
    //     navRef.current.classList.add("nav-dark");
    //   } else {
    //     navRef.current.classList.remove("nav-dark");
    //   }
    // });
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY >= 80) {
          navRef.current.classList.add("nav-dark");
        } else {
          navRef.current.classList.remove("nav-dark");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearch]);

  const handleBlur = () => {
    setTimeout(() => {
      setIsSearch(false);
    }, 100);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate("/tv-shows", { state: { query: search } });
      setSearch("");
      setIsSearch(false);
    }
  };

  const handleLogOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div ref={navRef} className="navbar">
      <div className="navbar-left">
        <img onClick={() => navigate("/")} src={logo} alt="" />
        <ul>
          <li onClick={() => navigate("/home")}>Home</li>
          <li onClick={() => navigate("/tv-shows")}>TV</li>
          <li onClick={() => navigate("/movies")}>Movies</li>
          <li onClick={() => navigate("/new-popular")}>New & Popular</li>
          <li onClick={() => navigate("/my-list")}>My List</li>
          {/* <li onClick={() => navigate("/home")}>Browse by Languages</li> */}
        </ul>
      </div>
      <div className="navbar-right">
        <div className="navbar-search">
          <img
            src={search_icon}
            alt=""
            className="icons"
            onClick={() => setIsSearch(!isSearch)}
          />
          {isSearch == true ? (
            <div className="search-input">
              <input
                ref={inputRef}
                type="text"
                value={search}
                placeholder="Search by name..."
                onChange={(e) => setSearch(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
              {search && (
                <SearchModel
                  searchData={dataSearch}
                  search={search}
                  setSearch={setSearch}
                />
              )}
            </div>
          ) : (
            <div>
              <p>Search...</p>
            </div>
          )}
        </div>
        <img src={bell_icon} alt="" className="icons" />
        <div className="navbar-profile">
          <img src={profile_img} alt="" className="profile" />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p
              onClick={() => {
                user ? handleLogOut() : navigate("/login");
              }}
            >
              {user ? "Sign Out of Netflix" : "Login"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
