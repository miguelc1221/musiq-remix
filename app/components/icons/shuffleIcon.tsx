export const ShuffleIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <desc></desc>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M18 4l3 3l-3 3"></path>
      <path d="M18 20l3 -3l-3 -3"></path>
      <path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5"></path>
      <path d="M21 7h-5a4.978 4.978 0 0 0 -2.998 .998m-4.002 8.003a4.984 4.984 0 0 1 -3 .999h-3"></path>
    </svg>
  );
};
