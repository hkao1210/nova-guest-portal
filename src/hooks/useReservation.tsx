import { useState, useEffect } from "react";

// Type definitions for our reservation data
export interface Reservation {
  id: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  address: string;
  confirmationCode: string;
  wifiName: string;
  wifiPassword: string;
  doorCode: string;
  isRegistered: boolean;
  resortName?: string;
}

// Info block type definition
export interface InfoBlock {
  id: number;
  title: string;
  description: string;
  icon: string;
  content: string;
  detailUrl?: string;
}

interface UseReservationReturn {
  reservation: Reservation | null;
  isLoading: boolean;
  error: string | null;
  infoBlocks: InfoBlock[];
  isDuringSay: boolean;
  isBeforeCheckIn: boolean;
  isAfterCheckOut: boolean;
  doorCodeMessage: string;
  registrationButtonText: string;
  updateRegistrationStatus: (status: boolean) => void;
}

export function useReservation(reservationId?: string): UseReservationReturn {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [doorCodeMessage, setDoorCodeMessage] = useState<string>("");
  const [registrationButtonText, setRegistrationButtonText] = useState<string>("Guest Registration");
  const [currentDate] = useState<Date>(new Date());

  // Mock info blocks
  const [infoBlocks] = useState<InfoBlock[]>([
    {
      id: 1,
      title: "Parking Policy",
      description: "Learn where to park your car during your stay",
      icon: "🚗",
      content: "Park only in designated spots. Resort parking is available for up to 3 vehicles.",
      detailUrl: "/info/parking",
    },
    {
      id: 2,
      title: "Check-in Tips",
      description: "Steps for a quick and smooth check-in experience",
      icon: "🔑",
      content: "Use the door code provided 3 days before check-in. No need to visit a front desk.",
      detailUrl: "/info/checkin",
    },
    {
      id: 3,
      title: "Nearby Activities",
      description: "Fun things to do around the area",
      icon: "🎡",
      content: "Theme parks, shopping centers, and restaurants all within 15 minutes.",
      detailUrl: "/info/activities",
    },
    {
      id: 4,
      title: "House Rules",
      description: "Important policies to know before your stay",
      icon: "📜",
      content: "No smoking, no parties, quiet hours from 10PM to 8AM.",
      detailUrl: "/info/rules",
    },
    {
      id: 5,
      title: "Pool Instructions",
      description: "How to use the pool and hot tub safely",
      icon: "🏊",
      content: "Pool hours: 8AM-10PM. No glass containers in pool area. Supervise children at all times.",
      detailUrl: "/info/pool",
    },
  ]);

  // Mock API call to fetch reservation data
  useEffect(() => {
    const fetchReservation = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate a network request with a timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock response data
        const mockData: Reservation = {
          id: reservationId || "ABC1234",
          guestName: "Steven Canaj",
          checkIn: new Date("2025-03-09T16:00:00"),
          checkOut: new Date("2025-03-13T10:00:00"),
          address: "123 Example St., Kissimmee, FL",
          confirmationCode: "ABC1234",
          wifiName: "MyVacationHome",
          wifiPassword: "12345",
          doorCode: "",
          isRegistered: false,
          resortName: "Paradise Palms",
        };
        
        setReservation(mockData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching reservation:", err);
        setError("Failed to load reservation data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  // Calculate stay status
  const isBeforeCheckIn = reservation ? currentDate < reservation.checkIn : false;
  const isAfterCheckOut = reservation ? currentDate > reservation.checkOut : false;
  const isDuringSay = reservation ? (!isBeforeCheckIn && !isAfterCheckOut) : false;

  // Update door code message and registration button text
  useEffect(() => {
    if (reservation) {
      // Determine door code message
      if (reservation.isRegistered) {
        const threeDaysBeforeCheckIn = new Date(reservation.checkIn);
        threeDaysBeforeCheckIn.setDate(threeDaysBeforeCheckIn.getDate() - 3);
        
        if (currentDate >= threeDaysBeforeCheckIn) {
          setDoorCodeMessage("543210"); // Mock door code
        } else {
          setDoorCodeMessage("Code will be generated 3 days before check-in");
        }
      } else {
        setDoorCodeMessage("Please register to receive door code");
      }

      // Set registration button text
      setRegistrationButtonText(reservation.isRegistered ? "Update Registration" : "Guest Registration");
    }
  }, [reservation, currentDate]);

  // Function to update registration status
  const updateRegistrationStatus = (status: boolean) => {
    if (reservation) {
      setReservation({
        ...reservation,
        isRegistered: status
      });
    }
  };

  return {
    reservation,
    isLoading,
    error,
    infoBlocks,
    isDuringSay,
    isBeforeCheckIn,
    isAfterCheckOut,
    doorCodeMessage,
    registrationButtonText,
    updateRegistrationStatus,
  };
}