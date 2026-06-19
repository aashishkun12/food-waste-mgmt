import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-green-900 border-t border-green-700/40 text-green-100">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-white text-base">FoodWaste MS</span>
          </div>
          <p className="text-sm text-green-300 leading-relaxed">
            A unified platform to track food donations, manage collection centers,
            and reduce waste — end to end.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {[
              { to: "/",       label: "Home"    },
              { to: "/contact", label: "Contact" },
              { to: "/login",  label: "Login"   },
              { to: "/signup", label: "Sign Up"  },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-green-300 hover:text-white transition"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mission */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-green-400 mb-3">
            Our Mission
          </h4>
          <p className="text-sm text-green-300 leading-relaxed">
            Every kilogram of food saved is a step toward a more sustainable world.
            We connect donors, operators, and processors to make that happen.
          </p>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-green-700/40 px-6 py-4">
        <p className="text-center text-xs text-green-500">
          &copy; {year} Food Waste Management System. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;