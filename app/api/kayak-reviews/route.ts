import { NextRequest, NextResponse } from 'next/server';
import { fetchKayakReviews, DEFAULT_KAYAK_PARAMS } from '../get-reviews';
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

  const reviews = await fetchKayakReviews(params);

  return NextResponse.json(reviews);
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

  const reviews = await fetchKayakReviews(params);

  return NextResponse.json(reviews);
 } catch (error) {
  console.error('Error in Kayak reviews API route:', error);
  return NextResponse.json(
   { error: 'Failed to fetch reviews' },
   { status: 500 }
  );
 }
}
