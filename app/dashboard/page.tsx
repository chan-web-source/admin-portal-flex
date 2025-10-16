"use client";

import { useState } from "react";
import { FlexHeader } from "@/components/flex-header";
import { FlexPanel } from "@/components/flex-panel";
import { FlexFooter } from "@/components/flex-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Checkbox,
} from "@/components/ui/checkbox";
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
    Search,
    Filter,
    MapPin,
    Calendar,
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    Building,
    Globe,
    ChevronDown,
    SortAsc,
    SortDesc,
    BookOpen,
    X,
    TrendingUp as TrendingUpIcon,
    Activity,
    Target,
    Zap,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { mockProperties, mockReviews, mockDashboardStats, type PropertyData, type ReviewData, type DashboardStats } from "../lib/mock-dashboard-data";

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
    const [showOnlyPublic, setShowOnlyPublic] = useState(false);

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

    // Filter reviews
    const filteredReviews = reviews.filter((review) => {
        if (showOnlyPublic && !review.isPublic) return false;
        return true;
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
        <div className="min-h-screen bg-[#FFFDF6]" >
            <FlexHeader onMenuToggle={toggleSidebar} />

            <div className="flex">
                {/* Sidebar */}
                <FlexPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />

                {/* Main Content */}
                <div className="flex-1 lg:ml-64 ">

                    {/* Dashboard Header */}
                    <div className="bg-[#fffdf6] shadow-lg border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
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
                    <div className="bg-[#fffdf6] shadow-lg border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="shadow-md hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <DollarSign className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                                <p className="text-2xl font-bold text-gray-900">£{dashboardStats.totalRevenue.toLocaleString()}</p>
                                                <p className="text-sm text-green-600 flex items-center">
                                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                                    +{dashboardStats.revenueChange}%
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Home className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Properties</p>
                                                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProperties}</p>
                                                <p className="text-sm text-gray-500">Active listings</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-yellow-100 rounded-lg">
                                                <Star className="h-6 w-6 text-yellow-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                                                <p className="text-2xl font-bold text-gray-900">{dashboardStats.averageRating.toFixed(1)}</p>
                                                <p className="text-sm text-green-600 flex items-center">
                                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                                    +{dashboardStats.ratingChange}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <MessageSquare className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Reviews</p>
                                                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalReviews}</p>
                                                <p className="text-sm text-amber-600">{dashboardStats.pendingReviews} pending</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Trends & Insights Section */}
                    <div className="bg-[#fffdf6] shadow-lg border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Booking Trends */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUpIcon className="h-5 w-5 text-blue-600" />
                                            Booking Trends
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">Most popular booking patterns and channels</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <BookOpen className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Airbnb Dominance</p>
                                                        <p className="text-sm text-gray-600">Highest booking channel</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-blue-600">68%</p>
                                                    <p className="text-xs text-gray-500">of bookings</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <Calendar className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Weekend Bookings</p>
                                                        <p className="text-sm text-gray-600">Peak booking days</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-green-600">Fri-Sun</p>
                                                    <p className="text-xs text-gray-500">peak days</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-purple-100 rounded-lg">
                                                        <Clock className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Short Stays</p>
                                                        <p className="text-sm text-gray-600">Average booking length</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-purple-600">3.2 days</p>
                                                    <p className="text-xs text-gray-500">average</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Recurring Issues */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5 text-amber-600" />
                                            Recurring Issues
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">Common problems and maintenance needs</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-amber-100 rounded-lg">
                                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Wi-Fi Issues</p>
                                                        <p className="text-sm text-gray-600">Most reported problem</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-amber-600">12</p>
                                                    <p className="text-xs text-gray-500">reports</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-red-100 rounded-lg">
                                                        <X className="h-4 w-4 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Cleaning Delays</p>
                                                        <p className="text-sm text-gray-600">Turnover issues</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-red-600">8</p>
                                                    <p className="text-xs text-gray-500">incidents</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-orange-100 rounded-lg">
                                                        <Zap className="h-4 w-4 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Power Outages</p>
                                                        <p className="text-sm text-gray-600">Infrastructure issues</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-orange-600">5</p>
                                                    <p className="text-xs text-gray-500">outages</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <Activity className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Maintenance Requests</p>
                                                        <p className="text-sm text-gray-600">Regular upkeep needed</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-blue-600">23</p>
                                                    <p className="text-xs text-gray-500">pending</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Performance Insights */}
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-green-600" />
                                        Performance Insights
                                    </CardTitle>
                                    <p className="text-sm text-gray-600">Key metrics and recommendations for optimization</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                                                <TrendingUp className="h-6 w-6 text-green-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Top Performer</h3>
                                            <p className="text-sm text-gray-600 mb-2">Canary Wharf Tower</p>
                                            <p className="text-xs text-green-600">92% occupancy rate</p>
                                        </div>

                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                                                <DollarSign className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Revenue Leader</h3>
                                            <p className="text-sm text-gray-600 mb-2">Champs-Élysées Flat</p>
                                            <p className="text-xs text-blue-600">£18,750 monthly revenue</p>
                                        </div>

                                        <div className="text-center p-4 bg-amber-50 rounded-lg">
                                            <div className="p-3 bg-amber-100 rounded-full w-fit mx-auto mb-3">
                                                <AlertTriangle className="h-6 w-6 text-amber-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Needs Attention</h3>
                                            <p className="text-sm text-gray-600 mb-2">Fitzrovia Studio</p>
                                            <p className="text-xs text-amber-600">13.5% cancellation rate</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-[#fffdf6]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            {/* Filters and Search */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search properties..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 w-full sm:w-64"
                                            />
                                        </div>

                                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                                            <SelectTrigger className="w-full sm:w-40">
                                                <SelectValue placeholder="City" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Cities</SelectItem>
                                                <SelectItem value="London">London</SelectItem>
                                                <SelectItem value="Paris">Paris</SelectItem>
                                                <SelectItem value="Algiers">Algiers</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
                                            <SelectTrigger className="w-full sm:w-40">
                                                <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="Apartment">Apartment</SelectItem>
                                                <SelectItem value="Studio">Studio</SelectItem>
                                                <SelectItem value="House">House</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Sort by:</span>
                                            <Select value={sortBy} onValueChange={setSortBy}>
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="rating">Rating</SelectItem>
                                                    <SelectItem value="revenue">Revenue</SelectItem>
                                                    <SelectItem value="occupancy">Occupancy</SelectItem>
                                                    <SelectItem value="reviews">Reviews</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                        >
                                            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Properties Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                                {filteredProperties.map((property) => (
                                    <Card key={property.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                                                        {property.name}
                                                    </CardTitle>
                                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {property.location}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {property.city}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            {property.type}
                                                        </Badge>
                                                        <Badge
                                                            variant={property.status === 'Active' ? 'default' : 'secondary'}
                                                            className="text-xs"
                                                        >
                                                            {property.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center text-yellow-600">
                                                        <Star className="h-4 w-4 fill-current mr-1" />
                                                        <span className="font-semibold">{property.rating}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{property.totalReviews} reviews</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Performance Metrics */}
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Total Bookings</p>
                                                    <p className="font-semibold text-gray-900">{property.totalBookings}</p>
                                                    <p className={`text-xs flex items-center ${property.bookingsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {property.bookingsChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                                        {Math.abs(property.bookingsChange)}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Cancellations</p>
                                                    <p className="font-semibold text-gray-900">{property.cancellations}</p>
                                                    <p className="text-xs text-gray-500">{property.cancellationRate}% rate</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Net Profit</p>
                                                    <p className="font-semibold text-gray-900">£{property.netProfit.toLocaleString()}</p>
                                                    <p className="text-xs text-green-600">{property.profitMargin}% margin</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Avg Stay</p>
                                                    <p className="font-semibold text-gray-900">{property.averageStayLength} days</p>
                                                    <p className="text-xs text-gray-500">per booking</p>
                                                </div>
                                            </div>

                                            {/* Category Ratings */}
                                            <div className="mb-4">
                                                <p className="text-xs text-gray-500 mb-2">Category Ratings</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-600">Cleanliness</span>
                                                        <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.cleanliness}/10</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-600">Communication</span>
                                                        <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.communication}/10</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-600">Location</span>
                                                        <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.location}/10</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-600">Check-in</span>
                                                        <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.checkin}/10</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-600">Accuracy</span>
                                                        <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.accuracy}/10</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-600">Value</span>
                                                        <span className="text-xs font-semibold text-gray-900">{property.categoryRatings.value}/10</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-600">
                                                    Next: {new Date(property.nextBooking).toLocaleDateString()}
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>


                            {/* Reviews Management */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Review Management</CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">Manage which reviews are displayed publicly</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="show-only-public"
                                                checked={showOnlyPublic}
                                                onCheckedChange={(checked) => setShowOnlyPublic(checked === true)}
                                            />
                                            <label htmlFor="show-only-public" className="text-sm text-gray-600">
                                                Show only public reviews
                                            </label>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {filteredReviews.map((review) => (
                                            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-medium text-gray-900">{review.propertyName}</h4>
                                                            <Badge variant="outline" className="text-xs">
                                                                {review.channel}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                {review.category}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="flex items-center text-yellow-600">
                                                                <Star className="h-4 w-4 fill-current mr-1" />
                                                                <span className="font-medium">{review.rating}</span>
                                                            </div>
                                                            <span className="text-sm text-gray-600">by {review.guestName}</span>
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(review.submittedAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleReviewToggle(review.id, !review.isPublic)}
                                                        >
                                                            {review.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                            {review.isPublic ? 'Public' : 'Private'}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleReviewApprove(review.id, !review.isApproved)}
                                                        >
                                                            {review.isApproved ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                                            {review.isApproved ? 'Approved' : 'Pending'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <FlexFooter />
                </div>
            </div>
        </div>
    );
}