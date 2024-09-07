import React, { useEffect, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useNavigate, useParams } from "react-router-dom";

const Player = ({ type }) => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    typeof: "",
  });

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
      `https://api.themoviedb.org/3/${
        type || "movie"
      }/${id}/videos?language=en-US`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setApiData(response.results[0]);
        console.log("result", response);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {apiData && apiData.key ? (
        <div className="player">
          {/* <img src={back_arrow_icon} onClick={() => navigate(-1)} alt="" /> */}
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${apiData.key}`}
            title="trailer"
            frameborder="0"
            allowFullScreen
          ></iframe>
          {/* <div className="player-info">
        <p>{apiData.published_at.slice(0, 10)}</p>
        <p>{apiData.name}</p>
        <p>{apiData.typeof}</p>
      </div> */}
        </div>
      ) : null}
    </>
  );
};

export default Player;
