"use client";

import { useState, useEffect } from "react";
import { FlexHeader } from "@/components/flex-header";
import { FlexFooter } from "@/components/flex-footer";
import { PropertyPerformanceManager } from "@/components/property-performance-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Star,
    Home,
    AlertTriangle,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import type { NormalizedReview } from "@/types/review";

export default function PropertyPerformancePage() {
    const [reviews, setReviews] = useState<NormalizedReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch reviews data
    const fetchReviews = async () => {
        setRefreshing(true);
        try {
            const response = await fetch("/api/reviews");
            const data = await response.json();
            if (data.success) {
                // Ensure dates are properly parsed
                const processedReviews = data.data.map((review: any) => ({
                    ...review,
                    submittedAt: new Date(review.submittedAt),
                }));
                setReviews(processedReviews);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Calculate overview stats
    const overviewStats = {
        totalProperties: reviews
            ? [...new Set(reviews.map((r) => r.listingName))].length
            : 0,
        totalReviews: reviews ? reviews.length : 0,
        averageRating:
            reviews && reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.overallRating, 0) /
                  reviews.length
                : 0,
        highPerformingProperties: reviews
            ? [
                  ...new Set(
                      reviews
                          .filter((r) => r.overallRating >= 4.5)
                          .map((r) => r.listingName)
                  ),
              ].length
            : 0,
        needsAttention: reviews
            ? [
                  ...new Set(
                      reviews
                          .filter((r) => r.overallRating < 4.0)
                          .map((r) => r.listingName)
                  ),
              ].length
            : 0,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <FlexHeader />
                <div className="flex items-center justify-center py-20">
                    <RefreshCw className="h-8 w-8 animate-spin text-[#284E4C]" />
                    <span className="ml-3 text-lg text-gray-600">
                        Loading property performance data...
                    </span>
                </div>
                <FlexFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <FlexHeader />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#284E4C] to-[#1a3531] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <Link href="/dashboard">
                                <Button
                                    variant="outline"
                                    className="mb-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                                Property Performance Manager
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-200 max-w-3xl">
                                Monitor, analyze, and optimize the performance
                                of all properties with comprehensive insights,
                                trend analysis, and review management.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                className="bg-white/10 hover:bg-white/20 border-white/20"
                                onClick={fetchReviews}
                                disabled={refreshing}
                            >
                                <RefreshCw
                                    className={`h-4 w-4 mr-2 ${
                                        refreshing ? "animate-spin" : ""
                                    }`}
                                />
                                Refresh Data
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
                    <Card className="bg-white shadow-lg border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Home className="h-8 w-8 text-[#284E4C]" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Properties
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {overviewStats.totalProperties}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Star className="h-8 w-8 text-yellow-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        Average Rating
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {overviewStats.averageRating.toFixed(1)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingUp className="h-8 w-8 text-green-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        High Performing
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {overviewStats.highPerformingProperties}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-8 w-8 text-red-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        Needs Attention
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {overviewStats.needsAttention}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingDown className="h-8 w-8 text-[#284E4C]" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Reviews
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {overviewStats.totalReviews}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Performance Manager Component */}
                <PropertyPerformanceManager reviews={reviews} />
            </div>

            <FlexFooter />
        </div>
    );
}
