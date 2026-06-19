import { Link } from "react-router-dom";
import { useEffect } from "react";

const STATS = [
  { value: "40%",        label: "of food produced globally is wasted each year" },
  { value: "1.3B tons",  label: "of food wasted annually worldwide"              },
  { value: "8–10%",      label: "of global greenhouse gas emissions from food waste" },
  { value: "$1 trillion", label: "economic cost of food waste every year"        },
];

const HOW_IT_WORKS = [
  {
    icon: "🤝",
    title: "Donors Register & Donate",
    desc: "Food businesses, farms, and individuals register as donors and log surplus food items with weight, type, and expiry date.",
  },
  {
    icon: "🏭",
    title: "Collection Centers Accept Waste",
    desc: "Nearby collection centers receive donated items, track their capacity in real time, and flag when they are approaching their limit.",
  },
  {
    icon: "⚙️",
    title: "Processors Handle the Rest",
    desc: "Waste is dispatched to processing facilities using a greedy allocation algorithm — least-loaded processor gets the next batch.",
  },
  {
    icon: "📊",
    title: "Reports Drive Decisions",
    desc: "Admins and operators get live reports on top donors, waste type frequency, processing queues, and allocation efficiency.",
  },
];

const FEATURES = [
  { icon: "🌱", title: "Role-Based Access",      desc: "Admins, Operators, and Donors each see only what's relevant to their responsibilities."         },
  { icon: "📦", title: "Real-Time Capacity",     desc: "Collection centers and processors show live load bars with colour-coded warnings."               },
  { icon: "⏳", title: "Priority Processing",    desc: "Items nearing expiry bubble to the top of the processing queue automatically."                   },
  { icon: "📈", title: "Visual Analytics",       desc: "Bar charts, donut charts, and ranked tables make waste trends immediately readable."             },
  { icon: "🔒", title: "Secure Auth",            desc: "JWT-based login with protected routes ensures only authorised users access sensitive data."       },
  { icon: "🗑️",  title: "Full CRUD Management",  desc: "Create, view, edit, and delete donors, waste items, centers, processors, and users in one place." },
];

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white px-6 py-24 text-center">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-green-300 mb-4">
            Food Waste Management System
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
            Turn food surplus into <br />
            <span className="text-green-300">structured action</span>
          </h1>
          <p className="text-green-100 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            A unified platform for tracking food donations, managing collection centers,
            optimising processor allocation, and reducing waste — end to end.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-white text-green-800 font-semibold rounded-xl hover:bg-green-50 transition shadow"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-white text-green-800 font-semibold rounded-xl hover:bg-green-50 transition shadow"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 border border-white/40 text-white font-medium rounded-xl hover:bg-white/10 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-green-50 border-y border-green-100 px-6 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.value}>
              <p className="text-3xl font-extrabold text-green-700">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem statement ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-green-500">The Problem</span>
        <h2 className="text-3xl font-bold mt-3 mb-5 text-gray-900">
          Food waste is a systems problem.<br />It needs a systems solution.
        </h2>
        <p className="text-gray-500 leading-relaxed text-base">
          Surplus food spoils because the handoff between donors, collection points, and
          processors is manual, fragmented, and slow. By the time someone notices a
          collection center is full or a batch is about to expire, the damage is done.
          This platform replaces spreadsheets and phone calls with a single source of truth
          — so the right food gets to the right place before it's too late.
        </p>
      </section>

      {/* ── How it works ── */}
      <section className="bg-gray-50 border-y border-gray-100 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-green-500">How It Works</span>
            <h2 className="text-3xl font-bold mt-3 text-gray-900">From donation to processing in four steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="text-xs font-bold text-green-600 mb-1">Step {i + 1}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-green-500">Features</span>
          <h2 className="text-3xl font-bold mt-3 text-gray-900">Everything you need to manage food waste</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50/40 transition">
              <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who is it for ── */}
      <section className="bg-green-900 text-white px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-green-400">Who It's For</span>
            <h2 className="text-3xl font-bold mt-3">Three roles, one platform</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                role: "Admin",
                badge: "bg-purple-500/30 text-purple-200",
                icon: "👑",
                points: [
                  "Full access to all modules",
                  "User management & role assignment",
                  "Delete donors, waste items, and processors",
                  "View all reports and analytics",
                ],
              },
              {
                role: "Operator",
                badge: "bg-blue-500/30 text-blue-200",
                icon: "🛠️",
                points: [
                  "Add and edit donors",
                  "Accept waste at collection centers",
                  "Dispatch batches to processors",
                  "Monitor capacity and processing queue",
                ],
              },
              {
                role: "Donor",
                badge: "bg-green-500/30 text-green-200",
                icon: "🤝",
                points: [
                  "View the donor list",
                  "Track their own donation history",
                  "Read-only access — no edit rights",
                  "Simple, focused dashboard",
                ],
              },
            ].map((r) => (
              <div key={r.role} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{r.icon}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.badge}`}>
                    {r.role}
                  </span>
                </div>
                <ul className="space-y-2">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-green-100">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to reduce food waste?
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Join the platform and start tracking donations, managing centers,
          and processing surplus food — all in one place.
        </p>
        {user ? (
          <Link
            to="/dashboard"
            className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow"
          >
            Go to Dashboard →
          </Link>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow"
            >
              Create an Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Login
            </Link>
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        <span className="text-lg mr-1">🌱</span>
        FoodWaste Management System · Built to reduce waste, one donation at a time.
      </footer>

    </div>
  );
};

export default Home;