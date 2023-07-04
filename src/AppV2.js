import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "dd055a96";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        // setIsLoading(false)
        if (!res.ok) throw Error("Something went wrong");

        const data = await res.json();

        if (data.Response === "False") throw Error("Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!query.length) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  function onSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseDetails() {
    setSelectedId(null);
  }

  function HandleAddWatchedMovie(movie) {
    setWatched((prev) => [...prev, movie]);
  }

  function HandleDeleteWatchedMovie(id) {
    setWatched((prev) => prev.filter((movie) => movie.imdbID !== id));
  }

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const ratedAmountOfWatchedMovie = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  return (
    <>
      <Navbar>
        <Logo />
        <SearchBox query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {/* {isLoading ? <Loading /> : <MoviesList movies={movies} />} */}
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={onSelectMovie} />
          )}

          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              onCloseDetails={handleCloseDetails}
              onAddWatchedMovie={HandleAddWatchedMovie}
              isWatched={isWatched}
              ratedAmountOfWatchedMovie={ratedAmountOfWatchedMovie}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedList
                watched={watched}
                HandleDeleteWatchedMovie={HandleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// error message component
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

//loading message
function Loading() {
  return <p className="loader">loading...</p>;
}

// Navbar component

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBox({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// Main component

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function WatchedMovieBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <Summary watched={watched} />
//           <WatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function MoviesList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <SearchMovieList
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}

function SearchMovieList({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{Number(avgImdbRating).toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{Number(avgUserRating).toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, HandleDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Watched
          movie={movie}
          key={movie.imdbID}
          HandleDeleteWatchedMovie={HandleDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}

function Watched({ movie, HandleDeleteWatchedMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => HandleDeleteWatchedMovie(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

function SelectedMovie({
  selectedId,
  onCloseDetails,
  onAddWatchedMovie,
  isWatched,
  ratedAmountOfWatchedMovie,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  useEffect(() => {
    async function getMovieByID() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieByID();
  }, [selectedId]);

  const {
    Plot: plot,
    Genre: genre,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Year: year,
    Title: title,
    imdbRating,
    Director: director,
    Actors: actors,
  } = movie;

  const handleAdd = function () {
    const watchedMovie = {
      imdbID: selectedId,
      year,
      title,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
    };
    onAddWatchedMovie(watchedMovie);
    onCloseDetails();
  };

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    // clean-up function
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  useEffect(() => {
    const callBack = (e) => {
      if (e.key === "Escape") onCloseDetails();
    };

    document.addEventListener("keydown", callBack);

    return () => {
      document.removeEventListener("keydown", callBack);
    };
  }, [onCloseDetails]);

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button onClick={onCloseDetails} className="btn-back">
              &larr;
            </button>
            <img src={poster} alt="Poster of Movie" />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              {/* prettier-ignore */}
              <p><span>⭐</span>{imdbRating} IMDB rating</p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    color="orange"
                    fontSize="1.8rem"
                    onRate={setUserRating}
                  />
                  <button className="btn-add" onClick={handleAdd}>
                    + Add to list
                  </button>
                </>
              ) : (
                <p>You rated this movie {ratedAmountOfWatchedMovie} ⭐</p>
              )}
            </div>
            {/* prettier-ignore */}
            <p> <em>{plot}</em></p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
