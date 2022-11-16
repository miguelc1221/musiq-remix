import type { ButtonGroupProps } from "react-multi-carousel/lib/types";
import { CheveronLeftIcon, CheveronRightIcon } from "../icons";

export const ButtonGroup = ({
  next,
  previous,
  carouselState,
}: ButtonGroupProps) => {
  return (
    <>
      <div
        className={`${
          carouselState?.currentSlide === 0 && "hidden"
        } absolute top-0 -ml-[25px] flex h-full items-center pb-[68px]`}
      >
        <button
          onClick={() => previous && previous()}
          className="hover:text-secondaryColor"
        >
          <CheveronLeftIcon />
        </button>
      </div>
      <div className="absolute top-0 right-0 -mr-[25px] flex h-full items-center pb-[68px]">
        <button
          onClick={() => next && next()}
          className="hover:text-secondaryColor"
        >
          <CheveronRightIcon />
        </button>
      </div>
    </>
  );
};
