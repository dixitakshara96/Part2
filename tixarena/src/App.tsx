import React from "react";
import { AppProvider, useApp } from "./Context/AppContex";

// Pages
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import EventDetailPage from "./pages/EventDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import { BookingConfirmPage, MyTicketsPage } from "./pages/TicketsPage";
import { SearchPage, NotificationsPage, ProfilePage } from "./pages/OtherPages";
import CreateEventPage from "./pages/CreateEventPage";

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