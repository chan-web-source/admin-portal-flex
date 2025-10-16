"use client";

import { useState, useEffect } from "react";
import { FlexHeader } from "@/components/flex-header";
import { FlexFooter } from "@/components/flex-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewCard } from "@/components/review-card";
import { ReviewFilters } from "@/components/review-filters";
import {
    Loader2,
    ArrowLeft,
    Download,
    RefreshCw,
    BarChart3,
    Eye,
    MessageSquare,
    Check,
    Clock,
    X,
    Star,
} from "lucide-react";
import Link from "next/link";
import type {
    NormalizedReview,
    ReviewFilters as ReviewFiltersType,
} from "@/types/review";
import { mockReviewsData } from "../../lib/mock";

export default function ReviewsManagementPage() {
    const [reviews, setReviews] = useState<NormalizedReview[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<NormalizedReview[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<ReviewFiltersType>({});
    const [refreshing, setRefreshing] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportMessage, setExportMessage] = useState<string | null>(null);

    // Handle review export to CSV
    const handleExportReviews = async () => {
        setExporting(true);
        setExportMessage(null);
        try {
            const dataToExport =
                filteredReviews.length > 0 ? filteredReviews : reviews;

            if (dataToExport.length === 0) {
                setExportMessage("No reviews available to export.");
                setTimeout(() => setExportMessage(null), 3000);
                return;
            }

            // Create CSV headers
            const headers = [
                "Guest Name",
                "Property",
                "Overall Rating",
                "Review",
                "Channel",
                "Status",
                "Approved",
                "Cleanliness",
                "Communication",
                "Location",
                "Check-in",
                "Accuracy",
                "Value",
                "Submitted Date",
                "Manager Notes",
            ];

            // Convert reviews to CSV format
            const csvContent = [
                headers.join(","),
                ...dataToExport.map((review) =>
                    [
                        `"${review.guestName || ""}"`,
                        `"${review.listingName || ""}"`,
                        review.overallRating || "",
                        `"${(review.review || "").replace(/"/g, '""')}"`,
                        review.channel || "",
                        review.status || "",
                        review.isApproved ? "Yes" : "No",
                        review.categories?.cleanliness || "",
                        review.categories?.communication || "",
                        review.categories?.location || "",
                        review.categories?.checkin || "",
                        review.categories?.accuracy || "",
                        review.categories?.value || "",
                        review.submittedAt
                            ? new Date(review.submittedAt).toLocaleDateString()
                            : "",
                        `"${(review.managerNotes || "").replace(/"/g, '""')}"`,
                    ].join(",")
                ),
            ].join("\n");

            // Create and download file
            const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
            });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute(
                "download",
                `flex-reviews-${new Date().toISOString().split("T")[0]}.csv`
            );
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setExportMessage(
                `Successfully exported ${dataToExport.length} reviews!`
            );
            setTimeout(() => setExportMessage(null), 3000);
        } catch (error) {
            console.error("Error exporting reviews:", error);
            setExportMessage("Failed to export reviews. Please try again.");
            setTimeout(() => setExportMessage(null), 3000);
        } finally {
            setExporting(false);
        }
    };

    // Fetch reviews using mock data
    const fetchReviews = async () => {
        try {
            setRefreshing(true);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Use mock data instead of API call
            const data = mockReviewsData;

            if (data.success) {
                setReviews(data.data as NormalizedReview[]);
                setFilteredReviews(data.data as NormalizedReview[]);
                setError(null);
            } else {
                setError("Failed to fetch reviews");
            }
        } catch (err) {
            setError("Network error occurred");
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Handle review approval using mock data
    const handleReviewApproval = async (
        reviewId: number,
        approved: boolean,
        managerNotes?: string
    ) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            // Update the review in the local state directly
            setReviews((prev) =>
                prev.map((review) =>
                    review.id === reviewId
                        ? {
                            ...review,
                            isApproved: approved,
                            managerNotes,
                            status: approved ? "published" : "rejected",
                        }
                        : review
                )
            );
            setFilteredReviews((prev) =>
                prev.map((review) =>
                    review.id === reviewId
                        ? {
                            ...review,
                            isApproved: approved,
                            managerNotes,
                            status: approved ? "published" : "rejected",
                        }
                        : review
                )
            );
            return true;
        } catch (error) {
            console.error("Error updating review approval:", error);
            return false;
        }
    };

    // Apply filters
    useEffect(() => {
        let filtered = reviews;

        if (filters.rating) {
            filtered = filtered.filter(
                (review) => review.overallRating >= filters.rating!
            );
        }

        if (filters.status) {
            if (filters.status === "approved") {
                filtered = filtered.filter((review) => review.isApproved);
            } else if (filters.status === "pending") {
                filtered = filtered.filter(
                    (review) =>
                        !review.isApproved && review.status === "pending"
                );
            } else {
                filtered = filtered.filter(
                    (review) => review.status === filters.status
                );
            }
        }

        if (filters.channel) {
            filtered = filtered.filter(
                (review) => review.channel === filters.channel
            );
        }

        if (filters.listing) {
            filtered = filtered.filter((review) =>
                review.listingName
                    .toLowerCase()
                    .includes(filters.listing!.toLowerCase())
            );
        }

        setFilteredReviews(filtered);
    }, [reviews, filters]);

    // Load reviews on mount
    useEffect(() => {
        fetchReviews();
    }, []);

    // Statistics
    const stats = {
        total: reviews.length,
        approved: reviews.filter((r) => r.isApproved).length,
        pending: reviews.filter((r) => !r.isApproved && r.status === "pending")
            .length,
        rejected: reviews.filter((r) => r.status === "rejected").length,
        averageRating:
            reviews.length > 0
                ? Math.round(
                    (reviews.reduce((sum, r) => sum + r.overallRating, 0) /
                        reviews.length) *
                    10
                ) / 10
                : 0,
    };

    if (loading) {
        return (
            <div
                className="min-h-screen"
                style={{ backgroundColor: "#FFFDF6" }}
            >
                <FlexHeader />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-[#284E4C]" />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-[#333333] mb-2">
                                Loading Reviews
                            </h3>
                            <p className="text-sm text-[#5C5C5A]">
                                Fetching the latest reviews from all channels...
                            </p>
                        </div>
                    </div>
                </div>
                <div style={{ backgroundColor: "#FFFDF6" }}>
                    <FlexFooter />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen"
                style={{ backgroundColor: "#FFFDF6" }}
            >
                <FlexHeader />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <Card className="text-center py-16 bg-white border border-red-200 shadow-md rounded-xl max-w-md mx-auto">
                        <CardContent>
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center">
                                <X className="h-10 w-10 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#333333] mb-2">
                                Unable to Load Reviews
                            </h3>
                            <p className="text-red-600 mb-6">{error}</p>
                            <Button
                                onClick={fetchReviews}
                                className="bg-[#284E4C] hover:bg-[#1e3a38] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div style={{ backgroundColor: "#FFFDF6" }}>
                    <FlexFooter />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#FFFDF6" }}>
            <FlexHeader />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#FFF9E9] to-[#FFFDF6] pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 1px 1px, rgb(40, 78, 76) 1px, transparent 0px)",
                            backgroundSize: "24px 24px",
                        }}
                    ></div>
                </div>
                <div className="container mx-auto px-4 relative">
                    <div className="mx-auto text-center max-w-4xl">
                        <div className="mb-8">
                            <div className="flex items-center justify-center mb-6">
                                <Link href="/dashboard">
                                    <Button
                                        variant="outline"
                                        className="border-[#284E4C]/20 text-[#284E4C] hover:bg-[#284E4C] hover:text-white shadow-sm hover:shadow-lg transition-all duration-200"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Dashboard
                                    </Button>
                                </Link>
                            </div>
                            <h1
                                className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#333333] mb-6 leading-tight"
                                style={{
                                    fontFamily:
                                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                }}
                            >
                                <span>Reviews</span>
                                <span className="text-[#284E4C] ml-4">
                                    Management
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-[#5C5C5A] mx-auto leading-relaxed max-w-3xl">
                                Manage guest reviews, approve for public
                                display, and track feedback across all
                                properties with powerful analytics and insights.
                            </p>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full backdrop-blur-sm border border-[#284E4C]/10">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-[#5C5C5A]">
                                    Live monitoring
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full backdrop-blur-sm border border-[#284E4C]/10">
                                <MessageSquare className="h-4 w-4 text-[#284E4C]" />
                                <span className="text-sm font-medium text-[#5C5C5A]">
                                    {stats.pending} pending reviews
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="py-8" style={{ backgroundColor: "#FFFDF6" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                        <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                                        <MessageSquare className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                                        +12%
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-[#333333] mb-1">
                                    {stats.total}
                                </h3>
                                <p className="text-sm text-[#5C5C5A] font-medium">
                                    Total Reviews
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                                        <Check className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                                        {Math.round(
                                            (stats.approved / stats.total) * 100
                                        )}
                                        %
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-[#333333] mb-1">
                                    {stats.approved}
                                </h3>
                                <p className="text-sm text-[#5C5C5A] font-medium">
                                    Approved
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                                        <Clock className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
                                        Pending
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-[#333333] mb-1">
                                    {stats.pending}
                                </h3>
                                <p className="text-sm text-[#5C5C5A] font-medium">
                                    Awaiting Approval
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                                        <X className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-medium">
                                        Filtered
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-[#333333] mb-1">
                                    {stats.rejected}
                                </h3>
                                <p className="text-sm text-[#5C5C5A] font-medium">
                                    Rejected
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                                        <Star className="h-6 w-6 text-yellow-600 fill-current" />
                                    </div>
                                    <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full font-medium">
                                        /10
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-[#333333] mb-1">
                                    {stats.averageRating}
                                </h3>
                                <p className="text-sm text-[#5C5C5A] font-medium">
                                    Average Rating
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enhanced Actions Bar */}
                    <div className="bg-white rounded-xl shadow-md border border-[#284E4C]/10 p-6 mb-8">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    onClick={fetchReviews}
                                    variant="outline"
                                    disabled={refreshing}
                                    className="border-[#284E4C]/20 text-[#284E4C] hover:bg-[#284E4C] hover:text-white shadow-sm hover:shadow-lg transition-all duration-200"
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""
                                            }`}
                                    />
                                    {refreshing ? "Refreshing..." : "Refresh"}
                                </Button>
                                <Link href="/dashboard/analytics">
                                    <Button
                                        variant="outline"
                                        className="border-[#284E4C]/20 text-[#284E4C] hover:bg-[#284E4C] hover:text-white shadow-sm hover:shadow-lg transition-all duration-200"
                                    >
                                        <BarChart3 className="h-4 w-4 mr-2" />
                                        Analytics
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Link href="/#public-reviews">
                                    <Button
                                        variant="outline"
                                        className="border-[#284E4C]/20 text-[#5C5C5A] hover:bg-[#284E4C] hover:text-white shadow-sm hover:shadow-lg transition-all duration-200"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Preview Public Page
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={handleExportReviews}
                                    disabled={exporting}
                                    className="border-[#284E4C]/20 text-[#5C5C5A] hover:bg-[#284E4C] hover:text-white shadow-sm hover:shadow-lg transition-all duration-200"
                                >
                                    {exporting ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4 mr-2" />
                                    )}
                                    {exporting
                                        ? "Exporting..."
                                        : "Export Reviews"}
                                </Button>
                            </div>
                        </div>
                        {exportMessage && (
                            <div
                                className={`mt-4 p-3 rounded-lg text-sm ${exportMessage.includes("Successfully")
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : exportMessage.includes("Failed")
                                        ? "bg-red-50 text-red-700 border border-red-200"
                                        : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                    }`}
                            >
                                {exportMessage}
                            </div>
                        )}
                    </div>

                    {/* Filters */}
                    <ReviewFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        totalReviews={reviews.length}
                        filteredReviews={filteredReviews.length}
                    />

                    {/* Enhanced Reviews Grid */}
                    {filteredReviews.length > 0 ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-[#333333]">
                                    Reviews ({filteredReviews.length})
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-[#5C5C5A]">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span>Live</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {filteredReviews.map((review) => (
                                    <ReviewCard
                                        key={review.id}
                                        review={review}
                                        onApprove={handleReviewApproval}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Card className="text-center py-16 bg-white shadow-md border border-[#284E4C]/10 rounded-xl">
                            <CardContent>
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#284E4C]/10 to-[#284E4C]/20 rounded-full flex items-center justify-center">
                                        <MessageSquare className="h-10 w-10 text-[#284E4C]" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#333333] mb-2">
                                        {reviews.length === 0
                                            ? "No reviews yet"
                                            : "No matching reviews"}
                                    </h3>
                                    <p className="text-[#5C5C5A] mb-6">
                                        {reviews.length === 0
                                            ? "Reviews will appear here once guests start submitting feedback."
                                            : "Try adjusting your filters to see more reviews."}
                                    </p>
                                    {Object.keys(filters).length > 0 && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setFilters({})}
                                            className="bg-white border-[#284E4C]/20 text-[#284E4C] hover:bg-[#284E4C] hover:text-white shadow-sm hover:shadow-lg transition-all duration-200"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Clear All Filters
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <FlexFooter />
        </div>
    );
}
