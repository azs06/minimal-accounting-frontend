"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  email: string
  role: string
}

interface Company {
  id: number
  name: string
  role_in_company: string
}

interface AuthContextType {
  user: User | null
  companies: Company[]
  selectedCompany: Company | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  selectCompany: (company: Company) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    const savedCompany = localStorage.getItem("selectedCompany")

    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      if (savedCompany) {
        setSelectedCompany(JSON.parse(savedCompany))
      }
      fetchCompanies()
    }
    setIsLoading(false)
  }, [])

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json()
          setCompanies(data)
        }
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log(process.env.NEXT_PUBLIC_API_URL);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        console.error("Login failed with status:", response.status)
        return false
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", await response.text())
        return false
      }

      const data = await response.json()
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      await fetchCompanies()
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("selectedCompany")
    setUser(null)
    setCompanies([])
    setSelectedCompany(null)
    router.push("/login")
  }

  const selectCompany = (company: Company) => {
    setSelectedCompany(company)
    localStorage.setItem("selectedCompany", JSON.stringify(company))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        companies,
        selectedCompany,
        login,
        logout,
        selectCompany,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
