import { useState } from "react";
import { InputRange } from "../inputRange/inputRange";
import { VolumeX3, VolumeX2, VolumeX1, VolumeX0 } from "../icons";

export const VolumeControl = () => {
  const [volumeProgess, setVolumeProgress] = useState(0);
  console.log(volumeProgess, "VOLUME>>>>>");
  return (
    <div className="flex items-center justify-center">
      {volumeProgess === 0 && <VolumeX0 className="h-4 w-4" />}
      {volumeProgess > 0 && volumeProgess <= 33 && (
        <VolumeX1 className="h-4 w-4" />
      )}
      {volumeProgess > 33 && volumeProgess <= 66 && (
        <VolumeX2 className="h-4 w-4" />
      )}
      {volumeProgess > 66 && volumeProgess <= 100 && (
        <VolumeX3 className="h-4 w-4" />
      )}
      <InputRange
        className="volumeControl ml-2"
        labelId="volume-progress"
        labelText="volume Progress"
        onRangeChange={(progress) => setVolumeProgress(progress)}
      />
    </div>
  );
};
