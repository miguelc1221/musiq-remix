import { EqualizerIcon, PlayIcon, PauseIcon } from "~/components/icons";
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
        <PlayIcon className="h-5 w-5" />
      </button>
    );
  }

  if (isSelectedSong) {
    if (isPlaying && isMouseOver) {
      return (
        <button onClick={onPauseClick} className={className}>
          <PauseIcon className="h-6 w-6" />
        </button>
      );
    }

    if (!isPlaying) {
      return <>{defaultValue}</>;
    }

    return (
      <div className={className}>
        <EqualizerIcon className="h-6 w-6 fill-white" />
      </div>
    );
  }

  return <>{defaultValue}</>;
};
