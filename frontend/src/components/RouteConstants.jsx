export const rootPath = "/";
export const userProfilePath = "/profile";
export const createCampaignPath = "/create-campaign";

export const campaignPath = "campaign/:id";
export const buildCampaignPath = (campaignId) => `campaign/${campaignId}`;

export const contributeCampaignPath = "contribute/campaign/:id";
export const buildContributeCampaignPath = (campaignId) =>  `contribute/campaign/${campaignId}`;