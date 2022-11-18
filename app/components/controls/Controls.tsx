import { PlayIcon, BackwardIcon, ForwardIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { ShuffleIcon } from "../icons";

export const Controls = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <button className="mr-1 hover:text-slate-700/60">
        <ShuffleIcon className="h-4 w-4" />
      </button>
      <button className="hover:text-slate-700/60">
        <BackwardIcon className="h-7 w-7" />
      </button>
      <button className="hover:text-slate-700/60">
        <PlayIcon className="h-9 w-9" />
      </button>
      <button className="hover:text-slate-700/60">
        <ForwardIcon className="h-7 w-7" />
      </button>
      <button className="ml-1 hover:text-slate-700/60">
        <ArrowPathIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
