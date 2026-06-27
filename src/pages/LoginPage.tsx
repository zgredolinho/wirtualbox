import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useApp } from '../hooks/useApp'

export function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const ok = login(email)
    setLoading(false)
    if (ok) {
      navigate('/dashboard')
    } else {
      setError('Nieprawidłowy e-mail lub hasło. Użyj danych demo poniżej.')
    }
  }

  const demoLogin = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('demo123')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center mb-3 shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">WirtualBOX</h1>
          <p className="text-sm text-gray-500 mt-1">Panel klienta i księgowości</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-modal p-8 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 mb-6">Zaloguj się do panelu</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Adres e-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="twoj@email.pl"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Hasło</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Zaloguj się
            </Button>
          </form>

          <button className="text-xs text-brand hover:underline mt-4 block w-full text-center">
            Nie pamiętasz hasła?
          </button>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-800 mb-2">🎯 Dane do logowania demo</p>
          <div className="space-y-2">
            <button
              onClick={() => demoLogin('klient@demo.pl')}
              className="w-full text-left p-2 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <p className="text-xs font-medium text-amber-900">Widok klienta</p>
              <p className="text-xs text-amber-700 font-mono">klient@demo.pl</p>
            </button>
            <div className="border-t border-amber-200" />
            <button
              onClick={() => demoLogin('admin@demo.pl')}
              className="w-full text-left p-2 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <p className="text-xs font-medium text-amber-900">Panel księgowości</p>
              <p className="text-xs text-amber-700 font-mono">admin@demo.pl</p>
            </button>
          </div>
          <p className="text-[10px] text-amber-600 mt-2">Hasło do obu kont: dowolne</p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2025 WirtualBOX — wersja demonstracyjna
        </p>
      </div>
    </div>
  )
}
