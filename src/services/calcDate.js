export const calcDate = (date) => {
    const crrDate = new Date();
    let difference = crrDate.getTime() - date.getTime();
    const years = Math.ceil(difference / (1000 * 3600 * 24));
    return Math.floor(years / 365);
}