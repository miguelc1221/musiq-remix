import { ArrowLeft, ArrowRight } from "../icons";

export const Pagination = ({
  count,
  offset,
  offsetLimit,
  onNextClick,
  onPrevClick,
}: {
  count: number;
  offset: number;
  offsetLimit: number;
  showingLength?: number;
  onNextClick: () => void;
  onPrevClick: () => void;
}) => {
  const showingIndexTotal = Math.ceil(count / offsetLimit);
  const currentIndex = offset / offsetLimit + 1;

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-slate-700">
        Showing{" "}
        <span className="font-semibold text-indigo-600">{currentIndex}</span> to{" "}
        <span className="font-semibold text-indigo-600">
          {showingIndexTotal}
        </span>{" "}
        of <span className="font-semibold text-indigo-600">{count}</span> Songs
      </span>
      <div className="xs:mt-0 mt-2 inline-flex">
        <button
          className="inline-flex items-center rounded-l bg-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-400"
          onClick={onPrevClick}
          disabled={currentIndex === 1}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Prev
        </button>
        <button
          className="inline-flex items-center rounded-r border-0 border-l border-gray-400 bg-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-400"
          onClick={onNextClick}
          disabled={currentIndex === showingIndexTotal}
        >
          Next
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
