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
        } absolute top-0 -ml-[20px] h-full pb-[68px]`}
        onClick={() => previous && previous()}
      >
        <CheveronLeftIcon />
      </button>
      <button
        onClick={() => next && next()}
        className="absolute top-0 right-0 -mr-[20px] h-full pb-[68px]"
      >
        <CheveronRightIcon />
      </button>
    </>
  );
};
