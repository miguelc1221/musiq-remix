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
  const volumeNum = Number(value);

  return (
    <div className="flex items-center justify-center">
      {volumeNum === 0 && <VolumeX0 className="h-4 w-4" />}
      {volumeNum > 0 && volumeNum <= 0.33 && <VolumeX1 className="h-4 w-4" />}
      {volumeNum > 0.33 && volumeNum <= 0.66 && (
        <VolumeX2 className="h-4 w-4" />
      )}
      {volumeNum > 0.66 && volumeNum <= 1 && <VolumeX3 className="h-4 w-4" />}
      <label htmlFor='volume-progress"' className="sr-only">
        Volume Progress
      </label>
      <input
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
