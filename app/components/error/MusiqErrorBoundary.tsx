import { useState } from "react";
import { useNavigate } from "@remix-run/react";

export const MusiqErrorBoundary = ({
  message = "Oops something went wrong. Please try again.",
}: {
  message?: string;
}) => {
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
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <h2 className="text-lg">{message}</h2>
      <button
        className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
        onClick={handleClick}
      >
        Try Again
      </button>
    </div>
  );
};
