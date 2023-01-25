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
      className={clsx("mx-10 h-auto pb-[100px] pt-[37px]", className)}
      style={{ ...style }}
      {...otherProps}
    >
      {children}
    </div>
  );
};
