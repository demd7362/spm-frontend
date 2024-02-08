
export default function Pagination({ pagination, handlePrev, handleNext, handleClickPage,prevText = '이전',nextText = '다음',bottomSize }: PaginationProps){
    const { page, totalPages } = pagination;

    const renderPages = () => {
        const firstNumber= Math.floor((page - 1) / bottomSize) * bottomSize + 1;
        const lastNumber = Math.min(firstNumber + bottomSize - 1, totalPages);
        return Array.from({ length: lastNumber - firstNumber + 1 }, (_, index) => {
            const pageNumber = firstNumber + index;
            return (
                <li
                    key={pageNumber}
                    onClick={() => {
                        handleClickPage(pageNumber);
                    }}
                    className={`hover:text-gray-300 ${pageNumber === page ? 'font-bold' : ''}`}
                >
                    {pageNumber}
                </li>
            );
        });
    };

    return (
        <ul className={'cursor-pointer flex justify-center mx-auto space-x-5'}>
            <li className={'hover:text-gray-300'} onClick={handlePrev}>
                {prevText}
            </li>
            {renderPages()}
            <li className={'hover:text-gray-300'} onClick={handleNext}>
                {nextText}
            </li>
        </ul>
    );
};
