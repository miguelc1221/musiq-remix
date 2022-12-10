import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { Equalizer } from "~/components/icons";

export const SongControl = ({
  className,
  isSelectedSong,
  isMouseOver,
  isPlaying,
  onPlayClick,
  onPauseClick,
  defaultValue = "",
}: {
  isSelectedSong: boolean;
  isMouseOver: boolean;
  isPlaying: boolean;
  defaultValue?: string;
  className?: string;
  onPlayClick: () => void;
  onPauseClick: () => void;
}) => {
  const isSelectedSongPlaying = isPlaying && isSelectedSong;

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

    console.log("here>>");
    return (
      <div className={className}>
        <Equalizer className="h-6 w-6 fill-white" />
      </div>
    );
  }

  return <>{defaultValue}</>;
};
