import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchTrendingData } from "@/services/fetchTrendingData";

import MediaItem from "@/components/MediaItem";
import { AlertDestructive } from "@/components/Alert";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getWatchlistFromDb,
  movieInWatchlist,
  addMovieToWatchlist,
} from "@/services/dbApi";

/**
 * Component for rendering the home page with trending movies and TV shows.
 * Provides pagination functionality for browsing through trending items.
 * @returns {JSX.Element} The JSX representation of the Home component.
 */

const fetchData = async (page = 1) => {
  const td = await fetchTrendingData(page);
  const db = await getWatchlistFromDb();
  return td;
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [aa, setAa] = useState(0);

  const page = searchParams.get("page") || "1";

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["tranding", page],
    queryFn: () => fetchData(page),
  });

  const nextPage = () => {
    const nextPageValue = String(Number(page) + 1);
    setSearchParams({ page: nextPageValue });
  };

  const prevPage = () => {
    if (page > 1) {
      const prevPageValue = String(Number(page) - 1);
      setSearchParams({ page: prevPageValue });
    }
  };

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-96 w-full mb-8" />
        <div className="grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(20)].map((_, index) => (
            <div className="flex flex-col gap-2" key={index}>
              <Skeleton
                key={index}
                className="h-[270px] w-[180px] rounded-lg"
              />

              <Skeleton className="h-4 w-[56px]" />

              <Skeleton className="h-4 w-[180px]" />
              <Skeleton className="h-4 w-[40px]" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (isError) {
    return <AlertDestructive message={error.message} />;
  }

  const totalPages = data.total_pages;
  const currentPage = parseInt(page, 10);

  let pages = [];

  pages.push(currentPage);

  for (let i = 1; i <= 2; i++) {
    if (currentPage - i > 0) {
      pages.unshift(currentPage - i);
    }
  }

  for (let i = 1; i <= 2; i++) {
    if (currentPage + i <= totalPages) {
      pages.push(currentPage + i);
    }
  }

  const firstMoviePoster =
    data.results.length > 0
      ? `https://image.tmdb.org/t/p/w780${data.results[0].backdrop_path}`
      : "";

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat min-h-96 p-12 text-center rounded-lg mb-8"
        style={{ backgroundImage: `url(${firstMoviePoster})` }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          <div className="flex h-full items-center justify-center">
            <h1 className="text-white scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Trending Movies and TV Shows
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.results.map((movie) => (
          <div>
            <MediaItem movie={movie} key={`${movie.id} ${aa}`} />

            <Button
              type="button"
              className="mb-4"
              onClick={async () => {
                await addMovieToWatchlist(movie);
                setAa(aa + 1);
              }}
              variant="secondary"
            >
              {movieInWatchlist(movie.id)
                ? `Remove from Watchlist`
                : `Add To Watchlist`}
            </Button>
          </div>
        ))}
      </div>

      <Pagination className="pt-8 pb-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={prevPage} disabled={page === "1"} />
          </PaginationItem>
          {pages.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                onClick={() => setSearchParams({ page: String(pageNumber) })}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem className="hidden md:block ">
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={nextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Home;
