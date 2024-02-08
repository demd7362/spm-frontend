const parseDate = (dateStr:string | null | undefined):DateTime => {
    if(!dateStr || dateStr.length !== 14) {
        throw new Error('날짜 포맷이 올바르지 않습니다.');
    }
    const years = Number(dateStr.substring(0,4));
    const months = Number(dateStr.substring(4,6));
    const days = Number(dateStr.substring(6,8));
    const hours = Number(dateStr.substring(8,10));
    const minutes = Number(dateStr.substring(10,12));
    const seconds = Number(dateStr.substring(12,14));
    const date = new Date(years,months - 1 ,days,hours,minutes,seconds);
    return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        date
    }
}

export default {
    parseDate
}
