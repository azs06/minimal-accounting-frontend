"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/components/auth-provider"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { selectedCompany, companies } = useAuth()
  const params = useParams()
  const router = useRouter()
  const companyId = params.companyId as string

  useEffect(() => {
    if (companies.length > 0 && (!selectedCompany || selectedCompany.id.toString() !== companyId)) {
      const company = companies.find((c) => c.id.toString() === companyId)
      if (!company) {
        router.push("/companies")
      }
    }
  }, [selectedCompany, companies, companyId, router])

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
