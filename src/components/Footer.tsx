
function Footer() {
  return (
    <footer className="mt-12 pt-7 border-t border-slate-100 text-slate-600 flex justify-between items-center py-6 px-10">
                    <div>
                        <strong>Inventario</strong>
                        <div className="text-sm mt-1">Solución de gestión de inventario — privacidad y seguridad en la nube</div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <a href="#contact" className="text-slate-900 no-underline font-semibold">
                            Contacto
                        </a>
                        <a href="#tos" className="text-slate-500 no-underline">
                            Términos
                        </a>
                        <small className="text-slate-400">© {new Date().getFullYear()} Inventario</small>
                    </div>
                </footer>
  )
}

export default Footer