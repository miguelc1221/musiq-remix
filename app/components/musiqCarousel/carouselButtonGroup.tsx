import type { ButtonGroupProps } from "react-multi-carousel/lib/types";
import { CheveronLeftIcon, CheveronRightIcon } from "../icons";

export const ButtonGroup = ({
  next,
  previous,
  carouselState,
}: ButtonGroupProps) => {
  return (
    <>
      <button
        className={`${
          carouselState?.currentSlide === 0 && "hidden"
        } absolute top-1/2 -translate-y-1/2 -translate-x-1/2`}
        onClick={() => previous && previous()}
      >
        <CheveronLeftIcon />
      </button>
      <button
        onClick={() => next && next()}
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2"
      >
        <CheveronRightIcon />
      </button>
    </>
  );
};
