const isNumber = (arg:string | undefined):boolean => {
    if(arg === undefined) return false;
    const number = Number(arg);
    return !isNaN(number);
}


export default {
    isNumber,
}
