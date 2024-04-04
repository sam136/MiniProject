import axios from "axios";

let watchlists = [];

export const getWatchlistFromDb = async () => {
  const data = await axios.get(`http://localhost:4000/watchlist`);
  watchlists = data.data;
  return data.data;
};

export const addMovieToWatchlist = async (movie) => {
  let i = -1;
  for (let ii = 0; ii < watchlists.length; ii++) {
    const e = watchlists[ii];
    if (e.id == movie.id) {
      i = ii;
      break;
    }
  }
  console.log(i);
  if (i != -1) {
    watchlists = watchlists.filter((e) => {
      e.id != movie.id;
    });
    let data = await axios.delete(`http://localhost:4000/watchlist`, {
      data: movie,
    });
    console.log(data);
    return data ? true : false;
  }

  const data = await axios.post(`http://localhost:4000/watchlist`, movie);
  watchlists.push(movie);
  console.log(data);
  return data ? true : false;
};

export const getWatchlist = async () => {
  if (!watchlists.length) return await getWatchlistFromDb();
  return watchlists;
};

export const movieInWatchlist = (movID) => {
  return watchlists.find((movObj) => movObj.id == movID);
};
