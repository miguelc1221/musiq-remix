import { useCatch, useNavigate, useFetcher } from "@remix-run/react";
import type { AppContextType } from "~/appReducer";
import { useEffect } from "react";
import { useOutletContext } from "@remix-run/react";

export const MusiqCatchBoundary = () => {
  const caught = useCatch();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const { musicKit } = useOutletContext<AppContextType>();

  useEffect(() => {
    const logUserOut = async () => {
      await musicKit?.unauthorize();
      fetcher.submit({}, { method: "post", action: "/session/deleteSession" });
      navigate("/", { replace: true });
    };

    if (caught.status === 403) {
      logUserOut();
    }
  }, [musicKit, caught.status, navigate, fetcher]);

  if (caught.status === 403) {
    return <div className="p-12">Unauthorized.</div>;
  }

  if (caught.status === 404) {
    return <div className="p-12 text-red-500">Something went wrong.</div>;
  }

  throw new Error(`Unsupported thrown response status code: ${caught.status}`);
};
