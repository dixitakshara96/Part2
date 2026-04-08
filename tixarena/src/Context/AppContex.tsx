import React, { createContext, useContext, useState, useCallback } from "react";

export type Category = "all" | "college-fest" | "popup" | "community" | "music" | "food" | "tech" | "sports";

export interface Event {
  id: string;
  title: string;
  category: Category;
  date: string;
  time: string;
  venue: string;
  location: string;
  distance: string;
  price: number;
  image: string;
  tags: string[];
  organizer: string;
  attendees: number;
  capacity: number;
  description: string;
  isFeatured?: boolean;
  isSaved?: boolean;
}

export interface Ticket {
  id: string;
  eventId: string;
  event: Event;
  quantity: number;
  totalPrice: number;
  bookingDate: string;
  status: "upcoming" | "attended" | "cancelled";
  qrCode: string;
  ticketNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  interests: Category[];
  college?: string;
}

export type Page =
  | "home"
  | "explore"
  | "event-detail"
  | "checkout"
  | "my-tickets"
  | "profile"
  | "notifications"
  | "search"
  | "create-event"
  | "booking-confirm";

interface AppState {
  currentPage: Page;
  selectedEventId: string | null;
  user: User;
  tickets: Ticket[];
  savedEvents: string[];
  cartEventId: string | null;
  cartQuantity: number;
  searchQuery: string;
  activeCategory: Category;
  notifications: Notification[];
  isLoggedIn: boolean;
}

interface Notification {
  id: string;
  type: "reminder" | "booking" | "promo" | "update";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

interface AppContextType extends AppState {
  navigate: (page: Page, eventId?: string) => void;
  toggleSaveEvent: (eventId: string) => void;
  addToCart: (eventId: string, quantity: number) => void;
  confirmBooking: () => void;
  setSearchQuery: (q: string) => void;
  setActiveCategory: (c: Category) => void;
  markNotificationRead: (id: string) => void;
  cancelTicket: (ticketId: string) => void;
}

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Techfest 2025 — IIT Lucknow",
    category: "college-fest",
    date: "2025-04-15",
    time: "10:00 AM",
    venue: "IIT Lucknow Campus",
    location: "Gomti Nagar, Lucknow",
    distance: "2.3 km",
    price: 299,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    tags: ["Tech", "Robotics", "AI", "Hackathon"],
    organizer: "IIT Lucknow",
    attendees: 1240,
    capacity: 2000,
    description: "Annual technology festival featuring robotics competitions, AI workshops, startup pitches, and keynotes from industry leaders. A 3-day celebration of innovation and technology.",
    isFeatured: true,
  },
  {
    id: "2",
    title: "Sunday Bazaar Pop-Up",
    category: "popup",
    date: "2025-04-13",
    time: "11:00 AM",
    venue: "Hazratganj Central Park",
    location: "Hazratganj, Lucknow",
    distance: "1.1 km",
    price: 50,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80",
    tags: ["Shopping", "Handmade", "Food", "Art"],
    organizer: "LKO Makers Collective",
    attendees: 320,
    capacity: 500,
    description: "A vibrant pop-up market featuring 60+ local artisans, handmade crafts, street food, live music performances, and everything local Lucknow has to offer.",
    isFeatured: true,
  },
  {
    id: "3",
    title: "Indie Nights — Live Music",
    category: "music",
    date: "2025-04-18",
    time: "7:00 PM",
    venue: "Oudh 1590 Rooftop",
    location: "Vipin Khand, Lucknow",
    distance: "3.7 km",
    price: 499,
    image: "https://images.unsplash.com/photo-1501386761578-eaa54b41f1eb?w=800&q=80",
    tags: ["Music", "Indie", "Live", "Rooftop"],
    organizer: "Rhythm House Events",
    attendees: 180,
    capacity: 250,
    description: "An intimate rooftop evening featuring 4 indie artists performing original music. Includes complimentary welcome drink and artisan snacks.",
    isFeatured: false,
  },
  {
    id: "4",
    title: "Flavours of Awadh Food Fest",
    category: "food",
    date: "2025-04-20",
    time: "12:00 PM",
    venue: "Janeshwar Mishra Park",
    location: "Gomti Nagar, Lucknow",
    distance: "4.2 km",
    price: 149,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    tags: ["Food", "Awadhi", "Street Food", "Biryani"],
    organizer: "Lucknow Food Society",
    attendees: 860,
    capacity: 1500,
    description: "A 2-day celebration of Lucknow's legendary Awadhi cuisine. 40+ food stalls, live cooking demos by master chefs, and a grand biryani cook-off.",
    isFeatured: true,
  },
  {
    id: "5",
    title: "Campus Startup Summit",
    category: "tech",
    date: "2025-04-25",
    time: "9:00 AM",
    venue: "BBAU Auditorium",
    location: "Lucknow University Road",
    distance: "5.8 km",
    price: 0,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    tags: ["Startup", "Pitch", "Networking", "Free"],
    organizer: "BBAU E-Cell",
    attendees: 420,
    capacity: 600,
    description: "A free startup summit connecting student entrepreneurs with mentors, VCs, and industry experts. Pitch competitions with prize pool of ₹2 Lakhs.",
    isFeatured: false,
  },
  {
    id: "6",
    title: "Yoga & Wellness Morning",
    category: "community",
    date: "2025-04-14",
    time: "6:00 AM",
    venue: "Ambedkar Park",
    location: "Sector 6, Lucknow",
    distance: "0.8 km",
    price: 100,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    tags: ["Wellness", "Yoga", "Morning", "Health"],
    organizer: "Lucknow Wellness Hub",
    attendees: 95,
    capacity: 150,
    description: "Start your Sunday right with a guided 2-hour yoga and mindfulness session followed by a healthy breakfast social with the local wellness community.",
    isFeatured: false,
  },
  {
    id: "7",
    title: "Inter-College Basketball Slam",
    category: "sports",
    date: "2025-04-22",
    time: "2:00 PM",
    venue: "KD Singh Babu Stadium",
    location: "Lalbagh, Lucknow",
    distance: "2.9 km",
    price: 80,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    tags: ["Basketball", "Sports", "College", "Competition"],
    organizer: "Lucknow Sports Federation",
    attendees: 540,
    capacity: 1200,
    description: "12 college teams compete in the ultimate inter-college basketball tournament. Slam dunks, three-pointers, and championship glory await.",
    isFeatured: false,
  },
  {
    id: "8",
    title: "Photography Walk — Old City",
    category: "community",
    date: "2025-04-19",
    time: "7:00 AM",
    venue: "Rumi Darwaza",
    location: "Chowk, Lucknow",
    distance: "3.4 km",
    price: 199,
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
    tags: ["Photography", "Heritage", "Walk", "Art"],
    organizer: "Lucknow Lens Club",
    attendees: 45,
    capacity: 60,
    description: "A guided 3-hour photography walk through Old Lucknow's heritage lanes, nawabi architecture, and morning chai spots. Suitable for all skill levels.",
    isFeatured: false,
  },
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: "T001",
    eventId: "1",
    event: MOCK_EVENTS[0],
    quantity: 2,
    totalPrice: 598,
    bookingDate: "2025-04-08",
    status: "upcoming",
    qrCode: "QR_T001_TECHFEST",
    ticketNumber: "LKO-2025-001234",
  },
  {
    id: "T002",
    eventId: "2",
    event: MOCK_EVENTS[1],
    quantity: 1,
    totalPrice: 50,
    bookingDate: "2025-04-07",
    status: "upcoming",
    qrCode: "QR_T002_BAZAAR",
    ticketNumber: "LKO-2025-001235",
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "reminder", title: "Techfest starts tomorrow!", body: "Your tickets for IIT Lucknow Techfest are ready. Gates open at 9 AM.", time: "1h ago", read: false },
  { id: "n2", type: "promo", title: "New event near you", body: "Photography Walk — Old City just listed, only 15 spots left.", time: "3h ago", read: false },
  { id: "n3", type: "booking", title: "Booking confirmed", body: "Sunday Bazaar Pop-Up — 1 ticket successfully booked.", time: "1d ago", read: true },
  { id: "n4", type: "update", title: "Venue update", body: "Indie Nights venue has been moved to Oudh 1590 Rooftop.", time: "2d ago", read: true },
];

const MOCK_USER: User = {
  id: "u1",
  name: "Arjun Sharma",
  email: "arjun.sharma@gmail.com",
  avatar: "AS",
  location: "Gomti Nagar, Lucknow",
  interests: ["tech", "music", "community"],
  college: "IET Lucknow",
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentPage: "home",
    selectedEventId: null,
    user: MOCK_USER,
    tickets: MOCK_TICKETS,
    savedEvents: ["3", "5"],
    cartEventId: null,
    cartQuantity: 1,
    searchQuery: "",
    activeCategory: "all",
    notifications: MOCK_NOTIFICATIONS,
    isLoggedIn: true,
  });

  const navigate = useCallback((page: Page, eventId?: string) => {
    setState((s) => ({ ...s, currentPage: page, selectedEventId: eventId ?? s.selectedEventId }));
    window.scrollTo(0, 0);
  }, []);

  const toggleSaveEvent = useCallback((eventId: string) => {
    setState((s) => ({
      ...s,
      savedEvents: s.savedEvents.includes(eventId)
        ? s.savedEvents.filter((id) => id !== eventId)
        : [...s.savedEvents, eventId],
    }));
  }, []);

  const addToCart = useCallback((eventId: string, quantity: number) => {
    setState((s) => ({ ...s, cartEventId: eventId, cartQuantity: quantity }));
  }, []);

  const confirmBooking = useCallback(() => {
    setState((s) => {
      if (!s.cartEventId) return s;
      const event = MOCK_EVENTS.find((e) => e.id === s.cartEventId);
      if (!event) return s;
      const newTicket: Ticket = {
        id: `T${Date.now()}`,
        eventId: s.cartEventId,
        event,
        quantity: s.cartQuantity,
        totalPrice: event.price * s.cartQuantity,
        bookingDate: new Date().toISOString().split("T")[0],
        status: "upcoming",
        qrCode: `QR_${Date.now()}`,
        ticketNumber: `LKO-2025-${Math.floor(Math.random() * 900000 + 100000)}`,
      };
      return {
        ...s,
        tickets: [newTicket, ...s.tickets],
        cartEventId: null,
        currentPage: "booking-confirm",
      };
    });
  }, []);

  const setSearchQuery = useCallback((q: string) => {
    setState((s) => ({ ...s, searchQuery: q }));
  }, []);

  const setActiveCategory = useCallback((c: Category) => {
    setState((s) => ({ ...s, activeCategory: c }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const cancelTicket = useCallback((ticketId: string) => {
    setState((s) => ({
      ...s,
      tickets: s.tickets.map((t) => (t.id === ticketId ? { ...t, status: "cancelled" as const } : t)),
    }));
  }, []);

  return (
    <AppContext.Provider value={{ ...state, navigate, toggleSaveEvent, addToCart, confirmBooking, setSearchQuery, setActiveCategory, markNotificationRead, cancelTicket }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

export { MOCK_EVENTS };