import type { ButtonGroupProps } from "react-multi-carousel/lib/types";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi2";

export const ButtonGroup = ({
  next,
  previous,
  carouselState,
}: ButtonGroupProps) => {
  const lastSlide =
    carouselState?.currentSlide &&
    carouselState?.currentSlide + carouselState?.slidesToShow ===
      carouselState?.totalItems;
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
          <HiOutlineChevronLeft className="h-8 w-8" strokeWidth={1.5} />
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
        >
          <HiOutlineChevronRight className="h-8 w-8" strokeWidth={1.5} />
        </button>
      </div>
    </>
  );
};
