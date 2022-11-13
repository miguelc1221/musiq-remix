import type { IconsType } from "./iconType";

export const CheveronRightIcon = ({
  className = "",
  strokeWidth = 1.5,
  height = "h-8",
  width = "w-8",
}: IconsType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={`${height} ${width} ${className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
};
