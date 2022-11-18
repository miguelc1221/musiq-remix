import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

export const VolumeControl = () => {
  const [inputValue, setInputValue] = useState(0);
  const gradientValue = (inputValue - 1) / (100 - 1);

  return (
    <div className="flex items-center justify-center">
      <ChevronLeftIcon className="h-4 w-4" />
      <label htmlFor="sound progress" className="sr-only">
        Playback Progress
      </label>
      <input
        readOnly
        id="sound progress"
        type="range"
        min="1"
        max="100"
        step="1"
        onChange={(evt) => setInputValue(Number(evt.target.value))}
        className="volumeControl cursor-pointer appearance-none bg-gray-400"
        style={{
          backgroundImage: `-webkit-gradient(linear, left top, right top, color-stop(${gradientValue}, rgb(99 102 241)), color-stop(${gradientValue}, rgb(254 205 211)))`,
        }}
      />
    </div>
  );
};
