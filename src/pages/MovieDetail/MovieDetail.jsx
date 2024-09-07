import React, { useEffect, useState } from "react";
import "./MovieDetail.css";
import { useLocation, useParams } from "react-router-dom";
import calendar_icon from "../../assets/calendar_icon.png";
import Navbar from "../../components/Navbar/Navbar";
import Player from "../Player/Player";
import play_icon from "../../assets/play_icon.png";
import netflix_spinner from "../../assets/netflix_spinner.gif";
import { addToWatchlist, getWatchlist } from "../../firebase";

const MovieDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [credits, setCredits] = useState({});
  const [loading, setLoading] = useState(false);
  const [watchList, setWatchList] = useState([]);
  const location = useLocation();
  const type = location?.state?.type;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZGM0NDg0YzkyMDA4ZWFmM2FlYmFkYWVlMzlmNmMxZCIsInN1YiI6IjY2MzQ3ZDg5MzU4ZGE3MDEyYTU1MzY3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hAhBW3Cd4YEj_OaelklUXq0JZx7Iz2RNJX_LDe8KnC4",
    },
  };

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.themoviedb.org/3/${type || "movie"}/${id}`, options)
      .then((response) => response.json())
      .then((response) => {
        setData(response);
        setLoading(false);
      });
    fetch(
      `https://api.themoviedb.org/3/${type || "movie"}/${id}/credits`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setCredits(response.cast);
        setLoading(false);
      });
    const getMyList = async () => {
      const res = await getWatchlist();
      setWatchList(res);
    };
    getMyList();
  }, [id, type]);

  const handleAddToWatch = async () => {
    await addToWatchlist(
      data?.id,
      data?.title || data?.name,
      data?.poster_path,
      data?.backdrop_path,
      data?.release_date || data?.first_air_date,
      data?.overview,
      type
    );

    const updatedWatchList = await getWatchlist();
    setWatchList(updatedWatchList);
  };

  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="login-spinner">
          <img src={netflix_spinner} alt="" />
        </div>
      ) : (
        <div>
          <div
            className="hero-img"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,.88), rgba(0,0,0,.88)), url(https://image.tmdb.org/t/p/w500${data?.backdrop_path})`,
            }}
          >
            <div className="detail">
              <div className="image-detail">
                <img
                  src={`https://image.tmdb.org/t/p/w500` + data?.poster_path}
                  alt=""
                />
                <div className="play">
                  <img src={play_icon} alt="" />
                </div>
              </div>
              <div className="description">
                <h2>
                  {data?.title || data?.name}{" "}
                  <p>
                    {data?.release_date?.split("-")[0] ||
                      data?.first_air_date?.split("-")[0]}
                  </p>
                </h2>
                <div className="release_date">
                  <img src={calendar_icon} alt="" className="icon" />
                  <p>{data?.release_date || data?.first_air_date}</p>
                </div>
                <div className="user-score">
                  {data?.vote_average} User Score{" "}
                  {!watchList.some((item) => item?.movieId == data?.id) ? (
                    <button className="btn-add" onClick={handleAddToWatch}>
                      Add to watchlist
                    </button>
                  ) : (
                    <button className="btn">In watchlist</button>
                  )}
                </div>
                <i>{data?.tagline}</i>
                <div className="overview">
                  <h3>Overview</h3>
                  <p>{data?.overview}</p>
                </div>
                <div className="genres">
                  {data && data?.genres?.length > 0
                    ? data?.genres.map((item) => (
                        <button key={item?.id} className="btn-genres">
                          {item?.name}
                        </button>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
          <div className="cast">
            <h2>Cast</h2>
            <div>
              {credits && credits.length > 0 ? (
                <div className="list-cast">
                  {credits?.map(
                    (item, index) =>
                      item.profile_path && (
                        <img
                          key={index}
                          src={
                            `https://image.tmdb.org/t/p/w500` +
                            item.profile_path
                          }
                          alt={item?.name}
                        />
                      )
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <div className="videos">
            <h2>Videos</h2>
            <Player type={type} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
