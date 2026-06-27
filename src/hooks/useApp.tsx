import { createContext, useContext, useState } from 'react'
import type { User } from '../types'
import { USERS } from '../data/mockData'

interface AppContextValue {
  user: User | null
  login: (email: string) => boolean
  logout: () => void
  kpirOverLimit: number
  addKpirDocs: (n: number) => void
}

const AppContext = createContext<AppContextValue>({
  user: null, login: () => false, logout: () => {}, kpirOverLimit: 5, addKpirDocs: () => {}
})
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [kpirOverLimit, setKpirOverLimit] = useState(5)

  const login = (email: string) => {
    const found = USERS.find(u => u.email === email)
    if (found) { setUser(found); return true }
    return false
  }
  const logout = () => setUser(null)
  const addKpirDocs = (n: number) => setKpirOverLimit(p => Math.max(0, p - n))

  return (
    <AppContext.Provider value={{ user, login, logout, kpirOverLimit, addKpirDocs }}>
      {children}
    </AppContext.Provider>
  )
}
