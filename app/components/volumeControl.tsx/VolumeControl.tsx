import { useEffect, useRef, useState } from "react";
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
  const volumeValueRef = useRef(Number(value));
  const volumeRef = useRef<HTMLInputElement>(null);
  const volumeNum = Number(value);

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={(evt) => {
          if (!volumeRef.current || volumeValueRef.current === 0) return;

          if (volumeNum === 0) {
            volumeRef.current.style.setProperty(
              "--seek-before-width-volume",
              `${volumeValueRef.current * 100}%`
            );

            return onVolumeChange(`${volumeValueRef.current}`);
          }

          volumeRef.current.style.setProperty(
            "--seek-before-width-volume",
            `0%`
          );

          volumeValueRef.current = volumeNum;

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
          if (volumeValueRef) {
            volumeValueRef.current = Number(evt.target.value);
          }
          onVolumeChange(evt.target.value);
        }}
        aria-label="Volume"
        aria-valuemin={Number(min)}
        aria-valuemax={Number(max)}
        aria-orientation="horizontal"
        aria-valuenow={Number(value)}
        aria-valuetext={`${Number(value) * 100}%`}
      />
    </div>
  );
};
