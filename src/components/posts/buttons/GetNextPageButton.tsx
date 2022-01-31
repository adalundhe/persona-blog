export const GetNextPageButton = ({ fetchNext }: {fetchNext: () => void}) => {

    return (
        <div>
            <button onClick={fetchNext}>Next Page</button>
        </div>
    )
}