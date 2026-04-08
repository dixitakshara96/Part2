

const categoryIcons: Record<string, string> = {
  all: "⬡",
  "college-fest": "🎓",
  popup: "🛍",
  community: "🤝",
  music: "🎵",
  food: "🍜",
  tech: "💻",
  sports: "⚡",
};

const categoryLabels: Record<string, string> = {
  all: "All",
  "college-fest": "College Fests",
  popup: "Pop-Ups",
  community: "Community",
  music: "Music",
  food: "Food",
  tech: "Tech",
  sports: "Sports",
};

const CATEGORIES: Category[] = ["all", "college-fest", "popup", "community", "music", "food", "tech", "sports"];

export default function HomePage() {
  const { navigate, toggleSaveEvent, savedEvents, activeCategory, setActiveCategory, notifications, user } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  const filtered = activeCategory === "all" ? MOCK_EVENTS : MOCK_EVENTS.filter((e) => e.category === activeCategory);
  const featured = MOCK_EVENTS.filter((e) => e.isFeatured);
  const today = MOCK_EVENTS.filter((e) => {
    const d = new Date(e.date);
    const now = new Date("2025-04-13");
    return d.getTime() - now.getTime() < 3 * 86400000 && d >= now;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-stone-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
                <span className="text-stone-950 font-bold text-xs">LK</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-white">lokl</span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
              <span>📍</span> {user.location}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("search")} className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 transition-colors">
              <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <button onClick={() => navigate("notifications")} className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 transition-colors relative">
              <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-stone-950 text-xs font-bold rounded-full flex items-center justify-center">{unread}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Hero greeting */}
        <div className="pt-6 pb-4">
          <h1 className="text-2xl font-bold text-white">
            Hey {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-stone-400 text-sm mt-1">3 events happening near you this weekend</p>
        </div>

        {/* Featured Carousel */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">Featured</h2>
            <button onClick={() => navigate("explore")} className="text-amber-400 text-xs font-medium">See all →</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {featured.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate("event-detail", event.id)}
                className="flex-shrink-0 w-72 rounded-2xl overflow-hidden cursor-pointer group relative"
              >
                <div className="relative h-44">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-amber-400 text-stone-950 text-xs font-bold px-2 py-0.5 rounded-full">
                      {categoryLabels[event.category]}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSaveEvent(event.id); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur rounded-full flex items-center justify-center"
                  >
                    <svg className={`w-4 h-4 ${savedEvents.includes(event.id) ? "fill-amber-400 stroke-amber-400" : "fill-none stroke-white"}`} viewBox="0 0 24 24">
                      <path strokeWidth="2" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-semibold text-sm leading-tight">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-stone-300 text-xs">{event.distance}</span>
                      <span className="text-stone-500 text-xs">•</span>
                      <span className="text-stone-300 text-xs">{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      <span className="text-stone-500 text-xs">•</span>
                      <span className="text-amber-400 text-xs font-semibold">{event.price === 0 ? "Free" : `₹${event.price}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Happening Soon */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">Happening Soon</h2>
            <span className="text-xs text-stone-500">Next 3 days</span>
          </div>
          <div className="space-y-3">
            {today.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate("event-detail", event.id)}
                className="flex gap-3 bg-stone-900 border border-stone-800 rounded-2xl p-3 cursor-pointer hover:border-stone-600 transition-colors"
              >
                <img src={event.image} alt={event.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{event.title}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{event.venue}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-amber-400 text-xs font-semibold">{event.price === 0 ? "Free" : `₹${event.price}`}</span>
                    <span className="text-stone-600 text-xs">•</span>
                    <span className="text-stone-400 text-xs">{event.distance}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <div className="bg-stone-800 rounded-lg px-2 py-1 text-center">
                    <p className="text-amber-400 text-xs font-bold">{new Date(event.date).getDate()}</p>
                    <p className="text-stone-400 text-xs">{new Date(event.date).toLocaleString("en-IN", { month: "short" })}</p>
                  </div>
                  <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-wider mb-3">Browse by Type</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); navigate("explore"); }}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-xs font-medium transition-colors ${activeCategory === cat ? "bg-amber-400 text-stone-950" : "bg-stone-900 text-stone-300 hover:bg-stone-800"}`}
              >
                <span className="text-lg">{categoryIcons[cat]}</span>
                <span className="whitespace-nowrap">{categoryLabels[cat]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* All Events Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">All Events</h2>
            <span className="text-xs text-stone-500">{filtered.length} events</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate("event-detail", event.id)}
                className="rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 cursor-pointer hover:border-stone-600 transition-colors"
              >
                <div className="relative h-28">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {event.price === 0 && (
                    <span className="absolute top-2 left-2 bg-emerald-400 text-stone-950 text-xs font-bold px-1.5 py-0.5 rounded-full">Free</span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{event.title}</p>
                  <p className="text-stone-500 text-xs mt-1">{event.distance}</p>
                  <p className="text-amber-400 text-xs font-bold mt-1">{event.price === 0 ? "Free" : `₹${event.price}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}

export function BottomNav() {
  const { currentPage, navigate, tickets } = useApp();
  const upcoming = tickets.filter((t) => t.status === "upcoming").length;

  const items = [
    { page: "home" as const, label: "Home", icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? "text-amber-400" : "text-stone-500"}`} fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline strokeWidth="2" points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { page: "explore" as const, label: "Explore", icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? "text-amber-400" : "text-stone-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="2"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={active ? "currentColor" : "none"} strokeWidth="2"/>
      </svg>
    )},
    { page: "my-tickets" as const, label: "Tickets", icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? "text-amber-400" : "text-stone-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
      </svg>
    ), badge: upcoming > 0 ? upcoming : undefined },
    { page: "profile" as const, label: "Profile", icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? "text-amber-400" : "text-stone-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeWidth="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4" strokeWidth="2"/>
      </svg>
    )},
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur border-t border-stone-800">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {items.map(({ page, label, icon, badge }) => (
          <button
            key={page}
            onClick={() => navigate(page)}
            className="flex flex-col items-center gap-1 px-4 py-1.5 relative"
          >
            {icon(currentPage === page)}
            <span className={`text-xs ${currentPage === page ? "text-amber-400" : "text-stone-500"}`}>{label}</span>
            {badge && (
              <span className="absolute -top-0 right-2 w-4 h-4 bg-amber-400 text-stone-950 text-xs font-bold rounded-full flex items-center justify-center">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}