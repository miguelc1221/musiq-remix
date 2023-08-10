import type { ButtonGroupProps } from "react-multi-carousel/lib/types";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

export const ButtonGroup = ({
  next,
  previous,
  carouselState,
}: ButtonGroupProps) => {
  const lastSlide =
    (carouselState?.currentSlide &&
      carouselState?.currentSlide + carouselState?.slidesToShow ===
        carouselState?.totalItems) ||
    (carouselState?.totalItems &&
      carouselState?.totalItems <= carouselState?.slidesToShow);
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
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="h-8 w-8" strokeWidth={1.5} />
        </button>
      </div>
      <div
        className={`${
          lastSlide && "hidden"
        } absolute top-0 right-0 -mr-[25px] flex h-full items-center pb-[68px]`}
      >
        <button
          onClick={() => next && next()}
          className="hover:text-secondaryColor"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="h-8 w-8" strokeWidth={1.5} />
        </button>
      </div>
    </>
  );
};
