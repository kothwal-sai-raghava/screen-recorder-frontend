import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full bg-white/10 py-4 px-4 sm:px-8 shadow flex flex-col sm:flex-row justify-between items-center backdrop-blur-md">
      <h2 className="text-xl font-semibold mb-2 sm:mb-0">Screen Recorder</h2>

      <nav className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-end">
        <Link to="/" className="hover:text-blue-400 transition">
          Home
        </Link>
        <Link to="/profile" className="hover:text-blue-400 transition">
          Profile
        </Link>
        <Link to="/recordings" className="hover:text-blue-400 transition">
          Recordings
        </Link>
      </nav>
    </header>
  );
}
