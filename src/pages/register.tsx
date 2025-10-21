import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type FormState = {
  name: string
  email: string
  password: string
  confirmPassword: string
  aceptTerms: boolean
}

export default function Register(): React.ReactElement {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    aceptTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string>('')

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'El nombre es requerido'
    if (!form.email.trim()) e.email = 'El correo es requerido'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Correo inválido'
    if (!form.password) e.password = 'La contraseña es requerida'
    else if (form.password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres'
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Las contraseñas no coinciden'
    if (!form.aceptTerms) e.aceptTerms = 'Debes aceptar los términos y condiciones'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setSubmitError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('users') : null
      const users: Array<{ name: string; email: string; password: string }> = raw ? JSON.parse(raw) : []

      const exists = users.some(u => u.email.toLowerCase() === form.email.toLowerCase())
      if (exists) {
        setSubmitError('Ya existe un usuario con ese correo')
        return
      }

      // Guardar usuario (nota: en producción no se debe guardar la contraseña en texto plano)
      users.push({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      localStorage.setItem('users', JSON.stringify(users))

  // Redirigir a /login
  navigate('/login')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setSubmitError('Error al guardar los datos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 sm:p-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4"
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">Registro</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Tu nombre"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="correo@ejemplo.com"
            type="email"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="********"
            type="password"
          />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Verificar contraseña</label>
          <input
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Repite la contraseña"
            type="password"
          />
          {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="aceptTerms"
            name="aceptTerms"
            type="checkbox"
            checked={form.aceptTerms}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="aceptTerms" className="text-sm text-gray-700">Acepto los términos y condiciones</label>
        </div>
        {errors.aceptTerms && <p className="text-xs text-red-600">{errors.aceptTerms}</p>}

        {submitError && <p className="text-xs sm:text-sm text-red-600 p-2 bg-red-50 rounded">{submitError}</p>}

        <button
            type="submit"
            className="w-full py-2 sm:py-2.5 bg-teal-400 text-white text-sm sm:text-base rounded-lg shadow-md transform motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out hover:bg-teal-500 hover:scale-105 hover:shadow-lg active:scale-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            Registrarme
          </button>
      <div className="mt-4 sm:mt-6 text-center">
          <Link to="/login" className="text-xs sm:text-sm text-teal-500 hover:underline">
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  )
}