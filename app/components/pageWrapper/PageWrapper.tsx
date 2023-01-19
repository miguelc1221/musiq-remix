import clsx from "clsx";

export const PageWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={clsx("mx-10 h-auto pb-[100px] pt-[37px]", className)}>
      {children}
    </div>
  );
};
