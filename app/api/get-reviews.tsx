import type { KayakReviewsResponse, FetchKayakReviewsParams } from "../../types/review";
import { DEFAULT_KAYAK_PARAMS } from "../../lib/kayak-config";
import { KAYAK_MOCK_DATA } from "../../lib/mock/kayak-mock-data";

/**
 * Fetches reviews from Kayak API
 * @param params - Query parameters for the Kayak API
 * @returns Promise<KayakReviewsResponse>
 */
const apiURL = process.env.NEXT_PUBLIC_API_URL || 'https://www.kayak.com/i/api/seo/reviews/v3';



export const fetchReviews = async (params: FetchKayakReviewsParams): Promise<KayakReviewsResponse> => {
 try {
  console.log('🔧 fetchReviews called with params:', params);

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
  console.log('🌐 Making request to proxy:', url);

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

  let data: any;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
   data = await res.json();
  } else {
   const text = await res.text();
   try {
    data = JSON.parse(text);
   } catch {
    data = text;
   }
  }

  console.log('📦 Response data:', data);
  return data as KayakReviewsResponse;
 } catch (error) {
  console.error('❌ Error in fetchReviews, returning mock data:', error);
  return KAYAK_MOCK_DATA;
 }
};
