"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FlexHeaderProps {
    onMenuToggle: () => void;
}

export function FlexHeader({ onMenuToggle }: FlexHeaderProps) {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    return (
        <header className="bg-[#1A4D4D] sticky top-0 z-50">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Menu Button and Logo */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onMenuToggle}
                            className="text-white hover:text-gray-200 hover:bg-[#1e3a38] lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src="https://theflex.global/_next/image?url=https%3A%2F%2Flsmvmmgkpbyqhthzdexc.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fwebsite%2FUploads%2FWhite_V3%2520Symbol%2520%26%2520Wordmark.png&w=256&q=75"
                                alt="Flex Living"
                                width={120}
                                height={48}
                                className="h-8 w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right side - User Profile and Language */}
                    <div className="flex items-center space-x-4">
                        {/* Language Selection */}
                        <div className="flex items-center space-x-4 text-white">
                            <span className="text-sm flex items-center space-x-1">
                                <span className="font-semibold">GB</span>
                                <span>English</span>
                            </span>
                            <span className="text-sm flex items-center space-x-1">
                                <span>£</span>
                                <span>GBP</span>
                            </span>
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                className="text-white hover:text-gray-200 hover:bg-[#1e3a38] flex items-center space-x-2"
                            >
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="hidden sm:block">Admin</span>
                                <ChevronDown className="w-4 h-4" />
                            </Button>

                            {/* Dropdown Menu */}
                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900">Admin</p>
                                        <p className="text-sm text-gray-500">admin@theflex.global</p>
                                    </div>
                                    <Link
                                        href="/"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile Settings
                                    </Link>
                                    <Link
                                        href="/"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Account Settings
                                    </Link>
                                    <div className="border-t border-gray-200">
                                        <Link
                                            href="/"
                                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Sign Out
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
