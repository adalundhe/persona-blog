import React from "react";
import Link from "next/link"; 

export const ShowPostButton = ({postIdx, displayed, updateDisplayed}: {postIdx: number, displayed: boolean[], updateDisplayed: React.Dispatch<React.SetStateAction<boolean[]>>}) => {

    const onClick = () => { 
        updateDisplayed(displayed.map(
            (_: boolean, idx: number) => postIdx === idx ? !displayed[postIdx] : false
        ))
    }

    return (
        <div className="justify-self-end whitespace-nowrap">
            <button onClick={onClick} className="text-sm leading-3">
                <Link href={displayed[postIdx] ? `/#nav-bar` : `/#post-${postIdx}`}>Read More</Link>
            </button>
        </div>
    )
}