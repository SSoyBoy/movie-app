import React, { useEffect, useState } from "react";
import "./MovieModel.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import SearchModel from "../../components/SearchModel/SearchModel";
import ListMovies from "../../components/ListMovies/ListMovies";

const MovieModel = ({ category, query }) => {
  const [arrange, setArrange] = useState("sắp xếp");
  const [title, setTitle] = useState("");
  const [dataUpcoming, setDataUpcoming] = useState([]);
  const [dataTopRated, setDataTopRated] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();
  const searchName = location.state?.query;

  const handleArrange = (newArrange) => {
    setArrange(newArrange);
  };

  useEffect(() => {
    if (searchName) {
      setTitle(searchName);
    } else
      setTitle(location?.pathname.split("/").filter((part) => part !== "")[0]);
  }, [location]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZGM0NDg0YzkyMDA4ZWFmM2FlYmFkYWVlMzlmNmMxZCIsInN1YiI6IjY2MzQ3ZDg5MzU4ZGE3MDEyYTU1MzY3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hAhBW3Cd4YEj_OaelklUXq0JZx7Iz2RNJX_LDe8KnC4",
    },
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1`,
      options
    )
      .then((response) => response.json())
      .then((response) => setDataUpcoming(response.results))
      .catch((err) => console.error(err));

    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`,
      options
    )
      .then((response) => response.json())
      .then((response) => setDataTopRated(response.results))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="movies">
        <div className="title">
          <a href="/"> NETFLIX /</a> <p>{title}</p>
        </div>
        <div>
          {/* <div className="filter">
            <select
              value={arrange}
              className="arrange"
              onChange={(e) => handleArrange(e.target.value)}
            >
              <option disabled={true} value={"Sắp xếp"}>
                sắp xếp
              </option>
              <option value="kinh dị">Kinh dị</option>
              <option value="hành động">Hành động</option>
              <option value="Võ thuật">Võ thuật</option>
            </select>
          </div> */}
          <div className="list">
            <ListMovies search={searchName} category={category} query={query} />
            <div className="other-movies">
              <div className="upcoming">
                <h2>Upcoming Movies</h2>
                <div>
                  {dataUpcoming.slice(0, 7).map((item, idx) => (
                    <div
                      key={idx}
                      className={`upcoming-movies ${
                        idx % 2 === 1 ? "gray-background" : ""
                      }`}
                      onClick={() => navigate(`/detail/${item.id}`)}
                    >
                      <div>
                        <img
                          src={
                            `https://image.tmdb.org/t/p/w500` +
                            item.backdrop_path
                          }
                          alt=""
                        />
                      </div>
                      <div className="upcoming-describe">
                        <h3>{item?.title}</h3>
                        <p>{item?.release_date.split("-")[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="trending">
                <h2>Trending</h2>
                <div>
                  {dataTopRated.slice(0, 10).map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`trending-movies ${
                          idx % 2 === 1 ? "gray-background" : ""
                        }`}
                        onClick={() => navigate(`/detail/${item.id}`)}
                      >
                        <div className="ratings">
                          <span>{idx + 1}</span>
                        </div>
                        <div className="trending-describe">
                          <h3>{item?.title}</h3>
                          <p>{item?.vote_average} vote average</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieModel;
