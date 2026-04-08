import React from "react";
import { AppProvider, useApp } from "./Context/AppContex";

// Pages
import HomePage from "./pages/HomePage";


import { SearchPage, NotificationsPage, ProfilePage } from "./pages/OtherPages";
import CreateEventPage from "./pages/CreateEventPage";
import ExplorePage from "./pages/ExploarPage";
import EventDetailPage from "./pages/Eventdetail";
import CheckoutPage from "./pages/CheckOutPage";
import { BookingConfirmPage, MyTicketsPage } from "./pages/TicketPage";

function Router() {
  const { currentPage } = useApp();

  const pages: Record<string, React.ReactNode> = {
    home: <HomePage />,
    explore: <ExplorePage />,
    "event-detail": <EventDetailPage />,
    checkout: <CheckoutPage />,
    "booking-confirm": <BookingConfirmPage />,
    "my-tickets": <MyTicketsPage />,
    search: <SearchPage />,
    notifications: <NotificationsPage />,
    profile: <ProfilePage />,
    "create-event": <CreateEventPage />,
  };

  return <>{pages[currentPage] ?? <HomePage />}</>;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}