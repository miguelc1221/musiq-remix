import { Link } from "@remix-run/react";
import { formatArtworkURL, getLinkToUrl } from "~/utils/helpers";
import { GiMusicSpell } from "react-icons/gi";

export const ArtistCard = ({
  artist,
  linkToUrl,
  className,
  ...otherProps
}: {
  artist: MusicKit.Artists;
  className?: string;
  linkToUrl?: string;
}) => {
  const imageSrc = formatArtworkURL(artist?.attributes?.artwork?.url);
  const title = artist.attributes?.name;
  const artistUrl = linkToUrl || getLinkToUrl(artist.attributes?.url);

  return (
    <div
      className={`flex h-full max-w-xs flex-col ${className || ""}`}
      {...otherProps}
    >
      <Link to={artistUrl} className="flex-1">
        <div className="group relative h-full cursor-pointer after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-full after:bg-stone-600 after:opacity-0 after:transition after:duration-300 after:ease-in-out [&:after:hover]:opacity-40">
          {imageSrc ? (
            <>
              <img
                src={imageSrc}
                className="w-full rounded-full shadow-md"
                alt={title}
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-full bg-gray-100 shadow-md">
              <GiMusicSpell className="h-[50%] w-[50%]" />
            </div>
          )}
        </div>
      </Link>

      {title && (
        <div className="mt-2 flex justify-center text-sm">
          <Link
            to={artistUrl}
            className="block truncate text-xs hover:underline"
          >
            {title}
          </Link>
        </div>
      )}
    </div>
  );
};
