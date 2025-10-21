import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

function Login(): React.ReactElement {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-3 sm:px-4 py-6">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">Iniciar sesión</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);

            const form = e.currentTarget as HTMLFormElement;
            const data = new FormData(form);
            const email = String(data.get("email") ?? "").trim();
            const password = String(data.get("password") ?? "");
            const remember = data.get("remember") === "on";

            // Obtener usuarios desde localStorage. Se espera un array de objetos { email, password, ... }
            const raw = localStorage.getItem("users");
            type User = { email: string; password: string; [key: string]: unknown };
            let users: User[] = [];

            try {
              users = raw ? JSON.parse(raw) : [];
            } catch {
              users = [];
            }

            const found = users.find((u) => u.email === email && u.password === password);

            if (found) {
              // Opcional: almacenar usuario actual
              localStorage.setItem("currentUser", JSON.stringify(found));
              if (remember) {
                // Si se quiere persistir sesión, ya quedó en localStorage; si no, podrías usar sessionStorage
                // aquí solo dejamos como ejemplo que currentUser permanece en localStorage cuando remember es true
              } else {
                // Si no recuerda, usar sessionStorage en lugar de localStorage
                sessionStorage.setItem("currentUser", JSON.stringify(found));
              }

              // Redirigir a /home
              navigate("/home");
            } else {
              setError("Credenciales inválidas. Verifica correo y contraseña.");
            }
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-teal-400 focus:ring-teal-400 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
              Recuérdame
            </label>
          </div>

          {error && <div className="text-xs sm:text-sm text-red-600 p-2 bg-red-50 rounded">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 sm:py-2.5 bg-teal-400 text-white text-sm sm:text-base rounded-lg shadow-md transform motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out hover:bg-teal-500 hover:scale-105 hover:shadow-lg active:scale-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <Link to="/register" className="text-xs sm:text-sm text-teal-500 hover:underline">
            ¿No tienes una cuenta? Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;