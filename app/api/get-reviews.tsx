import type { KayakReviewsResponse, FetchKayakReviewsParams } from "../../types/review";

/**
 * Fetches reviews from Kayak API
 * @param params - Query parameters for the Kayak API
 * @returns Promise<KayakReviewsResponse>
 */
const apiURL = process.env.NEXT_PUBLIC_API_URL || 'https://www.kayak.com/i/api/seo/reviews/v3';



export const fetchKayakReviews = async (params: FetchKayakReviewsParams): Promise<KayakReviewsResponse> => {
 try {
  console.log('🔧 fetchKayakReviews called with params:', params);

  // Use the Next.js API route instead of direct Kayak API call
  const queryParams = new URLSearchParams({
   travelerTypes: params.travelerTypes || '',
   months: params.months || '',
   tagClusterName: params.tagClusterName || '',
   searchText: params.searchText || '',
   reviewSources: params.reviewSources || 'BOOKING,AGODA,PRICELINE,HOTELSCOMBINED,KAYAK',
   sortType: params.sortType || 'recent',
   includeReviewLink: (params.includeReviewLink ?? true).toString(),
   reviewType: params.reviewType || 'hotel',
   objectId: params.objectId || '12222',
   includeObjectId: (params.includeObjectId ?? false).toString(),
   startIndex: (params.startIndex ?? 0).toString(),
   amount: (params.amount ?? 10).toString()
  });

  const url = apiURL + `/filtered?${queryParams}`;
  console.log('🌐 Making request to:', url);

  const res = await fetch(url, {
   method: 'GET',
   headers: {
    'Accept': 'application/json',
   }
  });

  console.log('📡 Response status:', res.status);

  if (!res.ok) {
   throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  console.log('📦 Response data:', data);

  return data as KayakReviewsResponse;
 } catch (error) {
  console.error('❌ Error in fetchKayakReviews:', error);
  throw error;
 }
};

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