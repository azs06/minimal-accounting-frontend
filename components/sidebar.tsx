"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Building2, DollarSign, FileText, LogOut, Package, Receipt, TrendingUp, Users, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: TrendingUp,
  },
  {
    name: "Income",
    href: "/income",
    icon: DollarSign,
  },
  {
    name: "Expenses",
    href: "/expenses",
    icon: Receipt,
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    name: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    name: "Payroll",
    href: "/payroll",
    icon: Wallet,
  },
]

export function Sidebar() {
  const { selectedCompany, logout } = useAuth()
  const pathname = usePathname()

  const getHref = (href: string) => {
    if (!selectedCompany) return href
    return `/companies/${selectedCompany.id}${href}`
  }

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex h-16 items-center px-6">
        <Building2 className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold">MinimalHishab</span>
      </div>
      <Separator />

      {selectedCompany && (
        <div className="px-6 py-4">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Company</div>
          <div className="text-lg font-semibold">{selectedCompany.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{selectedCompany.role_in_company}</div>
        </div>
      )}

      <Separator />

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {navigation.map((item) => {
            const href = getHref(item.href)
            const isActive = pathname === href

            return (
              <Link key={item.name} href={href}>
                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
