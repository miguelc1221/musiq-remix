import React from "react";
import Carousel from "react-multi-carousel";
import { ButtonGroup } from "./carouselButtonGroup";
import type { CarouselProps } from "react-multi-carousel/lib/types";

const defaultResponsiveProp = {
  desktop: {
    breakpoint: { max: 5000, min: 1024 },
    items: 6,
    slidesToSlide: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

type CarouselP = Omit<CarouselProps, "responsive"> & {
  responsive?: CarouselProps["responsive"];
};

export const MusiqCarousel = ({
  children,
  responsive = defaultResponsiveProp,
  ...otherProps
}: CarouselP) => {
  return (
    <div className="relative">
      <Carousel
        customButtonGroup={<ButtonGroup />}
        arrows={false}
        renderButtonGroupOutside={true}
        responsive={responsive}
        ssr={true}
        keyBoardControl={true}
        customTransition="all 1.2s"
        partialVisible={true}
        itemClass="px-4"
        {...otherProps}
      >
        {children}
      </Carousel>
    </div>
  );
};
