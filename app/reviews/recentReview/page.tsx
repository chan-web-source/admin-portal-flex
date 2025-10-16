"use client";

import { RefreshCw } from "lucide-react";
import type { KayakReview } from "../../../types/review";

interface RecentReviewsProps {
 kayakReviews: KayakReview[];
 loading: boolean;
 kayakLoading: boolean;
}

export default function RecentReviews({ kayakReviews, loading, kayakLoading }: RecentReviewsProps) {
 return (
  <div className="mt-8">
   <div className="bg-white rounded-lg shadow-lg">
    <div className="px-6 py-4 bg-[#1a4d4d]">
     <h2 className="text-xl font-semibold text-white">Recent Reviews</h2>
    </div>

    <div className="p-6">
     {loading || kayakLoading ? (
      <div className="flex items-center justify-center py-8">
       <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
       <span className="text-gray-600">Loading Kayak reviews...</span>
      </div>
     ) : kayakReviews?.length > 0 ? (
      <div className="grid gap-4">
       {kayakReviews?.map((review: KayakReview, index: number) => (
        <div key={review.id} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
          <div className="flex items-center space-x-3">
           <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
             <svg
              key={i}
              className={`h-4 w-4 ${i < Math.round(review.score / 20)
               ? 'text-yellow-400'
               : 'text-gray-300'
               }`}
              fill="currentColor"
              viewBox="0 0 20 20"
             >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
             </svg>
            ))}
           </div>
           <span className="text-sm font-medium text-gray-900">
            {review.score}/100
           </span>
          </div>
          <div className="text-left sm:text-right">
           <div className="text-sm font-medium text-gray-900">{review.author}</div>
           <div className="text-xs text-gray-500">{review.localizedMonthYear}</div>
           <div className="text-xs text-blue-600">{review.siteName}</div>
          </div>
         </div>

         <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
           {review.localizedRatingCategory}
          </span>
         </div>

         {review.positiveComment && (
          <div className="mb-2">
           <p className="text-sm text-gray-700 break-words">
            <span className="font-medium text-green-700">Positive:</span> {review.positiveComment}
           </p>
          </div>
         )}

         {review.negativeComment && review.negativeComment !== "Nothing" && (
          <div className="mb-2">
           <p className="text-sm text-gray-700 break-words">
            <span className="font-medium text-red-700">Negative:</span> {review.negativeComment}
           </p>
          </div>
         )}

         {review.siteLink && (
          <div className="mt-3">
           <a
            href={review.siteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 underline"
           >
            View on {review.siteName} →
           </a>
          </div>
         )}
        </div>
       ))}
      </div>
     ) : (
      <div className="text-center py-8">
       <div className="text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews available</h3>
       </div>
      </div>
     )}
    </div>
   </div>
  </div>
 );
}
