import { HiPlay, HiPause } from "react-icons/hi2";
import { Equalizer } from "~/components/icons";
import { Spinner } from "../spinner/spinner";

export const SongControl = ({
  className,
  isLoading,
  isSelectedSong,
  isMouseOver,
  isPlaying,
  onPlayClick,
  onPauseClick,
  defaultValue = "",
}: {
  isSelectedSong: boolean;
  isLoading: boolean;
  isMouseOver: boolean;
  isPlaying: boolean;
  defaultValue?: string;
  className?: string;
  onPlayClick: () => void;
  onPauseClick: () => void;
}) => {
  const isSelectedSongPlaying = isPlaying && isSelectedSong;

  if (isLoading && isSelectedSong) {
    return <Spinner className={className} />;
  }

  if (
    (isMouseOver && !isSelectedSong) ||
    (isSelectedSong && !isSelectedSongPlaying && isMouseOver)
  ) {
    return (
      <button onClick={onPlayClick} className={className}>
        <HiPlay className="h-5 w-5" />
      </button>
    );
  }

  if (isSelectedSong) {
    if (isPlaying && isMouseOver) {
      return (
        <button onClick={onPauseClick} className={className}>
          <HiPause className="h-6 w-6" />
        </button>
      );
    }

    if (!isPlaying) {
      return <>{defaultValue}</>;
    }

    return (
      <div className={className}>
        <Equalizer className="h-6 w-6 fill-white" />
      </div>
    );
  }

  return <>{defaultValue}</>;
};
