import {useCallback, useState} from "react";

export default function usePagination<T extends CommonPagination>(page: number, pageSize: number, bottomSize: number) {
    const [pagination, setPagination] = useState<T>({
        page,
        pageSize,
        totalPages: 1,
        content: [] as any[]
    } as T);
    const handlePrev = useCallback(() => {
        setPagination((prev) => {
            const {page: prevPage, totalPages} = prev;
            const page = Math.max(prevPage - bottomSize, 1);
            const firstNumber =
                Math.floor((page - 1) / bottomSize) * bottomSize + 1;
            const lastNumber = Math.min(
                firstNumber + bottomSize - 1,
                totalPages,
            );
            const currentPage =
                Math.floor(Math.max(prevPage - 1, 1) / bottomSize) === 0
                    ? 1
                    : lastNumber;
            return {
                ...prev,
                page: currentPage,
            };
        });
    }, [bottomSize])
    const handleNext = useCallback(() => {
        setPagination((prev) => {
            const {page: prevPage, totalPages} = prev;
            const page = Math.min(prevPage + bottomSize, totalPages);
            const firstNumber = page - (page % bottomSize) + 1;
            // const lastNumber = Math.min(firstNumber + bottomSize - 1, totalPage);
            let currentPage = Math.min(firstNumber, page);
            currentPage =
                totalPages - prevPage < bottomSize ? totalPages : currentPage;
            return {
                ...prev,
                page: currentPage,
            };
        });
    }, [bottomSize])
    const handleClickPage = useCallback((page: number) => {
        setPagination((prev) => {
            return {
                ...prev,
                page,
            };
        });
    }, [])

    return {
        pagination,
        setPagination,
        handleNext,
        handlePrev,
        handleClickPage
    }
}
