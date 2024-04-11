export const dateToEpochTime = (date) => {
    return Math.round(new Date(date).getTime() / 1000).toString()
}