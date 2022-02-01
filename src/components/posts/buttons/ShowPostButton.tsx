import React from "react";
import Link from "next/link";

export const ShowPostButton = ({postIdx, displayed, updateDisplayed}: {postIdx: number, displayed: boolean[], updateDisplayed: React.Dispatch<React.SetStateAction<boolean[]>>}) => {

    const onClick = () => { 
        updateDisplayed(displayed.map(
            (_: boolean, idx: number) => postIdx === idx ? !displayed[postIdx] : false
        ))
    }

    return (
        <div className="justify-self-end whitespace-nowrap flex flex-row justify-end">
            <button onClick={onClick} className="text-sm leading-3 h-full w-full text-slate-700 px-6 py-4 hover:text-sky-700/90 font-medium hover:bg-stone-100">
                <Link href={displayed[postIdx] ? `/#nav-bar` : `/#post-${postIdx}`}>
                    {
                        displayed[postIdx] ? 
                        "All done!"
                        : 
                        "Read me!"
                    }
                </Link>
            </button>
        </div>
    )
}