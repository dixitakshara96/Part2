import React from "react";
import { useApp } from "../Context/AppContex";
import { BottomNav } from "./HomePage";

// ─── Booking Confirmation ────────────────────────────────────────────────────
export function BookingConfirmPage() {
  const { tickets, navigate } = useApp();
  const ticket = tickets[0];
  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center px-4">
      {/* Success animation */}
      <div className="mb-8 relative">
        <div className="w-24 h-24 rounded-full bg-amber-400/10 border-2 border-amber-400 flex items-center justify-center">
          <svg className="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-amber-400"
            style={{
              top: "50%", left: "50%",
              transform: `rotate(${i * 45}deg) translateY(-48px)`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <h1 className="text-2xl font-bold text-white mb-1">Booking Confirmed!</h1>
      <p className="text-stone-400 text-sm mb-8 text-center">Your tickets are ready. Have an amazing time!</p>

      {/* Ticket Card */}
      <div className="w-full max-w-sm">
        <div className="bg-stone-900 rounded-3xl overflow-hidden border border-stone-700">
          <img src={ticket.event.image} alt={ticket.event.title} className="w-full h-36 object-cover" />
          <div className="p-5">
            <h2 className="text-white font-bold text-lg leading-tight">{ticket.event.title}</h2>
            <p className="text-stone-400 text-sm mt-1">{ticket.event.venue}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Date", value: new Date(ticket.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                { label: "Time", value: ticket.event.time },
                { label: "Tickets", value: `${ticket.quantity} person${ticket.quantity > 1 ? "s" : ""}` },
                { label: "Amount", value: ticket.totalPrice === 0 ? "Free" : `₹${ticket.totalPrice}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-stone-500 text-xs">{label}</p>
                  <p className="text-white text-sm font-medium mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* Divider with notches */}
            <div className="flex items-center gap-2 my-4">
              <div className="w-5 h-5 rounded-full bg-stone-950 -ml-8 border-r border-stone-700" />
              <div className="flex-1 border-t border-dashed border-stone-700" />
              <div className="w-5 h-5 rounded-full bg-stone-950 -mr-8 border-l border-stone-700" />
            </div>

            {/* QR Code placeholder */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center mb-2">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  {/* Simple QR-like grid */}
                  {[0,1,2,3,4,5,6].flatMap((row) =>
                    [0,1,2,3,4,5,6].map((col) => {
                      const isCorner = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
                      const rand = ((row * 7 + col) * 137 + 17) % 2;
                      return (
                        <rect
                          key={`${row}-${col}`}
                          x={10 + col * 12}
                          y={10 + row * 12}
                          width="10" height="10" rx="1"
                          fill={isCorner || rand === 0 ? "#0c0a09" : "#ffffff"}
                        />
                      );
                    })
                  )}
                </svg>
              </div>
              <p className="text-stone-500 text-xs">Ticket #{ticket.ticketNumber}</p>
              <p className="text-stone-600 text-xs mt-0.5">Show this at the venue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6 w-full max-w-sm">
        <button
          onClick={() => navigate("my-tickets")}
          className="flex-1 bg-amber-400 text-stone-950 font-bold rounded-xl py-3 text-sm"
        >
          View My Tickets
        </button>
        <button
          onClick={() => navigate("home")}
          className="flex-1 border border-stone-700 text-stone-300 rounded-xl py-3 text-sm"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

// ─── My Tickets ──────────────────────────────────────────────────────────────
export function MyTicketsPage() {
  const { tickets, navigate, cancelTicket } = useApp();
  const [activeTab, setActiveTab] = React.useState<"upcoming" | "attended" | "cancelled">("upcoming");

  const filtered = tickets.filter((t) => t.status === activeTab);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-stone-800 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-white mb-3">My Tickets</h1>
          <div className="flex gap-1 bg-stone-900 rounded-xl p-1">
            {(["upcoming", "attended", "cancelled"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${activeTab === tab ? "bg-amber-400 text-stone-950" : "text-stone-400"}`}
              >
                {tab}
                {tab === "upcoming" && tickets.filter((t) => t.status === "upcoming").length > 0 && (
                  <span className="ml-1 bg-stone-800 text-stone-300 text-xs px-1.5 py-0.5 rounded-full">
                    {tickets.filter((t) => t.status === "upcoming").length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
              </svg>
            </div>
            <p className="text-stone-300 font-medium">No {activeTab} tickets</p>
            <p className="text-stone-600 text-sm mt-1">Explore events to book your next experience</p>
            <button
              onClick={() => navigate("explore")}
              className="mt-4 bg-amber-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-sm"
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ticket) => (
              <div key={ticket.id} className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden">
                <div className="relative h-32">
                  <img src={ticket.event.image} alt={ticket.event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">{ticket.event.title}</p>
                      <p className="text-stone-300 text-xs">{ticket.event.venue}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      ticket.status === "upcoming" ? "bg-amber-400 text-stone-950"
                      : ticket.status === "attended" ? "bg-emerald-400 text-stone-950"
                      : "bg-stone-700 text-stone-300"
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                    {[
                      { label: "Date", value: new Date(ticket.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) },
                      { label: "Tickets", value: `${ticket.quantity}x` },
                      { label: "Paid", value: ticket.totalPrice === 0 ? "Free" : `₹${ticket.totalPrice}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-stone-800 rounded-xl p-2 text-center">
                        <p className="text-stone-500">{label}</p>
                        <p className="text-white font-semibold mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border border-dashed border-stone-700 rounded-xl p-3 flex items-center justify-between mb-3">
                    <div>
                      <p className="text-stone-500 text-xs">Ticket ID</p>
                      <p className="text-white text-xs font-mono mt-0.5">{ticket.ticketNumber}</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 40 40" className="w-10 h-10">
                        {[0,1,2,3].flatMap((r) => [0,1,2,3].map((c) => (
                          <rect key={`${r}-${c}`} x={4+c*8} y={4+r*8} width="6" height="6" rx="0.5" fill={((r+c) % 2 === 0 || (r===1&&c===2)) ? "#0c0a09" : "#fff"}/>
                        )))}
                      </svg>
                    </div>
                  </div>

                  {ticket.status === "upcoming" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate("event-detail", ticket.event.id)}
                        className="flex-1 border border-stone-700 text-stone-300 rounded-xl py-2.5 text-xs font-medium"
                      >
                        View Event
                      </button>
                      <button
                        onClick={() => cancelTicket(ticket.id)}
                        className="flex-1 border border-red-900/50 text-red-400 rounded-xl py-2.5 text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}