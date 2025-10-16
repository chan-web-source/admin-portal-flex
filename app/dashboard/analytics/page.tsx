"use client";

import { useState, useEffect } from "react";
import { useReviews } from "@/hooks/use-reviews";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { generateReviewAnalytics } from "@/lib/review-analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReviewAnalytics } from "@/types/review";

export default function AnalyticsPage() {
    // Use real data for analytics - fallback to demo if no real data exists
    const { reviews, loading, error } = useReviews();
    const [analytics, setAnalytics] = useState<ReviewAnalytics | null>(null);

    useEffect(() => {
        if (reviews.length > 0) {
            const analyticsData = generateReviewAnalytics(reviews);
            setAnalytics(analyticsData);
        }
    }, [reviews]);

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center font-sans"
                style={{ backgroundColor: "#FFFDF6" }}
            >
                <div className="flex items-center gap-2">
                    <Loader2
                        className="h-6 w-6 animate-spin"
                        style={{ color: "#284E4C" }}
                    />
                    <span className="font-sans" style={{ color: "#333333" }}>
                        Loading analytics...
                    </span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen flex items-center justify-center font-sans"
                style={{ backgroundColor: "#FFFDF6" }}
            >
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="text-red-600 font-sans">
                                Error loading analytics
                            </div>
                            <p
                                className="text-sm font-sans"
                                style={{ color: "#5C5C5A" }}
                            >
                                {error}
                            </p>
                            <Button
                                onClick={() => window.location.reload()}
                                className="font-sans"
                                style={{
                                    backgroundColor: "#284E4C",
                                    color: "#FFFDF6",
                                }}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen font-sans"
            style={{ backgroundColor: "#FFFDF6" }}
        >
            <div className="border-b" style={{ backgroundColor: "#FFFDF6" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <div>
                                <h1
                                    className="text-2xl font-bold font-sans"
                                    style={{ color: "#333333" }}
                                >
                                    Analytics
                                </h1>
                                <p
                                    className="mt-1 font-sans"
                                    style={{ color: "#5C5C5A" }}
                                >
                                    Insights and trends from your guest reviews
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="font-sans"
                                style={{
                                    borderColor: "#284E4C",
                                    color: "#284E4C",
                                }}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {analytics ? (
                    <AnalyticsDashboard
                        analytics={analytics}
                        isDemoData={false}
                        reviews={reviews}
                    />
                ) : (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-8">
                                <p
                                    className="font-sans"
                                    style={{ color: "#5C5C5A" }}
                                >
                                    No review data available for analytics.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
