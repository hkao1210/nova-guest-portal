"use client";
import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "~/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "~/components/ui/carousel";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { MapPin, Wifi, Key, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useReservation } from "~/hooks/useReservation";

interface LandingPageProps {
    reservationId?: string;
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
};

const LandingPage = ({ reservationId }: LandingPageProps) => {
    const [parent] = useAutoAnimate();
    const router = useRouter();
    
    const {
        reservation,
        isLoading,
        error,
        infoBlocks,
        isAfterCheckOut,
        doorCodeMessage,
        registrationButtonText,
    } = useReservation(reservationId);

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-md mx-auto p-4 h-screen flex flex-col justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="mt-4 text-gray-600">Loading your reservation...</p>
            </div>
        );
    }

    // Error state
    if (error || !reservation) {
        return (
            <div className="max-w-md mx-auto p-4 h-screen flex flex-col justify-center items-center">
                <Card className="w-full">
                    <CardHeader className="text-center bg-red-50 rounded-t-lg">
                        <CardTitle className="text-xl">Error Loading Reservation</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="text-center text-red-500 mb-6">
                            {error || "Could not find your reservation. Please check the link or contact support."}
                        </p>
                        <Button 
                            className="w-full" 
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // If after checkout, show thank you page
    if (isAfterCheckOut) {
        return (
            <div className="max-w-md mx-auto p-4 h-screen flex flex-col justify-center items-center">
                <Card className="w-full">
                    <CardHeader className="text-center bg-green-50 rounded-t-lg">
                        <CardTitle className="text-2xl">Thank You for Staying!</CardTitle>
                        <CardDescription>We hope you enjoyed your visit</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 flex flex-col items-center">
                        <div className="text-9xl mb-4">⭐</div>
                        <p className="text-center mb-6">
                            We'd love to hear about your experience at our property.
                        </p>
                        <Button className="w-full mb-2">Rate Your Stay</Button>
                        <Button variant="outline" className="w-full">Leave Feedback</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-4 pb-16" ref={parent}>
            <Card className="mb-4">
                <CardHeader className="text-center bg-blue-50 rounded-t-lg">
                    <CardTitle>Your Upcoming Stay</CardTitle>
                    <CardDescription>{reservation.guestName}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                    {/* Check-in/out Details */}
                    <div className="bg-blue-100 p-4 rounded-lg mb-4">
                        <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 mr-2 text-blue-700" />
                            <span className="font-semibold text-blue-700">Check-in:</span>
                            <span className="ml-2">
                                {formatDate(reservation.checkIn)} ~ {formatTime(reservation.checkIn)}
                            </span>
                        </div>
                        <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 mr-2 text-blue-700" />
                            <span className="font-semibold text-blue-700">Check-out:</span>
                            <span className="ml-2">
                                {formatDate(reservation.checkOut)} ~ {formatTime(reservation.checkOut)}
                            </span>
                        </div>
                        <div className="flex items-start mb-1">
                            <MapPin className="h-5 w-5 mr-2 text-blue-700 mt-0.5" />
                            <div>
                                <span className="font-semibold text-blue-700">Address:</span>
                                <div className="ml-2">{reservation.address}</div>
                                <Button 
                                    variant="link" 
                                    className="text-blue-600 p-0 h-auto ml-2 flex items-center"
                                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(reservation.address)}`, '_blank')}
                                >
                                    Open in Maps
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Details */}
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <span className="font-semibold w-40">Confirmation Code:</span>
                            <span>{reservation.confirmationCode}</span>
                        </div>
                        <div className="flex items-center mb-2">
                            <Wifi className="h-5 w-5 mr-2" />
                            <span className="font-semibold w-36">Wi-Fi:</span>
                            <span>{reservation.wifiName} / PW: {reservation.wifiPassword}</span>
                        </div>
                        <div className="flex items-center">
                            <Key className="h-5 w-5 mr-2" />
                            <span className="font-semibold w-36">Door Code:</span>
                            <span>{doorCodeMessage}</span>
                        </div>
                    </div>
                </CardContent>
                
                <CardFooter>
                    <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => router.push(`/registration?reservationId=${reservation.id}`)}
                    >
                        {registrationButtonText}
                    </Button>
                </CardFooter>
            </Card>

            {/* Information Blocks Carousel */}
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-3 px-1">Information For You</h2>
                <Carousel className="w-full">
                    <CarouselContent>
                        {infoBlocks.map((block) => (
                            <CarouselItem key={block.id}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <Card 
                                        className="cursor-pointer h-40"
                                        onClick={() => block.detailUrl && router.push(`${block.detailUrl}?reservationId=${reservation.id}`)}
                                    >
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg flex items-center">
                                                    <span className="mr-2 text-2xl">{block.icon}</span>
                                                    {block.title}
                                                </CardTitle>
                                                <Badge variant="outline">Info</Badge>
                                            </div>
                                            <CardDescription>{block.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="line-clamp-2">{block.content}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0" />
                    <CarouselNext className="right-0" />
                </Carousel>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around">
                <Button variant="ghost" className="flex flex-col items-center text-blue-600">
                    <span className="text-xs font-medium">Home</span>
                </Button>
                <Button 
                    variant="ghost" 
                    className="flex flex-col items-center"
                    onClick={() => router.push(`/add-on?reservationId=${reservation.id}`)}
                >
                    <span className="text-xs font-medium">Add-on</span>
                </Button>
                <Button 
                    variant="ghost" 
                    className="flex flex-col items-center"
                    onClick={() => router.push(`/guidebook?reservationId=${reservation.id}`)}
                >
                    <span className="text-xs font-medium">Guidebook</span>
                </Button>
            </div>
        </div>
    );
};

export default LandingPage;