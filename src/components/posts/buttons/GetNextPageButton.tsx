import { ArrowCircleDownIcon } from "@heroicons/react/solid"

export const GetNextPageButton = ({ fetchNext }: {fetchNext: () => void}) => {

    return (
        <div className="my-6 flex flex-row justify-center h-1/8 w-full lg:w-3/4 py-2 w-full bg-slate-100 border border-slate-700/80">
            <button onClick={fetchNext} className="flex flex-row items-center justify-center tracing-wide leading-6 font-medium text-slate-800/90 hover:text-sky-800/90 flex-wrap h-1/8 text-sm">
                <ArrowCircleDownIcon className="h-1/8 w-1/8 m-0 text-center" />
                <p>
                    Next
                </p>
            </button>
        </div>
    )
}