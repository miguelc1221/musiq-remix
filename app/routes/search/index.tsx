import clsx from "clsx";
import getChunk from "lodash.chunk";
import { MdExplicit } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useCombobox } from "downshift";
import { useId } from "react";
import { useSpinDelay } from "spin-delay";
import { searchMusickit } from "~/server/musicKit.server";
import type {
  Suggestion,
  Suggestions,
  SuggestionsResults,
  Term,
} from "~/server/musicKit.server";
import invariant from "tiny-invariant";
import { Spinner } from "../../components/spinner/Spinner";
import { formatArtworkURL, getLinkToUrl } from "~/utils/helpers";
import { MusiqCarousel } from "~/components/musiqCarousel/musiqCarousel";
import { AlbumCard } from "~/components/albumCard/AlbumCard";
import { PlayListCard } from "~/components/playlistCard/PlayListCard";
import { SongCarouselList } from "~/components/songCarouselList/SongCarouselList";
import { ArtistCard } from "~/components/artistCard/ArtistCard";

const isTerm = (term: Term | Suggestions): term is Term => {
  return (term as Term).searchTerm !== undefined;
};

const isSuggestion = (term: Term | Suggestions): term is Suggestion => {
  return (term as Suggestion).content !== undefined;
};

const getTerms = (items: Suggestions[]) => {
  return items.filter(isTerm);
};

const getSuggestions = (items: Suggestions[]) => {
  return items.filter(isSuggestion);
};

const getSubtitle = (suggestion: Suggestion) => {
  switch (suggestion.content.type) {
    case "albums": {
      return suggestion.content.attributes?.artistName;
    }
    case "songs": {
      return suggestion.content.attributes?.artistName;
    }
    case "playlists": {
      return suggestion.content.attributes?.curatorName;
    }
    default: {
      return "";
    }
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  // await requireUser(request)
  const url = new URL(request.url);
  const term = url.searchParams.get("term");
  const suggestions = url.searchParams.get("suggestions");

  invariant(typeof term === "string", "term is required");

  const searchResults = await searchMusickit(term, Boolean(suggestions), {
    types: "songs,albums,playlists,artists",
    "fields[albums]": "artwork,name,playParams,url,artistName",
    "fields[artists]": "url,name,artwork",
    ...(!suggestions
      ? { limit: 21 }
      : {
          "limit[results:terms]": 5,
          "limit[results:topResults]": 10,
          kinds: "terms,topResults",
        }),
  });

  if (suggestions) {
    return json({
      suggestions: searchResults.suggestions,
    });
  }

  return json({
    results: searchResults,
  });
};

export const SearchBox = () => {
  const suggestionsFetcher = useFetcher<SuggestionsResults>();
  const navigate = useNavigate();
  const id = useId();
  const suggestions = suggestionsFetcher.data?.suggestions ?? [];
  const termsList = getTerms(suggestions);
  const suggestionsList = getSuggestions(suggestions);

  const cb = useCombobox<Suggestions>({
    id,
    defaultHighlightedIndex: 0,
    onSelectedItemChange: ({ selectedItem, ...others }) => {
      if (!selectedItem) return;

      if (isTerm(selectedItem)) {
        return navigate(
          `/search?${new URLSearchParams({
            term: selectedItem.searchTerm,
          }).toString()}`
        );
      }

      const linkTo = getLinkToUrl(selectedItem.content.attributes?.url);
      return navigate(linkTo);
    },
    items: [...termsList, ...suggestionsList],
    itemToString: (item) => {
      if (item) {
        if (isTerm(item)) {
          return item.displayTerm;
        }

        if (item.content.attributes?.name) {
          return item.content.attributes?.name;
        }
      }

      return "";
    },
    onInputValueChange: ({ inputValue }) => {
      if (!inputValue) return "";
      suggestionsFetcher.submit(
        { term: inputValue ?? "", suggestions: "1" },
        { method: "get", action: "/search?index" }
      );
    },
  });

  const isBusy = suggestionsFetcher.state !== "idle";

  const showSpinner = useSpinDelay(isBusy, {
    delay: 150,
    minDuration: 500,
  });

  const displayMenu = cb.isOpen && suggestions.length > 0;

  return (
    <div className="relative">
      <div className="relative">
        <BiSearch className="absolute left-2 top-0 bottom-0 m-auto h-[50%] w-5" />
        <input
          placeholder="Search"
          {...cb.getInputProps({
            className: clsx(
              "text-normal w-full pl-8 pr-3 py-1.5 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out",
              {
                "rounded-t rounded-b-0": displayMenu,
                rounded: !displayMenu,
              }
            ),
          })}
        />
        <Spinner
          className={`absolute right-2 top-0 bottom-0 m-auto h-[50%] transition-opacity ${
            showSpinner ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <ul
        {...cb.getMenuProps({
          className: clsx(
            "absolute z-[9999] bg-white shadow-lg w-[350px] border border-gray-300 max-h-[calc(100vh_-_185px)] overflow-x-hidden overflow-y-auto rounded-lg mt-1",
            { hidden: !displayMenu }
          ),
        })}
      >
        {displayMenu &&
          termsList.map((result, index) => {
            return (
              <li
                className={clsx(
                  "flex cursor-pointer items-center py-1 px-2 text-sm text-slate-500",
                  {
                    "pb-2": index === termsList.length - 1,
                    "pt-2": index === 0,
                    "text-indigo-600": cb.highlightedIndex === index,
                  }
                )}
                key={`${result.displayTerm}${index}`}
                {...cb.getItemProps({ item: result, index })}
              >
                <BiSearch className="mr-2 h-4 w-4" /> {result.displayTerm}
              </li>
            );
          })}
        {displayMenu &&
          suggestionsList.map((result, index) => {
            const resultSubTitle = getSubtitle(result);
            // const linkTo = getLinkToUrl(result.content.attributes?.url);
            const resultIndex = index + termsList.length;
            let contentRating;

            if (
              result.content.attributes &&
              "contentRating" in result.content.attributes
            ) {
              contentRating = result.content.attributes?.contentRating;
            }

            return (
              <li
                className={clsx("cursor-pointer border-t border-slate-200", {
                  "bg-slate-200": cb.highlightedIndex === resultIndex,
                })}
                key={result.content.id}
                {...cb.getItemProps({ item: result, index: resultIndex })}
              >
                <div className="mx-2 flex items-center py-2 px-2">
                  {result.content.attributes?.artwork?.url && (
                    <img
                      src={formatArtworkURL(
                        result.content.attributes?.artwork?.url,
                        96,
                        96
                      )}
                      alt={result.content.attributes?.name}
                      className={clsx("mr-3 h-[45px] w-[45px] drop-shadow-md", {
                        "rounded-full": result.content.type === "artists",
                      })}
                    />
                  )}
                  <div className="text-xs">
                    <span className="flex max-w-[255px] items-center truncate font-bold">
                      <span>{result.content.attributes?.name}</span>
                      {contentRating && (
                        <span>
                          <MdExplicit className="h-3 w-3" />
                        </span>
                      )}
                    </span>
                    <span className="block max-w-[255px] truncate capitalize">
                      {result.content.type}{" "}
                      {resultSubTitle && <>&#183; {resultSubTitle} </>}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default function SearchRoute() {
  const { results } = useLoaderData<{
    results: {
      songs: MusicKit.SearchResult<MusicKit.Songs>;
      albums: MusicKit.SearchResult<MusicKit.Albums>;
      playlists: MusicKit.SearchResult<MusicKit.Playlists>;
      artists: MusicKit.SearchResult<MusicKit.Artists>;
    };
  }>();

  return (
    <>
      <div>
        {results.artists?.data && (
          <div className="mb-6">
            <h2 className="mb-6 pl-4 text-xl font-bold">Artists</h2>
            <MusiqCarousel>
              {results.artists?.data.map((artist, index) => {
                return <ArtistCard artist={artist} key={index} />;
              })}
            </MusiqCarousel>
          </div>
        )}
        {results.songs?.data && (
          <div className="mb-6">
            <h2 className="mb-6 pl-4 text-xl font-bold">Songs</h2>
            <MusiqCarousel
              responsive={{
                desktop: {
                  breakpoint: { max: 3000, min: 1024 },
                  items: 3,
                  slidesToSlide: 3,
                },
                tablet: {
                  breakpoint: { max: 1024, min: 464 },
                  items: 2,
                  slidesToSlide: 2,
                },
                mobile: {
                  breakpoint: { max: 764, min: 0 },
                  items: 1,
                  slidesToSlide: 1,
                },
              }}
            >
              {getChunk(results.songs?.data, 4).map((item, index) => {
                return (
                  <SongCarouselList
                    songs={item}
                    key={index}
                    allSongs={results.songs.data}
                  />
                );
              })}
            </MusiqCarousel>
          </div>
        )}
        {results.albums?.data && (
          <div className="mb-6">
            <h2 className="mb-6 pl-4 text-xl font-bold">Albums</h2>
            <MusiqCarousel>
              {results.albums?.data.map((album, index) => {
                return <AlbumCard album={album} key={index} />;
              })}
            </MusiqCarousel>
          </div>
        )}
        {results.playlists?.data && (
          <div className="mb-6">
            <h2 className="mb-6 pl-4 text-xl font-bold">Albums</h2>
            <MusiqCarousel>
              {results.playlists?.data.map((playList, index) => {
                return <PlayListCard playList={playList} key={index} />;
              })}
            </MusiqCarousel>
          </div>
        )}
      </div>
    </>
  );
}
