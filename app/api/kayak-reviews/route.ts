import { NextRequest, NextResponse } from 'next/server';
import { fetchReviews } from '../get-reviews';
import { DEFAULT_KAYAK_PARAMS } from '../../../lib/kayak-config';
import type { FetchKayakReviewsParams } from '../../../types/review';

export async function GET(request: NextRequest) {
 try {
  const { searchParams } = new URL(request.url);

  // Extract parameters from query string
  const params: FetchKayakReviewsParams = {
   travelerTypes: searchParams.get('travelerTypes') || DEFAULT_KAYAK_PARAMS.travelerTypes,
   months: searchParams.get('months') || DEFAULT_KAYAK_PARAMS.months,
   tagClusterName: searchParams.get('tagClusterName') || DEFAULT_KAYAK_PARAMS.tagClusterName,
   searchText: searchParams.get('searchText') || DEFAULT_KAYAK_PARAMS.searchText,
   reviewSources: searchParams.get('reviewSources') || DEFAULT_KAYAK_PARAMS.reviewSources,
   sortType: searchParams.get('sortType') || DEFAULT_KAYAK_PARAMS.sortType,
   includeReviewLink: searchParams.get('includeReviewLink') === 'true' || DEFAULT_KAYAK_PARAMS.includeReviewLink,
   reviewType: searchParams.get('reviewType') || DEFAULT_KAYAK_PARAMS.reviewType,
   objectId: searchParams.get('objectId') || DEFAULT_KAYAK_PARAMS.objectId,
   includeObjectId: searchParams.get('includeObjectId') === 'true' || DEFAULT_KAYAK_PARAMS.includeObjectId,
   startIndex: parseInt(searchParams.get('startIndex') || '0') || DEFAULT_KAYAK_PARAMS.startIndex,
   amount: parseInt(searchParams.get('amount') || '10') || DEFAULT_KAYAK_PARAMS.amount,
  };

  // Proxy to Kayak API with proper authentication headers
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

  const kayakUrl = `https://www.kayak.com/i/api/seo/reviews/v3/filtered?${queryParams}`;
  console.log('🌐 Proxying to Kayak API:', kayakUrl);

  const res = await fetch(kayakUrl, {
   method: 'GET',
   headers: {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.kayak.com/',
    'Origin': 'https://www.kayak.com',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'X-Requested-With': 'XMLHttpRequest',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
   },
   // Add proxy-like behavior similar to Vite
   redirect: 'follow',
   // follow: 5
  });

  console.log('📡 Kayak API response status:', res.status);

  if (!res.ok) {
   console.error('❌ Kayak API error:', res.status, res.statusText);
   throw new Error(`Kayak API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('📦 Kayak API response data:', data);

  return NextResponse.json(data, {
   headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
   }
  });
 } catch (error) {
  console.error('Error in Kayak reviews API route:', error);
  return NextResponse.json(
   { error: 'Failed to fetch reviews' },
   { status: 500 }
  );
 }
}

export async function POST(request: NextRequest) {
 try {
  const body = await request.json();
  const params: FetchKayakReviewsParams = {
   ...DEFAULT_KAYAK_PARAMS,
   ...body
  };

  const reviews = await fetchReviews(params);

  return NextResponse.json(reviews);
 } catch (error) {
  console.error('Error in Kayak reviews API route:', error);
  return NextResponse.json(
   { error: 'Failed to fetch reviews' },
   { status: 500 }
  );
 }
}
