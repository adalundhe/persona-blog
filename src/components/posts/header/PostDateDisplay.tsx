export const PostDateDisplay = ({ createdDate }: {createdDate: Date }) => {

    const createdDateString = createdDate.toDateString();

    return (
        <div className="w-full">
            <p className="italic font-xs text-neutral-400">
                {createdDateString}
            </p>
        </div>
    )
}