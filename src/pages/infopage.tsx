import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

type PriceCardProps = {
    title: string;
    price: string;
    features: string[];
    recommended?: boolean;
};


const PriceCard: React.FC<PriceCardProps> = ({ title, price, features, recommended }) => {
    return (
        <div className="flex-1 min-w-[280px] rounded-xl p-4 sm:p-5 bg-white shadow-md border border-slate-100" role="article" aria-label={`${title} plan`}>
            {recommended ? <div className="inline-block bg-yellow-100 text-yellow-800 px-2 sm:px-3 py-1 rounded-full font-bold text-xs mb-2 sm:mb-3">Más popular</div> : null}
            <h3 className="mt-1 text-lg sm:text-xl">{title}</h3>
            <div className="text-xl sm:text-2xl font-extrabold my-2" aria-hidden>
                {price}
            </div>
            <p className="m-0 text-xs sm:text-sm text-slate-600">Pago mensual. Cancela en cualquier momento.</p>

            <ul className="mt-3 pl-4 text-xs sm:text-sm text-slate-700 space-y-1">
                {features.map((f, i) => (
                    <li key={i}>{f}</li>
                ))}
            </ul>

            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
                <button className="bg-teal-400 hover:bg-teal-500 active:scale-95 transition text-white py-2 px-4 rounded-lg font-extrabold text-sm sm:text-base" aria-label={`Seleccionar ${title}`}>
                    Empezar
                </button>
                <button className="bg-transparent text-slate-900 border border-slate-200 py-2 px-4 rounded-lg font-extrabold text-sm sm:text-base hover:bg-slate-50 active:scale-95 transition" aria-label={`Más info ${title}`}>
                    Detalles
                </button>
            </div>
        </div>
    );
};

export default function InfoPage(): React.ReactElement {
    return (
        <div className="font-sans text-slate-900 leading-relaxed pt-14 sm:pt-16">
                <Navbar />
                <div className="max-w-[1100px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">

                <main>
                    <section id="inicio" className="flex flex-col md:flex-row gap-4 sm:gap-7 items-center justify-between mt-2 sm:mt-4 p-4 sm:p-7 rounded-xl bg-gradient-to-b from-slate-50 to-white shadow-lg" aria-labelledby="hero-title">
                        <div className="max-w-full md:max-w-[640px]">
                            <h1 id="hero-title" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
                                Gestión de inventario moderna y confiable
                            </h1>
                            <p className="text-sm sm:text-base text-slate-600">
                                Controla stock, movimientos y reportes en tiempo real. Diseñado para pymes y equipos de logística que necesitan
                                una interfaz clara, integraciones y precios transparentes.
                            </p>

                            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button className="bg-teal-400 hover:bg-teal-500 active:scale-95 text-white py-2 px-4 rounded-lg font-extrabold text-sm sm:text-base transition"><Link to="/register"> Comenzar gratis</Link></button>
                                <button className="bg-transparent text-slate-900 border border-slate-200 py-2 px-4 rounded-lg font-extrabold text-sm sm:text-base hover:bg-slate-50 active:scale-95 transition">Ver demo</button>
                            </div>

                        </div>

                
                    </section>

                    <section id="caracteristicas" className="mt-4 sm:mt-7">
                        <h2 className="mb-2 text-xl sm:text-2xl">Características principales</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                            <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm">
                                <strong className="text-sm sm:text-base">Control de stock</strong>
                                <p className="mt-2 text-xs sm:text-sm text-slate-500">Niveles, alertas y movimientos históricos por ubicación.</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm">
                                <strong className="text-sm sm:text-base">Reportes y análisis</strong>
                                <p className="mt-2 text-xs sm:text-sm text-slate-500">Exporta reportes y visualiza tendencias de consumo.</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm">
                                <strong className="text-sm sm:text-base">Roles y permisos</strong>
                                <p className="mt-2 text-xs sm:text-sm text-slate-500">Controla quién puede ver o editar inventarios y pedidos.</p>
                            </div>
                        </div>
                    </section>

                    <section id="precios" className="mt-4 sm:mt-7">
                        <h2 className="mb-2 text-xl sm:text-2xl">Planes y precios</h2>
                        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mt-3 sm:mt-4">
                            <PriceCard title="Básico" price="Free" features={["Uso exclusivamente Local", "Usuarios limitados", "Sin Reportes automáticos"]} />
                            <PriceCard title="Pro" price="$9 / mes" recommended features={["Usuario Ilimitados", "Reportes automaticos avanzados", "Soporte por chat"]} />
                            <PriceCard title="Enterprise" price="Cotizar" features={["SLA dedicado", "Integraciones a medida", "Onboarding y formación"]} />
                        </div>
                    </section>
                    <section id="faq" className="mt-4 sm:mt-7">
                        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm">

                        <h2 className="mb-2 sm:mb-3 font-bold text-lg sm:text-xl md:text-2xl">¿Qué es Mini POS y cómo funciona?</h2>
                        <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">Mini POS es un sistema de punto de venta diseñado para pequeñas empresas que permite gestionar el inventario, realizar ventas y generar reportes de manera sencilla y eficiente.
                        Mini POS funciona localmente en tu dispositivo, garantizando rapidez y seguridad sin depender de conexiones externas,
                        es decir que tus datos siempre están bajo tu control y no se almacenan en la nube Usa unicamente tu LOCAL STORAGE asi que cuidalo ahi quedaran guardados tus archivos.
                        </p>
                        </div>
                    </section>
                </main>

                
            </div>
            <Footer />
        </div>
    );
}
