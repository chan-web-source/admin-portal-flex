import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Demo data for when database is empty
const generateDemoStats = (timeRange: string) => {
    const baseStats = {
        totalRevenue: 21384,
        revenueChange: 3.1,
        totalProperties: 5,
        propertiesChange: 3.2,
        totalReviews: 27,
        reviewsChange: 0.0,
        averageRating: 4.3,
        ratingChange: 0.0,
        occupancyRate: 90.8,
        occupancyChange: 7.2,
        responseRate: 96,
        responseChange: 4.2,
        pendingReviews: 0,
        approvedReviews: 22,
        rejectedReviews: 1,
        totalReviewsAllTime: 27,
    };

    // Adjust based on time range
    switch (timeRange) {
        case "7d":
            return {
                ...baseStats,
                totalReviews: 3,
                reviewsChange: 15.2,
                averageRating: 8.7,
                ratingChange: 0.5,
            };
        case "90d":
            return {
                ...baseStats,
                totalReviews: 28,
                reviewsChange: 12.1,
                averageRating: 8.1,
                ratingChange: -0.2,
            };
        case "1y":
            return {
                ...baseStats,
                totalReviews: 85,
                reviewsChange: 25.4,
                averageRating: 8.2,
                ratingChange: 0.8,
                totalRevenue: 125840,
                revenueChange: 18.7,
            };
        default:
            return baseStats;
    }
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get("timeRange") || "30d";

        // Calculate date range
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
            case "7d":
                startDate.setDate(now.getDate() - 7);
                break;
            case "30d":
                startDate.setDate(now.getDate() - 30);
                break;
            case "90d":
                startDate.setDate(now.getDate() - 90);
                break;
            case "1y":
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }

        try {
            // Get basic counts
            const [
                totalProperties,
                totalReviews,
                approvedReviews,
                pendingReviews,
                rejectedReviews,
                recentReviews,
            ] = await Promise.all([
                prisma.property.count({
                    where: { status: "ACTIVE" },
                }),
                prisma.review.count(),
                prisma.review.count({
                    where: { isApproved: true },
                }),
                prisma.review.count({
                    where: {
                        isApproved: false,
                        status: "PENDING",
                    },
                }),
                prisma.review.count({
                    where: { status: "REJECTED" },
                }),
                prisma.review.count({
                    where: {
                        submittedAt: { gte: startDate },
                    },
                }),
            ]);

            // Calculate average rating for approved reviews in the time range
            const avgRatingResult = await prisma.review.aggregate({
                _avg: {
                    overallRating: true,
                },
                where: {
                    isApproved: true,
                    submittedAt: { gte: startDate },
                },
            });

            // Get current and previous month stats for comparison
            const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM format
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
                .toISOString()
                .slice(0, 7);

            const [currentMonthStats, lastMonthStats] = await Promise.all([
                prisma.propertyStats.aggregate({
                    _sum: { revenue: true },
                    _avg: { occupancy: true },
                    where: { month: currentMonth },
                }),
                prisma.propertyStats.aggregate({
                    _sum: { revenue: true },
                    _avg: { occupancy: true },
                    where: { month: lastMonth },
                }),
            ]);

            // Calculate revenue metrics
            const currentRevenue = currentMonthStats._sum.revenue || 0;
            const lastRevenue = lastMonthStats._sum.revenue || 0;
            const revenueChange =
                lastRevenue > 0
                    ? ((currentRevenue - lastRevenue) / lastRevenue) * 100
                    : 0;

            // Calculate occupancy metrics
            const currentOccupancy = currentMonthStats._avg.occupancy || 0;
            const lastOccupancy = lastMonthStats._avg.occupancy || 0;
            const occupancyChange = currentOccupancy - lastOccupancy;

            // Calculate previous period reviews for comparison
            const previousPeriodStart = new Date(startDate);
            const periodDiff = now.getTime() - startDate.getTime();
            previousPeriodStart.setTime(startDate.getTime() - periodDiff);

            const previousPeriodReviews = await prisma.review.count({
                where: {
                    submittedAt: {
                        gte: previousPeriodStart,
                        lt: startDate,
                    },
                },
            });

            const reviewsChange =
                previousPeriodReviews > 0
                    ? ((recentReviews - previousPeriodReviews) /
                          previousPeriodReviews) *
                      100
                    : recentReviews > 0
                    ? 100
                    : 0;

            // Calculate previous period rating for comparison
            const prevAvgRatingResult = await prisma.review.aggregate({
                _avg: {
                    overallRating: true,
                },
                where: {
                    isApproved: true,
                    submittedAt: {
                        gte: previousPeriodStart,
                        lt: startDate,
                    },
                },
            });

            const currentAvgRating = avgRatingResult._avg.overallRating || 0;
            const previousAvgRating =
                prevAvgRatingResult._avg.overallRating || 0;
            const ratingChange =
                previousAvgRating > 0
                    ? currentAvgRating - previousAvgRating
                    : 0;

            // Mock response rate (would come from communication system)
            const responseRate = 96;
            const responseChange = 4.2;

            // Calculate overall average rating for all approved reviews (not time-limited)
            const overallAvgRatingResult = await prisma.review.aggregate({
                _avg: {
                    overallRating: true,
                },
                where: {
                    isApproved: true,
                },
            });

            const overallAvgRating =
                overallAvgRatingResult._avg.overallRating || 0;

            const stats = {
                totalRevenue: Math.floor(currentRevenue / 100), // Convert from pence to pounds
                revenueChange: Number(revenueChange.toFixed(1)),
                totalProperties,
                propertiesChange: 3.2, // Mock - would calculate from property creation dates
                totalReviews: totalReviews, // Show total reviews, not time-filtered
                reviewsChange: Number(reviewsChange.toFixed(1)),
                averageRating: Number(overallAvgRating.toFixed(1)), // Overall average rating
                ratingChange: Number(ratingChange.toFixed(1)),
                occupancyRate: Number(currentOccupancy.toFixed(1)),
                occupancyChange: Number(occupancyChange.toFixed(1)),
                responseRate,
                responseChange,
                pendingReviews,
                approvedReviews,
                rejectedReviews,
                totalReviewsAllTime: totalReviews,
                recentReviews: recentReviews, // Add time-filtered reviews as separate field
            };

            console.log("Real database stats calculated:", stats);

            return NextResponse.json({
                success: true,
                data: stats,
                timeRange,
                dataSource: "database",
            });
        } catch (dbError) {
            console.warn("Database query failed, using demo data:", dbError);

            // Fallback to demo data
            const demoStats = generateDemoStats(timeRange);
            return NextResponse.json({
                success: true,
                data: demoStats,
                timeRange,
                dataSource: "demo",
                warning: "Database query failed, using demo data",
            });
        }
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);

        // Final fallback to demo data
        const demoStats = generateDemoStats("30d");
        return NextResponse.json({
            success: true,
            data: demoStats,
            timeRange: "30d",
            dataSource: "demo",
            warning: "Using fallback demo data due to error",
        });
    }
}
