export const AlbumCard = ({
  src,
  title,
  subTitle,
  ...otherProps
}: {
  src?: string;
  title?: string;
  subTitle?: string;
}) => {
  return (
    <div className="albumCard mb-4 max-w-xs" {...otherProps}>
      <div className="relative cursor-pointer after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-md after:bg-stone-500 after:opacity-0 after:transition after:duration-300 after:ease-in-out [&:after:hover]:opacity-40">
        {src && <img src={src} className="w-full rounded-md" alt={title} />}
      </div>
      {(title || subTitle) && (
        <div className="mt-2 flex flex-col gap-[2] text-sm">
          <div>
            <a
              href="#"
              className="block w-full truncate text-xs hover:underline"
            >
              {title}
            </a>
          </div>
          <span className="text-xs text-slate-500">{subTitle}</span>
        </div>
      )}
    </div>
  );
};
