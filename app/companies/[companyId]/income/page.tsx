"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface IncomeRecord {
  id: number
  description: string
  amount: number
  date_received: string
  category: string
  notes?: string
}

export default function IncomePage() {
  const { selectedCompany } = useAuth()
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<IncomeRecord | null>(null)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date_received: "",
    category: "",
    notes: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (selectedCompany) {
      fetchIncomeRecords()
    }
  }, [selectedCompany])

  const fetchIncomeRecords = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/companies/${selectedCompany?.id}/income`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json()
          setIncomeRecords(data)
        }
      }
    } catch (error) {
      console.error("Failed to fetch income records:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    try {
      const url = editingRecord
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/companies/${selectedCompany?.id}/income/${editingRecord.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/companies/${selectedCompany?.id}/income`

      const method = editingRecord ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: Number.parseFloat(formData.amount),
        }),
      })

      if (response.ok) {
        toast({
          title: editingRecord ? "Income updated" : "Income added",
          description: "Income record has been saved successfully.",
        })
        setIsDialogOpen(false)
        resetForm()
        fetchIncomeRecords()
      } else {
        throw new Error("Failed to save income record")
      }
    } catch (error) {
      console.error("Save income error:", error)
      toast({
        title: "Error",
        description: "Failed to save income record. Please check your connection.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (record: IncomeRecord) => {
    setEditingRecord(record)
    setFormData({
      description: record.description,
      amount: record.amount.toString(),
      date_received: record.date_received,
      category: record.category,
      notes: record.notes || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this income record?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/companies/${selectedCompany?.id}/income/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.ok) {
        toast({
          title: "Income deleted",
          description: "Income record has been deleted successfully.",
        })
        fetchIncomeRecords()
      } else {
        throw new Error("Failed to delete income record")
      }
    } catch (error) {
      console.error("Delete income error:", error)
      toast({
        title: "Error",
        description: "Failed to delete income record. Please check your connection.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      date_received: "",
      category: "",
      notes: "",
    })
    setEditingRecord(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (isLoading) {
    return <div className="p-6">Loading income records...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Income</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage income records for {selectedCompany?.name}</p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRecord ? "Edit Income Record" : "Add Income Record"}</DialogTitle>
              <DialogDescription>
                {editingRecord ? "Update the income record details." : "Add a new income record."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_received">Date Received</Label>
                <Input
                  id="date_received"
                  type="date"
                  value={formData.date_received}
                  onChange={(e) => setFormData({ ...formData, date_received: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes (optional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingRecord ? "Update" : "Add"} Income</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
          <CardDescription>All income records for {selectedCompany?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          {incomeRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No income records found. Add your first income record to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.description}</TableCell>
                    <TableCell>{record.category}</TableCell>
                    <TableCell className="text-green-600 font-semibold">{formatCurrency(record.amount)}</TableCell>
                    <TableCell>{new Date(record.date_received).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(record.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
