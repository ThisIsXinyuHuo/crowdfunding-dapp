export const dateToEpochTime = (date) => {
    return Math.round(new Date(date).getTime() / 1000).toString()
}

export const isDeadlinePassed = (deadline) => {
    const currentDateTime = new Date();
    return currentDateTime > deadline;
}