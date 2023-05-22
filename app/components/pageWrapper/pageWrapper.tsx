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
        "mx-10 min-h-full overflow-hidden pb-[6.2rem] pt-[2.313rem] md:pt-[4.063rem] md:pb-[7.5rem]",
        className
      )}
      style={{ ...style }}
      {...otherProps}
    >
      {children}
    </div>
  );
};
