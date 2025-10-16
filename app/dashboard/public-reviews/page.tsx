"use client";

import { FlexHeader } from "@/components/flex-header";
import { FlexFooter } from "@/components/flex-footer";
import { PublicReviewManager } from "@/components/public-review-manager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PublicReviewsPage() {
    const searchParams = useSearchParams();
    const propertyFilter = searchParams.get("property");

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
                                Public Review Manager
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-200 max-w-3xl">
                                Control which reviews are displayed on your
                                public property pages. Curate the best reviews
                                to showcase your properties and build trust with
                                potential guests.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <PublicReviewManager
                    propertyFilter={propertyFilter || undefined}
                    initialFilters={{
                        property: propertyFilter || undefined,
                    }}
                />
            </div>

            <FlexFooter />
        </div>
    );
}
