import { useState } from "react";
import { useNavigate } from "@remix-run/react";

export const MusiqErrorBoundary = ({
  error,
  message = "Oops something went wrong. Please try again.",
}: {
  message?: string;
  error: Error;
}) => {
  console.log(error);

  const [retries, setRetries] = useState(0);
  const navigate = useNavigate();
  const handleClick = () => {
    setRetries((tries) => tries + 1);

    if (retries === 2) {
      return navigate(-1);
    }

    navigate(".", { replace: true });
  };

  return (
    <div className="flex h-[calc(100vh_-_100px)] flex-col items-center justify-center gap-3">
      <h2 className="text-lg">{message}</h2>
      <button
        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
        onClick={handleClick}
      >
        Try Again
      </button>
    </div>
  );
};
