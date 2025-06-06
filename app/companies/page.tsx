"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Building2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CompaniesPage() {
  const { companies, selectCompany, user } = useAuth()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSelectCompany = (company: any) => {
    selectCompany(company)
    router.push(`/companies/${company.id}/dashboard`)
  }

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: companyName }),
      })

      if (response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const newCompany = await response.json()
          toast({
            title: "Company created",
            description: `${companyName} has been created successfully.`,
          })
          setIsCreateDialogOpen(false)
          setCompanyName("")
          // Refresh the page to show the new company
          window.location.reload()
        } else {
          throw new Error("Invalid response format")
        }
      } else {
        toast({
          title: "Failed to create company",
          description: `Server error: ${response.status} ${response.statusText}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Create company error:", error)
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please make sure the backend is running.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Your Companies</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Select a company to manage its accounting data</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Card
                key={company.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSelectCompany(company)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                  </div>
                  <CardDescription className="capitalize">Role: {company.role_in_company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Access Company</Button>
                </CardContent>
              </Card>
            ))}

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-dashed">
                  <CardContent className="flex flex-col items-center justify-center h-48">
                    <Plus className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Create New Company</h3>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Company</DialogTitle>
                  <DialogDescription>Create a new company to manage its accounting data.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCompany} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Company"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
