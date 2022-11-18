import type { HTMLProps } from "react";
import { useState } from "react";

type InputRangeType = HTMLProps<HTMLInputElement> & {
  labelId?: string;
  labelText?: string;
  baseColor?: string;
  fillColor?: string;
  onRangeChange?: (p: number) => void;
};

export const InputRange = ({
  labelId = "",
  labelText = "",
  baseColor = "rgb(254 205 211)",
  fillColor = "rgb(99 102 241)",
  onRangeChange,
  ...otherProps
}: InputRangeType) => {
  const [inputValue, setInputValue] = useState(0);
  const gradientValue = inputValue / 100;

  return (
    <>
      <label htmlFor={labelId} className="sr-only">
        {labelText}
      </label>
      <input
        id={labelId}
        type="range"
        min="0"
        max="100"
        value={inputValue}
        onChange={(evt) => {
          const value = Number(evt.target.value);
          onRangeChange && onRangeChange(value);
          setInputValue(value);
        }}
        style={{
          backgroundImage: `-webkit-gradient(linear, left top, right top, color-stop(${gradientValue}, ${fillColor}), color-stop(${gradientValue}, ${baseColor}))`,
        }}
        {...otherProps}
      />
    </>
  );
};
