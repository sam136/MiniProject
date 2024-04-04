import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "@/services/searchMovies";
import { RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader } from "@/components/Loader";
import { AlertDestructive, AlertInfo } from "@/components/Alert";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import MediaItem from "@/components/MediaItem";
import { getWatchlist } from "@/services/dbApi";

/**
 * Component for searching movies based on title and release year.
 * Displays a form with inputs for title search and year selection.
 * Renders search results in a grid of MediaItem components.
 * @returns {JSX.Element} The JSX representation of the Movies component.
 */
const WatchList = () => {
  const searchInputRef = useRef(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["getWatchlist"],
    queryFn: () => getWatchlist(),
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    let searchQuery = searchInputRef.current.value.trim();
    setSearchParams({
      query: searchQuery,
    });
    refetch();
  };

  const handleReset = () => {
    form.reset();
    setSearchParams({});
    searchInputRef.current.value = "";
    setSelectedYear("");
  };

  useEffect(() => {
    const q = searchParams.get("query") || "";

    searchInputRef.current.value = q;
  }, [searchParams]);

  const q = searchParams.get("query") || "";

  let filteredData = data;
  if (q != "") {
    console.log(q);
    filteredData = data.filter((e) =>
      e.original_title.toLowerCase().startsWith(q)
    );
  }

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-8">
        Watchlist
      </h1>
      <Form {...form}>
        <form
          className="flex flex-wrap gap-2 w-full items-start gap-2 pb-8"
          onSubmit={handleSearch}
        >
          <FormItem className="flex flex-grow">
            <Input
              type="text"
              ref={searchInputRef}
              placeholder="Enter movie title"
              className="flex-grow"
              required
            />
            <FormMessage />
          </FormItem>

          <Button type="button" onClick={handleReset} variant="secondary">
            <RotateCcwIcon className="mr-2 h-4 w-4" /> Reset
          </Button>

          <Button type="submit" className="flex flex-auto">
            <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
      </Form>
      {isLoading && <Loader />}
      {isError && <AlertDestructive message={error.message} />}
      {!isLoading &&
        searchParams.has("query") &&
        filteredData?.length === 0 && <AlertInfo />}
      {filteredData && !isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredData.map((movie) => (
            <MediaItem movie={movie} key={movie.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchList;
