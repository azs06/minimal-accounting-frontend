"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, Package, Receipt, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  totalInvoices: number
  totalEmployees: number
  totalInventoryItems: number
  netProfit: number
}

export default function DashboardPage() {
  const { selectedCompany } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    totalInvoices: 0,
    totalEmployees: 0,
    totalInventoryItems: 0,
    netProfit: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (selectedCompany) {
      fetchDashboardData()
    }
  }, [selectedCompany])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

      // Fetch data from multiple endpoints
      const [incomeRes, expensesRes, invoicesRes, employeesRes, inventoryRes] = await Promise.all([
        fetch(`${baseUrl}/api/companies/${selectedCompany?.id}/income`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/companies/${selectedCompany?.id}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/companies/${selectedCompany?.id}/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/companies/${selectedCompany?.id}/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/companies/${selectedCompany?.id}/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const [income, expenses, invoices, employees, inventory] = await Promise.all([
        incomeRes.ok ? incomeRes.json() : [],
        expensesRes.ok ? expensesRes.json() : [],
        invoicesRes.ok ? invoicesRes.json() : [],
        employeesRes.ok ? employeesRes.json() : [],
        inventoryRes.ok ? inventoryRes.json() : [],
      ])

      const totalIncome = income.reduce((sum: number, item: any) => sum + Number.parseFloat(item.amount || 0), 0)
      const totalExpenses = expenses.reduce((sum: number, item: any) => sum + Number.parseFloat(item.amount || 0), 0)

      setStats({
        totalIncome,
        totalExpenses,
        totalInvoices: invoices.length,
        totalEmployees: employees.length,
        totalInventoryItems: inventory.length,
        netProfit: totalIncome - totalExpenses,
      })
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Overview of {selectedCompany?.name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(stats.netProfit)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInventoryItems}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
