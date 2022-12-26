import { useRef } from "react";
import { VolumeX3, VolumeX2, VolumeX1, VolumeX0 } from "../icons";

export const VolumeControl = ({
  value,
  min,
  max,
  onVolumeChange,
}: {
  value: string;
  min: number | string;
  max: number | string;
  onVolumeChange: (volume: string) => void;
}) => {
  const volumeRef = useRef<HTMLInputElement>(null);
  const volumeNum = Number(value);

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={(evt) => {
          if (volumeRef.current) {
            volumeRef.current.style.setProperty(
              "--seek-before-width-volume",
              `0%`
            );
          }
          return onVolumeChange("0");
        }}
      >
        {volumeNum === 0 && <VolumeX0 className="h-4 w-4" />}
        {volumeNum > 0 && volumeNum <= 0.33 && <VolumeX1 className="h-4 w-4" />}
        {volumeNum > 0.33 && volumeNum <= 0.66 && (
          <VolumeX2 className="h-4 w-4" />
        )}
        {volumeNum > 0.66 && volumeNum <= 1 && <VolumeX3 className="h-4 w-4" />}
      </button>
      <label htmlFor='volume-progress"' className="sr-only">
        Volume Progress
      </label>
      <input
        ref={volumeRef}
        type="range"
        className="volumeControl ml-2"
        step="any"
        value={value}
        min={min}
        max={max}
        onChange={(evt) => {
          const targetValue = evt.target.value;
          evt.target.style.setProperty(
            "--seek-before-width-volume",
            `${Number(targetValue) * 100}%`
          );

          onVolumeChange(evt.target.value);
        }}
      />
    </div>
  );
};
