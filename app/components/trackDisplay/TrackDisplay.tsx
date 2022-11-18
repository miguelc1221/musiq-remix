import { InputRange } from "../inputRange/inputRange";

export const TrackDisplay = () => {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center">
      <img
        src="https://is4-ssl.mzstatic.com/image/thumb/Music112/v4/c7/00/3f/c7003f83-3a43-1201-4aec-41be71ba64c5/22UM1IM29131.rgb.jpg/88x88bb.jpg"
        className="h-[55px] w-[55px]"
      />
      <div className="flex h-full flex-col items-center justify-center bg-slate-200/70 text-xs">
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="block">Some Drake Song</span>
          <span>Drake & 21 Savage - Her Loss</span>
        </div>
        <div className="w-full">
          <InputRange
            className="playBackProgress"
            labelId="playback-progress"
            labelText="Playback Progress"
          />
        </div>
      </div>
    </div>
  );
};
