export const PostDateDisplay = ({ createdDate }: {createdDate: Date }) => {

    const createdDateString = createdDate.toDateString();

    return (
        <p>
            {createdDateString}
        </p>
    )
}