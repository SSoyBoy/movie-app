import React from "react";
import "./SearchModel.css";
import { useNavigate } from "react-router-dom";
import back_arrow_icon from "../../assets/back_arrow_icon.png";

const SearchModel = ({ searchData, search, setSearch }) => {
  const navigate = useNavigate();
  const handleSubmiit = () => {
    navigate("/tv-shows", { state: { query: search } });
    setSearch("");
  };
  return (
    <div>
      <div className="search">
        {searchData.length != 0 ? (
          <div className="search-form">
            {searchData.slice(0, 7).map((item, idx) => (
              <div
                key={idx}
                className={`search-model`}
                onClick={() => navigate(`/player/${item.id}`)}
              >
                <div className="search-image">
                  <img
                    src={`https://image.tmdb.org/t/p/w500` + item.backdrop_path}
                    alt=""
                  />
                </div>
                <div>
                  <h3>
                    {item?.title || item?.name} (
                    {item?.release_date?.split("-")[0] ||
                      item?.first_air_date?.split("-")[0]}
                    )
                  </h3>
                  <p className="truncate-overview">{item?.overview}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <div className="all-results" onClick={handleSubmiit}>
          <b>All keyword results</b>
        </div>
      </div>
    </div>
  );
};

export default SearchModel;
