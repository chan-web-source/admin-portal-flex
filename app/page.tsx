"use client";

import { useState } from "react";
import { FlexHeader } from "@/components/flex-header";
import { FlexPanel } from "@/components/flex-panel";
import { PublicReviewsSection } from "@/components/public-reviews-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Users, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TestimonialSection } from "@/components/testimonial-section";
import { FlexFooter } from "@/components/flex-footer";

export default function HomePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <FlexHeader onMenuToggle={toggleSidebar} />

            {/* Sidebar */}
            <FlexPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content */}
            <div className="lg:ml-64">
                <main>
                    {/* Hero Section */}
                    <section className="relative h-screen flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage:
                                    "url('/modern-apartment-bedroom-with-natural-light.jpg')",
                            }}
                        >
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 flex-text-balance">
                                Book
                                <br />
                                Now
                            </h1>

                            {/* Search Form */}
                            <Card className="max-w-4xl mx-auto shadow-2xl bg-white/95 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                placeholder="City"
                                                className="pl-10 h-12 border-gray-200 bg-white"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                placeholder="Dates"
                                                className="pl-10 h-12 border-gray-200 bg-white"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                placeholder="1 Guest"
                                                className="pl-10 h-12 border-gray-200 bg-white"
                                            />
                                        </div>
                                        <Button className="h-12 bg-[#284E4C] hover:bg-[#1e3a38] text-white font-semibold">
                                            Search
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Featured Properties */}
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Featured Properties
                                </h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Handpicked apartments in the world's most
                                    desirable locations
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    {
                                        name: "2B N1 A - 29 Shoreditch Heights",
                                        location: "Shoreditch, London",
                                        price: "£120",
                                        rating: 4.8,
                                        image: "/modern-london-apartment-exterior.jpg",
                                        slug: "shoreditch-heights",
                                    },
                                    {
                                        name: "1B E1 B - 15 Canary Wharf Tower",
                                        location: "Canary Wharf, London",
                                        price: "£150",
                                        rating: 4.9,
                                        image: "/luxury-canary-wharf-apartment.jpg",
                                        slug: "canary-wharf-tower",
                                    },
                                    {
                                        name: "Studio W1 C - 42 Fitzrovia Square",
                                        location: "Fitzrovia, London",
                                        price: "£95",
                                        rating: 4.7,
                                        image: "/stylish-fitzrovia-studio-apartment.jpg",
                                        slug: "fitzrovia-square",
                                    },
                                ].map((property, index) => (
                                    <Link
                                        key={index}
                                        href={`/property/${property.slug}`}
                                    >
                                        <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                                            <div className="relative overflow-hidden rounded-t-lg">
                                                <img
                                                    src={
                                                        property.image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={property.name}
                                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 right-4">
                                                    <div className="bg-white rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {property.rating}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <CardContent className="p-6">
                                                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                                                    {property.name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-gray-600 mb-3">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="text-sm">
                                                        {property.location}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xl font-bold text-gray-900">
                                                            {property.price}
                                                        </span>
                                                        <span className="text-gray-600 text-sm">
                                                            per night
                                                        </span>
                                                    </div>
                                                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Flexibility Section */}
                    <section className="py-20 bg-[#FFF9E9]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl lg:text-5xl font-bold text-[#020817] mb-8 text-balance">
                                    Flexibility for tenants, landlords & businesses
                                </h2>
                                <p className="text-lg text-gray-700 max-w-5xl mx-auto leading-relaxed">
                                    The Flex is the future of flexible
                                    accommodation, powered by seasoned
                                    property-management experts. Guests tap into
                                    fully furnished, hotel-grade homes on leases
                                    that bend with their plans, while landlords
                                    enjoy guaranteed rent and zero voids as we
                                    enhance, market, service and maintain every
                                    unit. A single master agreement gives businesses
                                    scalable, ready-to-live housing for roaming
                                    teams. With new properties every week and new
                                    cities on the horizon, true flexibility in
                                    property rentals has finally arrived.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Tenants Card */}
                                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-bold text-[#020817] mb-6 text-center">
                                            Tenants
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed text-center">
                                            Book a fully furnished, design-forward
                                            home in minutes and stay for a week, a
                                            season, or as long as your plans demand
                                            — fully furnished with utilities, Wi-Fi,
                                            and hotel-grade linens already in place.
                                            Digital key access, optional
                                            housekeeping, and 24/7 live support give
                                            you the comfort of a boutique hotel with
                                            the freedom of an apartment. Wherever
                                            work or wanderlust takes you next, The
                                            Flex travels with you.
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Landlords Card */}
                                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-bold text-[#020817] mb-6 text-center">
                                            Landlords
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed text-center">
                                            Lock in guaranteed rent with zero voids
                                            from day one. Our team handles upgrades
                                            and improvements, dynamic pricing,
                                            resident vetting, regular cleaning,
                                            round- the-clock maintenance and
                                            everything in between whilst you sit
                                            back, relax and receive fixed monthly
                                            payments. The result: premium occupancy
                                            and higher yields with none of the
                                            headaches that usually come with being a
                                            landlord.
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Businesses Card */}
                                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-bold text-[#020817] mb-6 text-center">
                                            Businesses
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed text-center">
                                            One master lease unlocks an entire
                                            portfolio of ready-to-live Flex homes
                                            across our rapidly expanding network—
                                            new properties added every week and new
                                            cities launching soon. Relocate
                                            employees in hours, spin up project
                                            teams on-site for a month, or house
                                            insurance policyholders instantly after
                                            a claim. Flexible, scalable and globe
                                            spanning accommodation is now as agile
                                            as your business.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* Redefining Home Section */}
                    <section className="py-20 bg-[#FFF9E9]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                {/* Content Card */}
                                <div className="order-2 lg:order-1">
                                    <Card className="bg-white shadow-lg rounded-3xl max-w-lg">
                                        <CardContent className="p-10">
                                            <h2 className="text-3xl font-bold text-[#020817] mb-6">
                                                Redefining 'Home'
                                            </h2>
                                            <p className="text-gray-700 leading-relaxed">
                                                At The Flex, we believe 'home'
                                                should never limit your
                                                possibilities. We exist to redefine
                                                how people travel, live and work
                                                with solutions that prioritise
                                                freedom, adaptability, and
                                                flexibility. Driven by genuine care
                                                and innovative thinking, we provide
                                                flexible accommodations that empower
                                                you to embrace life's changes -
                                                making sure you always feel
                                                grounded, wherever life takes you.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Bedroom Image */}
                                <div className="order-1 lg:order-2">
                                    <div className="relative">
                                        <img
                                            src="/stylish-bedroom-with-yellow-accents-and-artwork.jpg"
                                            alt="Stylish bedroom with warm wood furniture and yellow accents"
                                            className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Testimonial Section */}
                    <TestimonialSection />

                    {/* Public Reviews Section */}
                    <PublicReviewsSection maxReviews={12} />

                    {/* About Section */}
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                        Furnished apartments in top locations
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        The Flex apartments are designed with you in
                                        mind – all have to do is unpack, relax and
                                        start living. With flexible booking options
                                        across top cities around the globe, Stay
                                        with us for a few days, a few weeks, or a
                                        few months.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                            <span className="text-gray-700">
                                                Fully furnished and equipped
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                            <span className="text-gray-700">
                                                Flexible booking options
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                            <span className="text-gray-700">
                                                24/7 guest support
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                            <span className="text-gray-700">
                                                Prime city locations
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <img
                                        src="/modern-furnished-apartment-living-room.jpg"
                                        alt="Furnished apartment"
                                        className="w-full h-96 object-cover rounded-xl shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Flex Footer */}
                <FlexFooter />
            </div>
        </div>
    );
}
