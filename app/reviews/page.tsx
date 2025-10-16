"use client";

import { useState, useEffect } from "react";

export const dynamic = 'force-dynamic';
import { FlexHeader } from "@/components/flex-header";
import { FlexPanel } from "@/components/flex-panel";
import { FlexFooter } from "@/components/flex-footer";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import ReviewsFilters from "./filters/page";
import ReviewsGrid from "./grid/page";
import ReviewsStats from "./stats/page";
import DisplayInfo from "./display/page";
import { mockReviews } from "../../lib/mock-dashboard-data";
import type { ReviewData } from "../../types/dashboard";
import { fetchReviews } from "../api/get-reviews";
import type { FetchKayakReviewsParams, KayakReview } from "../../types/review";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>(mockReviews);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showOnlyPublic, setShowOnlyPublic] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Kayak reviews state
  const [kayakReviews, setKayakReviews] = useState<KayakReview[]>([]);
  const [kayakLoading, setKayakLoading] = useState(false);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // Fetch Kayak reviews on component mount
  useEffect(() => {
    // Call refresh function on mount
    handleRefresh();
  }, []); // Empty dependency array means this runs once on mount

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      const matchesSearch = review.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProperty = selectedProperty === "all" || review.propertyName === selectedProperty;
      const matchesStatus = selectedStatus === "all" ||
        (selectedStatus === "approved" && review.isApproved) ||
        (selectedStatus === "pending" && !review.isApproved);
      const matchesPublic = !showOnlyPublic || review.isPublic;

      // If not showing all reviews, only show approved and public reviews
      const matchesDisplayCriteria = showAllReviews || (review.isApproved && review.isPublic);

      return matchesSearch && matchesProperty && matchesStatus && matchesPublic && matchesDisplayCriteria;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "date":
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "property":
          aValue = a.propertyName;
          bValue = b.propertyName;
          break;
        default:
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleRefresh = async () => {
    setRefreshing(true);
    setKayakLoading(true);
    setLoading(true);

    try {
      // Use sample params for imported fetchReviews function
      const kayakParams: FetchKayakReviewsParams = {
        travelerTypes: '',
        months: '',
        tagClusterName: '',
        searchText: '',
        reviewSources: 'BOOKING,AGODA,PRICELINE,HOTELSCOMBINED,KAYAK',
        sortType: 'recent',
        includeReviewLink: true,
        reviewType: 'hotel',
        objectId: '12222',
        includeObjectId: false,
        startIndex: 0,
        amount: 10
      };
      const kayakData = await fetchReviews(kayakParams);
      console.log('🔄 Refresh Kayak API Response:', kayakData);

      // Set Kayak reviews state
      if (kayakData.reviews && Array.isArray(kayakData.reviews)) {
        setKayakReviews(kayakData.reviews);
        console.log('✅ Updated Kayak reviews:', kayakData.reviews.length, 'reviews');
      }

    } catch (error) {
      console.error('❌ Error fetching Kayak reviews:', error);
    } finally {
      setRefreshing(false);
      setKayakLoading(false);
      setLoading(false);
    }
  };

  const handleReviewToggle = (reviewId: string, isPublic: boolean) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId ? { ...review, isPublic } : review
    ));
  };

  const handleReviewApprove = (reviewId: string, approved: boolean) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId ? { ...review, isApproved: approved } : review
    ));
  };


  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <FlexHeader onMenuToggle={toggleSidebar} />

      <div className="flex">
        {/* Sidebar */}
        <FlexPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ease-in-out overflow-y-auto h-screen ${isSidebarOpen
          ? 'ml-0 md:ml-64 lg:ml-64'
          : 'ml-0'
          }`}>
          {/* Page Header */}
          <div className="bg-[#fffdf6] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
                  <p className="text-sm text-gray-600 mt-1">Manage and moderate guest reviews. Only approved and public reviews are displayed on the website.</p>
                </div>
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-[#fffdf6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Filters and Search */}
              <ReviewsFilters
                reviews={reviews}
                searchQuery={searchQuery}
                selectedProperty={selectedProperty}
                selectedStatus={selectedStatus}
                sortBy={sortBy}
                sortOrder={sortOrder}
                showOnlyPublic={showOnlyPublic}
                showAllReviews={showAllReviews}
                onSearchChange={setSearchQuery}
                onPropertyChange={setSelectedProperty}
                onStatusChange={setSelectedStatus}
                onSortByChange={setSortBy}
                onSortOrderChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                onShowOnlyPublicChange={setShowOnlyPublic}
                onShowAllReviewsChange={setShowAllReviews}
              />

              {/* Display Info */}
              <DisplayInfo showAllReviews={showAllReviews} />

              {/* Reviews Grid */}
              <ReviewsGrid
                reviews={filteredReviews}
                onReviewToggle={handleReviewToggle}
                onReviewApprove={handleReviewApprove}
              />

              {/* Stats Summary */}
              <ReviewsStats reviews={reviews} />

              {/* Recent Reviews Section */}
              <div className="mt-8">
                <div className="bg-[white] rounded-lg shadow-lg">
                  <div className="px-6 py-4 bg-[#1a4d4d]">
                    <h2 className="text-xl font-semibold text-white">Recent Reviews</h2>
                  </div>

                  <div className="p-6">
                    {loading || kayakLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                        <span className="text-gray-600">Loading Kayak reviews...</span>
                      </div>
                    ) : kayakReviews.length > 0 ? (
                      <div className="grid gap-4">
                        {kayakReviews.map((review: KayakReview, index: number) => (
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
            </div>
          </div>

          <FlexFooter />
        </div>
      </div>
    </div>
  );
}
