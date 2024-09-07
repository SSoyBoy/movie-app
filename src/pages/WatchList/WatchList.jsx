import React, { useEffect, useState } from "react";
import "./WatchList.css";
import Navbar from "../../components/Navbar/Navbar";
import { deleteFromWatchList, getWatchlist } from "../../firebase";
import play_icon from "../../assets/play_icon.png";
import { useNavigate } from "react-router-dom";
import trash_icon from "../../assets/trash_icon.svg";

const WatchList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getData = async () => {
      const res = await getWatchlist();
      setData(res);
    };
    getData();
  }, []);

  const handleRemove = async (id) => {
    await deleteFromWatchList(id);

    const updatedWatchList = await getWatchlist();
    setData(updatedWatchList);
  };

  return (
    <>
      <Navbar />
      <div className="watch-list">
        <h2>Watch List</h2>
        {data && data.length > 0 ? (
          <div>
            {data.map((item, index) => (
              <div className="item" key={index}>
                <div
                  className="remove"
                  onClick={() => handleRemove(item.movieId)}
                >
                  <img src={trash_icon} alt="" className="icon" />
                </div>
                <div className="item-image">
                  <img
                    src={`https://image.tmdb.org/t/p/w500` + item?.posterPath}
                    alt=""
                    onClick={() =>
                      navigate(`/detail/${item?.movieId}`, {
                        state: { type: item?.media_type },
                      })
                    }
                  />
                  <div className="play">
                    <img src={play_icon} alt="" />
                  </div>
                </div>
                <div className="item-description">
                  <h2
                    onClick={() =>
                      navigate(`/detail/${item?.movieId}`, {
                        state: { type: item?.media_type },
                      })
                    }
                  >
                    {item?.title || item?.name}{" "}
                  </h2>
                  <p>{item?.releaseDate?.split("-")[0]}</p>
                  <div className="overview">
                    <h3>Overview</h3>
                    <p>{item?.overview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-items">Your watchlist is empty</div>
        )}
      </div>
    </>
  );
};

export default WatchList;
