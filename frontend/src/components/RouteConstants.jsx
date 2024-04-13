export const rootPath = "/";
export const userProfilePath = "/profile";
export const createCampaignPath = "/create-campaign";

export const campaignPath = "campaign/:id";
export const buildCampaignPath = (campaignId) => `campaign/${campaignId}`;

export const buildAbsoluteCampaignPath = (campaignId) => `/campaign/${campaignId}`;
