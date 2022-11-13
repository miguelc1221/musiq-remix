import React from "react";
import Carousel from "react-multi-carousel";
import { ButtonGroup } from "./carouselButtonGroup";

export const MusiqCarousel = ({
  children,
  ...otherProps
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative">
      <Carousel
        customButtonGroup={<ButtonGroup />}
        arrows={false}
        renderButtonGroupOutside={true}
        responsive={{
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
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
        }}
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
