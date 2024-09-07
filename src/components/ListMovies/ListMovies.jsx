import React, { useEffect, useState } from "react";
import "./ListMovies.css";
import { useNavigate } from "react-router-dom";

const ListMovies = ({ search, category, query }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);

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
    if (search) setCurrentPage(1);
  }, [search, category, query]);

  console.log("data", data);

  useEffect(() => {
    fetch(
      search
        ? `https://api.themoviedb.org/3/search/multi?query=${search}&page=${currentPage}`
        : category
        ? `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${currentPage}`
        : `https://api.themoviedb.org/3/trending/${query}/day?language=en-US&page=${currentPage}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setData(response?.results);
        setTotalPages(Math.min(response.total_pages, 500));
      })
      .catch((err) => console.error(err));
    localStorage.setItem("currentPage", currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category, currentPage, search, query]);

  const generatePagination = () => {
    const pages = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  console.log("data", data);

  return (
    <div style={{ width: "100%" }}>
      <div className="list-movies">
        {data &&
          data.map((item, idx) => (
            <div
              className="items"
              key={idx}
              onClick={() =>
                navigate(`/detail/${item.id}`, {
                  state: { type: item?.media_type },
                })
              }
            >
              {item?.adult ? <div className="adult">18+</div> : ""}
              <div className="image">
                <img
                  src={`https://image.tmdb.org/t/p/w500` + item.backdrop_path}
                  alt=""
                />
              </div>
              <p>{item?.title || item.name}</p>
            </div>
          ))}
      </div>
      {data.length === 0 && (
        <div className="no-items">"{search}" was not found on the system</div>
      )}
      <div
        className="pagination"
        style={data.length === 0 ? { display: "none" } : { display: "flex" }}
      >
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          style={currentPage === 1 ? { display: "none" } : {}}
        >
          Prev
        </button>
        {generatePagination().map((page, index) =>
          page === "..." ? (
            <span key={index}>...</span>
          ) : (
            <button
              key={index}
              // onClick={() => {
              //   setCurrentPage(page);
              //   window.scrollTo({ top: 0, behavior: "smooth" });
              // }}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          )
        )}
        <button
          // onClick={() => {
          //   setCurrentPage((prev) => prev + 1);
          //   window.scrollTo({ top: 0, behavior: "smooth" });
          // }}
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          style={currentPage === totalPages ? { display: "none" } : {}}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListMovies;
