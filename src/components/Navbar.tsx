import { Link } from "react-router-dom";

function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between py-2 sm:py-3 px-3 sm:px-6 bg-white shadow-sm z-10">
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 no-underline text-current" aria-label="Inventario - Volver al inicio">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden className="sm:w-9 sm:h-9">
                    <rect width="24" height="24" rx="6" fill="#06b6d4" />
                    <path d="M6 12h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M6 8h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                </svg>
                <span className="font-extrabold text-sm sm:text-base">Mini POS</span>
            </Link>

            <nav className="flex gap-2 sm:gap-4 items-center" aria-label="Navegación principal">
                <ol className="flex gap-2 sm:gap-8 items-center list-inside">
                    <li>
                        <Link to="/login" className="bg-teal-400 hover:bg-teal-500 active:scale-95 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition">
                            Ingresar
                        </Link>
                    </li>
                </ol>
            </nav>
        </header>
    );
}

export default Navbar;
