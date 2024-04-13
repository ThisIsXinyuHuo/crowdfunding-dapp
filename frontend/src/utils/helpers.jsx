export const dateToEpochTime = (date) => {
    return Math.round(new Date(date).getTime() / 1000).toString()
}

export const isDeadlinePassed = (deadline) => {
    const currentDateTime = new Date();
    return currentDateTime > deadline;
}

const stateMap = {
    0: "OPEN",
    1: "CANCELLED",
    2: "SUCCESSFUL",
    3: "CLOSED",
}
export const parseCampaignState = (campaignState) => {
    return stateMap[campaignState];
}
