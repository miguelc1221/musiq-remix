import clsx from "clsx";

export const PageWrapper = ({
  className,
  children,
  style,
  ...otherProps
}: {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={clsx(
        "mx-10 min-h-screen pb-[6.2rem] pt-[2.313rem] supports-[min-height:100cqh]:min-h-[100cqh] supports-[min-height:100svh]:min-h-[100svh] md:pt-[4.063rem] md:pb-[7.5rem]",
        className
      )}
      style={{ ...style }}
      {...otherProps}
    >
      {children}
    </div>
  );
};
