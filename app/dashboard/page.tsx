"use client";

import { useState } from "react";
import { FlexHeader } from "@/components/flex-header";
import { FlexPanel } from "@/components/flex-panel";
import { FlexFooter } from "@/components/flex-footer";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Download } from "lucide-react";
import StatsPage from "./stats/page";
import InsightsPage from "./insights/page";
import PropertiesPage from "./properties/page";
import ReviewsPage from "./reviews/page";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { mockProperties, mockReviews, mockDashboardStats } from "../../lib/mock-dashboard-data";
import type { PropertyData, ReviewData, DashboardStats } from "../../types/dashboard";
import { mockAnalyticsData } from "../../lib/mock-analytics-data";

export default function ManagerDashboard() {
    const [timeRange, setTimeRange] = useState("all");
    const [activeTab, setActiveTab] = useState("properties");
    const [properties, setProperties] = useState<PropertyData[]>(mockProperties);
    const [reviews, setReviews] = useState<ReviewData[]>(mockReviews);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats>(mockDashboardStats);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState<string>("all");
    const [selectedPropertyType, setSelectedPropertyType] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("rating");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Filter and sort properties
    const filteredProperties = properties
        .filter((property) => {
            const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = selectedCity === "all" || property.city === selectedCity;
            const matchesType = selectedPropertyType === "all" || property.type === selectedPropertyType;
            return matchesSearch && matchesCity && matchesType;
        })
        .sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case "rating":
                    aValue = a.rating;
                    bValue = b.rating;
                    break;
                case "revenue":
                    aValue = a.revenue;
                    bValue = b.revenue;
                    break;
                case "occupancy":
                    aValue = a.occupancyRate;
                    bValue = b.occupancyRate;
                    break;
                case "reviews":
                    aValue = a.totalReviews;
                    bValue = b.totalReviews;
                    break;
                default:
                    aValue = a.rating;
                    bValue = b.rating;
            }

            if (sortOrder === "asc") {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });

    const handleRefresh = () => {
        setRefreshing(true);
        // Simulate API call
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
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
                <div className="flex-1 lg:ml-64">
                    {/* Dashboard Header */}
                    <div className="bg-[#fffdf6] shadow-lg border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Property Management Dashboard</h1>
                                    <p className="text-sm text-gray-600 mt-1">Monitor and manage your property portfolio</p>
                                </div>
                                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                    <Select value={timeRange} onValueChange={setTimeRange}>
                                        <SelectTrigger className="w-40 bg-white border-gray-300">
                                            <SelectValue placeholder="Time range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All time</SelectItem>
                                            <SelectItem value="7d">Last 7 days</SelectItem>
                                            <SelectItem value="30d">Last 30 days</SelectItem>
                                            <SelectItem value="90d">Last 3 months</SelectItem>
                                        </SelectContent>
                                    </Select>
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

                    {/* Stats Overview */}
                    <StatsPage stats={dashboardStats} />

                    {/* Analytics Dashboard */}
                    <div className="bg-[#fffdf6]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <AnalyticsDashboard
                                analytics={mockAnalyticsData}
                                reviews={reviews}
                            />
                        </div>
                    </div>

                    {/* Insights Section */}
                    <InsightsPage />

                    {/* Properties Section */}
                    <PropertiesPage
                        properties={filteredProperties}
                        searchQuery={searchQuery}
                        selectedCity={selectedCity}
                        selectedPropertyType={selectedPropertyType}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSearchChange={setSearchQuery}
                        onCityChange={setSelectedCity}
                        onPropertyTypeChange={setSelectedPropertyType}
                        onSortByChange={setSortBy}
                        onSortOrderChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    />

                    {/* Review Selection */}
                    <ReviewsPage
                        reviews={reviews}
                        onReviewToggle={handleReviewToggle}
                    />

                    <FlexFooter />
                </div>
            </div>
        </div>
    );
}