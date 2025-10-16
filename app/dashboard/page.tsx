"use client";

import { useState, useEffect } from "react";
import { FlexHeader } from "@/components/flex-header";
import { FlexFooter } from "@/components/flex-footer";
import { PropertyPerformance } from "@/components/property-performance";
import { DashboardInsights } from "@/components/dashboard-insights";
import { ReviewManagementWidget } from "@/components/review-management-widget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    TrendingUp,
    TrendingDown,
    Home,
    Users,
    Star,
    DollarSign,
    MessageSquare,
    Bell,
    Download,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    AlertTriangle,
    Clock,
} from "lucide-react";
import Link from "next/link";
import type { NormalizedReview } from "@/types/review";

export default function ManagerDashboard() {
    const [timeRange, setTimeRange] = useState("all");
    const [activeTab, setActiveTab] = useState("overview");
    const [reviews, setReviews] = useState<NormalizedReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch data
    useEffect(() => {
        fetchData();
    }, [timeRange]);

    const fetchData = async () => {
        try {
            setRefreshing(true);

            // Fetch reviews and stats in parallel
            let reviewsResponse = await fetch("/api/reviews");
            let reviewsData = await reviewsResponse.json();
            let usingDemoData = false;

            // Fallback to demo data if no reviews found
            if (!reviewsData.success || reviewsData.data.length === 0) {
                console.log("No real reviews found, using demo data");
                reviewsResponse = await fetch("/api/reviews/demo");
                reviewsData = await reviewsResponse.json();
                usingDemoData = true;
            }

            const statsResponse = await fetch(
                `/api/dashboard/stats?timeRange=${timeRange}`
            );
            const statsData = await statsResponse.json();

            if (reviewsData.success) {
                // Process reviews with proper date parsing
                const processedReviews = reviewsData.data.map(
                    (review: any) => ({
                        ...review,
                        submittedAt: new Date(review.submittedAt),
                    })
                );
                setReviews(processedReviews);

                // If using demo data, recalculate review counts from actual review data
                if (usingDemoData && statsData.success) {
                    const pendingCount = processedReviews.filter(
                        (r: any) => !r.isApproved && r.status === "pending"
                    ).length;
                    const approvedCount = processedReviews.filter(
                        (r: any) => r.isApproved
                    ).length;
                    const rejectedCount = processedReviews.filter(
                        (r: any) => r.status === "rejected"
                    ).length;

                    // Calculate average rating from demo reviews
                    const avgRating =
                        processedReviews.length > 0
                            ? processedReviews.reduce(
                                  (sum: number, r: any) =>
                                      sum + r.overallRating,
                                  0
                              ) / processedReviews.length
                            : 0;

                    // Update stats with real review counts
                    statsData.data.pendingReviews = pendingCount;
                    statsData.data.approvedReviews = approvedCount;
                    statsData.data.rejectedReviews = rejectedCount;
                    statsData.data.totalReviews = processedReviews.length;
                    statsData.data.averageRating = Number(avgRating.toFixed(1));
                }
            }

            if (statsData.success) {
                setDashboardStats(statsData.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            // Try demo data as final fallback
            try {
                const demoResponse = await fetch("/api/reviews/demo");
                const demoData = await demoResponse.json();
                if (demoData.success) {
                    const processedReviews = demoData.data.map(
                        (review: any) => ({
                            ...review,
                            submittedAt: new Date(review.submittedAt),
                        })
                    );
                    setReviews(processedReviews);

                    // Calculate stats from demo reviews
                    const pendingCount = processedReviews.filter(
                        (r: any) => !r.isApproved && r.status === "pending"
                    ).length;
                    const approvedCount = processedReviews.filter(
                        (r: any) => r.isApproved
                    ).length;
                    const avgRating =
                        processedReviews.length > 0
                            ? processedReviews.reduce(
                                  (sum: number, r: any) =>
                                      sum + r.overallRating,
                                  0
                              ) / processedReviews.length
                            : 0;

                    setDashboardStats((prev) => ({
                        ...prev,
                        pendingReviews: pendingCount,
                        approvedReviews: approvedCount,
                        totalReviews: processedReviews.length,
                        averageRating: Number(avgRating.toFixed(1)),
                    }));
                }
            } catch (demoError) {
                console.error("Failed to fetch demo data:", demoError);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchReviews = fetchData; // Keep for backward compatibility

    // Export dashboard data as CSV
    const exportDashboardData = () => {
        try {
            // Prepare dashboard summary data
            const summaryData = [
                ["Dashboard Summary", ""],
                ["Export Date", new Date().toLocaleString()],
                ["Time Range", timeRange === "all" ? "All Time" : timeRange],
                ["", ""],
                ["Metric", "Value"],
                [
                    "Total Revenue",
                    `£${dashboardStats.totalRevenue.toLocaleString()}`,
                ],
                [
                    "Revenue Change",
                    `${dashboardStats.revenueChange > 0 ? "+" : ""}${
                        dashboardStats.revenueChange
                    }%`,
                ],
                ["Total Properties", dashboardStats.totalProperties.toString()],
                [
                    "Properties Change",
                    `${dashboardStats.propertiesChange > 0 ? "+" : ""}${
                        dashboardStats.propertiesChange
                    }%`,
                ],
                ["Total Reviews", dashboardStats.totalReviews.toString()],
                [
                    "Reviews Change",
                    `${dashboardStats.reviewsChange > 0 ? "+" : ""}${
                        dashboardStats.reviewsChange
                    }%`,
                ],
                [
                    "Average Rating",
                    `${dashboardStats.averageRating.toFixed(1)}/10`,
                ],
                [
                    "Rating Change",
                    `${
                        dashboardStats.ratingChange > 0 ? "+" : ""
                    }${dashboardStats.ratingChange.toFixed(1)}`,
                ],
                ["Occupancy Rate", `${dashboardStats.occupancyRate}%`],
                [
                    "Occupancy Change",
                    `${dashboardStats.occupancyChange > 0 ? "+" : ""}${
                        dashboardStats.occupancyChange
                    }%`,
                ],
                ["Response Rate", `${dashboardStats.responseRate}%`],
                [
                    "Response Change",
                    `${dashboardStats.responseChange > 0 ? "+" : ""}${
                        dashboardStats.responseChange
                    }%`,
                ],
                ["Pending Reviews", dashboardStats.pendingReviews.toString()],
                ["Approved Reviews", dashboardStats.approvedReviews.toString()],
            ];

            // Convert summary to CSV
            let csvContent = summaryData
                .map((row) => row.map((field) => `"${field}"`).join(","))
                .join("\n");

            // Add reviews data if available
            if (reviews.length > 0) {
                csvContent += "\n\n";
                csvContent += "Recent Reviews\n";
                csvContent +=
                    '"Property","Guest Name","Rating","Comment","Date","Status","Channel"\n';

                reviews.slice(0, 100).forEach((review) => {
                    csvContent +=
                        [
                            `"${review.listingName || "N/A"}"`,
                            `"${review.guestName || "Anonymous"}"`,
                            `"${review.overallRating || "N/A"}"`,
                            `"${(review.review || "").replace(/"/g, '""')}"`,
                            `"${
                                review.submittedAt
                                    ? new Date(
                                          review.submittedAt
                                      ).toLocaleDateString()
                                    : "N/A"
                            }"`,
                            `"${review.isApproved ? "Approved" : "Pending"}"`,
                            `"${review.channel || "N/A"}"`,
                        ].join(",") + "\n";
                });
            }

            // Create and download the file
            const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
            });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);

            link.setAttribute("href", url);
            link.setAttribute(
                "download",
                `dashboard-export-${new Date().toISOString().split("T")[0]}.csv`
            );
            link.style.visibility = "hidden";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log("Dashboard data exported successfully");
        } catch (error) {
            console.error("Error exporting dashboard data:", error);
            alert("Failed to export dashboard data. Please try again.");
        }
    };

    // Handle review approval
    const handleReviewApproval = async (
        reviewId: number,
        approved: boolean,
        managerNotes?: string
    ) => {
        try {
            const response = await fetch(`/api/reviews/${reviewId}/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ approved, managerNotes }),
            });

            const data = await response.json();
            if (data.success) {
                // Update local state
                setReviews((prev) =>
                    prev.map((review) =>
                        review.id === reviewId
                            ? { ...review, isApproved: approved, managerNotes }
                            : review
                    )
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error approving review:", error);
            return false;
        }
    };

    // Dashboard stats state
    const [dashboardStats, setDashboardStats] = useState({
        totalRevenue: 0,
        revenueChange: 0,
        totalProperties: 0,
        propertiesChange: 0,
        totalReviews: 0,
        reviewsChange: 0,
        averageRating: 0,
        ratingChange: 0,
        occupancyRate: 0,
        occupancyChange: 0,
        responseRate: 0,
        responseChange: 0,
        pendingReviews: 0,
        approvedReviews: 0,
    });

    const quickActions = [
        {
            icon: MessageSquare,
            label: "Manage Reviews",
            color: "bg-green-500",
            href: "/dashboard/reviews",
        },
        {
            icon: BarChart3,
            label: "View Analytics",
            color: "bg-purple-500",
            href: "/dashboard/analytics",
        },
        {
            icon: Home,
            label: "Property Performance",
            color: "bg-blue-500",
            href: "/dashboard/properties",
        },
        {
            icon: Users,
            label: "Public Reviews",
            color: "bg-indigo-500",
            href: "/dashboard/public-reviews",
        },
    ];

    if (loading) {
        return (
            <div
                className="min-h-screen"
                style={{ backgroundColor: "#FFFDF6" }}
            >
                <FlexHeader />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="h-8 w-8 animate-spin text-[#284E4C]" />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-[#333333] mb-2">
                                Loading dashboard...
                            </h3>
                            <p className="text-sm text-[#5C5C5A]">
                                Fetching your latest property data
                            </p>
                        </div>
                    </div>
                </div>
                <FlexFooter />
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
                            <h1
                                className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#333333] mb-6 leading-tight"
                                style={{
                                    fontFamily:
                                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                }}
                            >
                                <span>Manager</span>
                                <span className="text-[#284E4C] ml-4">
                                    Dashboard
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-[#5C5C5A] mx-auto leading-relaxed max-w-3xl">
                                Welcome back! Monitor your property performance,
                                manage reviews, and gain insights from your
                                flexible living portfolio.
                            </p>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full backdrop-blur-sm border border-[#284E4C]/10">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-[#5C5C5A]">
                                    All systems operational
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full backdrop-blur-sm border border-[#284E4C]/10">
                                <Bell className="h-4 w-4 text-[#284E4C]" />
                                <span className="text-sm font-medium text-[#5C5C5A]">
                                    {dashboardStats.pendingReviews} pending
                                    reviews
                                </span>
                            </div>
                            {dashboardStats.pendingReviews > 10 && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-200">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm font-medium text-amber-700">
                                        High volume
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Action Controls */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Select
                                value={timeRange}
                                onValueChange={setTimeRange}
                            >
                                <SelectTrigger className="w-40 bg-white border-[#284E4C]/20 text-[#5C5C5A] shadow-sm">
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All time
                                    </SelectItem>
                                    <SelectItem value="7d">
                                        Last 7 days
                                    </SelectItem>
                                    <SelectItem value="30d">
                                        Last 30 days
                                    </SelectItem>
                                    <SelectItem value="90d">
                                        Last 3 months
                                    </SelectItem>
                                    <SelectItem value="1y">
                                        Last year
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                className="bg-[#284E4C] hover:bg-[#1e3a38] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                onClick={fetchReviews}
                                disabled={refreshing}
                            >
                                <RefreshCw
                                    className={`h-4 w-4 mr-2 ${
                                        refreshing ? "animate-spin" : ""
                                    }`}
                                />
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                className="border-[#284E4C] text-[#284E4C] hover:bg-[#284E4C] hover:text-white shadow-sm hover:shadow-lg transition-all duration-200"
                                onClick={exportDashboardData}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <main className="py-8" style={{ backgroundColor: "#FFFDF6" }}>
                {/* Main Dashboard Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="space-y-8"
                    >
                        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg border border-[#284E4C]/10 rounded-xl p-1 h-14">
                            <TabsTrigger
                                value="overview"
                                className="data-[state=active]:bg-[#284E4C] data-[state=active]:text-white text-[#5C5C5A] font-medium rounded-lg transition-all duration-200 h-12 text-sm sm:text-base"
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="properties"
                                className="data-[state=active]:bg-[#284E4C] data-[state=active]:text-white text-[#5C5C5A] font-medium rounded-lg transition-all duration-200 h-12 text-sm sm:text-base"
                            >
                                Properties
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="data-[state=active]:bg-[#284E4C] data-[state=active]:text-white text-[#5C5C5A] font-medium rounded-lg transition-all duration-200 h-12 text-sm sm:text-base"
                            >
                                Reviews
                            </TabsTrigger>
                            <TabsTrigger
                                value="trends"
                                className="data-[state=active]:bg-[#284E4C] data-[state=active]:text-white text-[#5C5C5A] font-medium rounded-lg transition-all duration-200 h-12 text-sm sm:text-base"
                            >
                                Trends
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-8">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                                <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                                                <DollarSign className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                                                    dashboardStats.revenueChange >
                                                    0
                                                        ? "text-green-700 bg-green-50"
                                                        : "text-red-700 bg-red-50"
                                                }`}
                                            >
                                                {dashboardStats.revenueChange >
                                                0 ? (
                                                    <ArrowUpRight className="h-3 w-3" />
                                                ) : (
                                                    <ArrowDownRight className="h-3 w-3" />
                                                )}
                                                {Math.abs(
                                                    dashboardStats.revenueChange
                                                )}
                                                %
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold text-[#333333] mb-1">
                                            £
                                            {dashboardStats.totalRevenue.toLocaleString()}
                                        </h3>
                                        <p className="text-sm text-[#5C5C5A] font-medium">
                                            Total Revenue
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                                                <Home className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                                                    dashboardStats.propertiesChange >
                                                    0
                                                        ? "text-green-700 bg-green-50"
                                                        : "text-red-700 bg-red-50"
                                                }`}
                                            >
                                                {dashboardStats.propertiesChange >
                                                0 ? (
                                                    <ArrowUpRight className="h-3 w-3" />
                                                ) : (
                                                    <ArrowDownRight className="h-3 w-3" />
                                                )}
                                                {Math.abs(
                                                    dashboardStats.propertiesChange
                                                )}
                                                %
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold text-[#333333] mb-1">
                                            {dashboardStats.totalProperties}
                                        </h3>
                                        <p className="text-sm text-[#5C5C5A] font-medium">
                                            Active Properties
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                                                <Star className="h-6 w-6 text-yellow-600" />
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                                                    dashboardStats.ratingChange >
                                                    0
                                                        ? "text-green-700 bg-green-50"
                                                        : "text-red-700 bg-red-50"
                                                }`}
                                            >
                                                {dashboardStats.ratingChange >
                                                0 ? (
                                                    <ArrowUpRight className="h-3 w-3" />
                                                ) : (
                                                    <ArrowDownRight className="h-3 w-3" />
                                                )}
                                                {Math.abs(
                                                    dashboardStats.ratingChange
                                                )}
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold text-[#333333] mb-1">
                                            {dashboardStats.averageRating.toFixed(
                                                1
                                            )}
                                        </h3>
                                        <p className="text-sm text-[#5C5C5A] font-medium">
                                            Average Rating
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                                                <MessageSquare className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                                                    dashboardStats.reviewsChange >
                                                    0
                                                        ? "text-green-700 bg-green-50"
                                                        : "text-red-700 bg-red-50"
                                                }`}
                                            >
                                                {dashboardStats.reviewsChange >
                                                0 ? (
                                                    <ArrowUpRight className="h-3 w-3" />
                                                ) : (
                                                    <ArrowDownRight className="h-3 w-3" />
                                                )}
                                                {Math.abs(
                                                    dashboardStats.reviewsChange
                                                )}
                                                %
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold text-[#333333] mb-1">
                                            {dashboardStats.totalReviews.toLocaleString()}
                                        </h3>
                                        <p className="text-sm text-[#5C5C5A] font-medium">
                                            Total Reviews
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                                                <Users className="h-6 w-6 text-orange-600" />
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                                                    dashboardStats.occupancyChange >
                                                    0
                                                        ? "text-green-700 bg-green-50"
                                                        : "text-red-700 bg-red-50"
                                                }`}
                                            >
                                                {dashboardStats.occupancyChange >
                                                0 ? (
                                                    <ArrowUpRight className="h-3 w-3" />
                                                ) : (
                                                    <ArrowDownRight className="h-3 w-3" />
                                                )}
                                                {Math.abs(
                                                    dashboardStats.occupancyChange
                                                )}
                                                %
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold text-[#333333] mb-1">
                                            {dashboardStats.occupancyRate}%
                                        </h3>
                                        <p className="text-sm text-[#5C5C5A] font-medium">
                                            Occupancy Rate
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                                                <Clock className="h-6 w-6 text-teal-600" />
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                                                    dashboardStats.responseChange >
                                                    0
                                                        ? "text-green-700 bg-green-50"
                                                        : "text-red-700 bg-red-50"
                                                }`}
                                            >
                                                {dashboardStats.responseChange >
                                                0 ? (
                                                    <ArrowUpRight className="h-3 w-3" />
                                                ) : (
                                                    <ArrowDownRight className="h-3 w-3" />
                                                )}
                                                {Math.abs(
                                                    dashboardStats.responseChange
                                                )}
                                                %
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold text-[#333333] mb-1">
                                            {dashboardStats.responseRate}%
                                        </h3>
                                        <p className="text-sm text-[#5C5C5A] font-medium">
                                            Response Rate
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <div className="text-center mb-8">
                                    <h2
                                        className="text-3xl md:text-4xl font-bold text-[#333333] mb-4"
                                        style={{
                                            fontFamily:
                                                '"Helvetica Neue", Helvetica, Arial, sans-serif',
                                        }}
                                    >
                                        Quick Actions
                                    </h2>
                                    <p className="text-lg text-[#5C5C5A] max-w-2xl mx-auto">
                                        Access your most important management
                                        tools quickly and efficiently
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {quickActions.map((action, index) => (
                                        <Link key={index} href={action.href}>
                                            <Card className="group bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-[#284E4C]/10 rounded-xl overflow-hidden cursor-pointer transform hover:-translate-y-1">
                                                <CardContent className="p-6 text-center">
                                                    <div
                                                        className={`inline-flex p-4 rounded-xl ${action.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                                                    >
                                                        <action.icon className="h-6 w-6 text-white" />
                                                    </div>
                                                    <h3 className="font-semibold text-[#333333] group-hover:text-[#284E4C] transition-colors duration-200">
                                                        {action.label}
                                                    </h3>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Review Management Widget */}
                            <ReviewManagementWidget
                                reviews={reviews}
                                onReviewApproval={handleReviewApproval}
                            />
                        </TabsContent>

                        {/* Properties Tab */}
                        <TabsContent value="properties" className="space-y-8">
                            <div className="bg-white rounded-xl border border-[#284E4C]/10 shadow-md overflow-hidden">
                                <PropertyPerformance reviews={reviews} />
                            </div>
                        </TabsContent>

                        {/* Reviews Tab */}
                        <TabsContent value="reviews" className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-xl border border-[#284E4C]/10 shadow-md overflow-hidden">
                                        <ReviewManagementWidget
                                            reviews={reviews}
                                            onReviewApproval={
                                                handleReviewApproval
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Card className="bg-white shadow-md border border-[#284E4C]/10 rounded-xl overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-[#FFF9E9] to-[#FFFDF6] border-b border-[#284E4C]/10">
                                            <CardTitle className="text-[#333333] font-bold">
                                                Review Statistics
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-[#5C5C5A] font-medium">
                                                        Total Reviews
                                                    </span>
                                                    <span className="font-bold text-lg text-[#333333]">
                                                        {
                                                            dashboardStats.totalReviews
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-[#5C5C5A] font-medium">
                                                        Average Rating
                                                    </span>
                                                    <span className="font-bold text-lg text-[#333333]">
                                                        {dashboardStats.averageRating.toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-[#5C5C5A] font-medium">
                                                        Approved
                                                    </span>
                                                    <span className="font-bold text-lg text-green-600">
                                                        {
                                                            dashboardStats.approvedReviews
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-[#5C5C5A] font-medium">
                                                        Pending
                                                    </span>
                                                    <span className="font-bold text-lg text-amber-600">
                                                        {
                                                            dashboardStats.pendingReviews
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Trends Tab */}
                        <TabsContent value="trends" className="space-y-8">
                            <div className="bg-white rounded-xl border border-[#284E4C]/10 shadow-md overflow-hidden">
                                <DashboardInsights
                                    reviews={reviews}
                                    timeRange={timeRange}
                                    dashboardStats={dashboardStats}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <div style={{ backgroundColor: "#FFFDF6" }}>
                <FlexFooter />
            </div>
        </div>
    );
}
