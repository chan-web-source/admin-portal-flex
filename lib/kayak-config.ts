import type { FetchKayakReviewsParams } from "../types/review";

/**
 * Default parameters for fetching Kayak reviews
 */
export const DEFAULT_KAYAK_PARAMS: FetchKayakReviewsParams = {
 travelerTypes: '',
 months: '',
 tagClusterName: '',
 searchText: '',
 reviewSources: 'KAYAK',
 sortType: 'recent',
 includeReviewLink: true,
 reviewType: 'hotel',
 objectId: '12222',
 includeObjectId: false,
 startIndex: 0,
 amount: 10
};
