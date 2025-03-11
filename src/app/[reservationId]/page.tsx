import { Metadata } from "next";
import LandingPage from "../components/LandingPage";
export const metadata: Metadata = {
  title: "Your Upcoming Stay",
  description: "Vacation Rental Reservation Information",
};

export default function ReservationPage({
  params,
}: {
  params: { reservationId: string };
}) {
  // Get the reservationId from searchParams

  
  return (
    <div className="container mx-auto pb-16">
      <LandingPage reservationId={params.reservationId} />
    </div>
  );
}