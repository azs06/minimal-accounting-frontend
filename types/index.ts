export interface User {
  id: number
  username: string
  email: string
  role: "user" | "system_admin"
}

export interface Company {
  id: number
  name: string
  role_in_company: "owner" | "admin" | "editor" | "viewer"
}

export interface Employee {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  position?: string
  hire_date: string
  is_active: boolean
  user_id?: number
  company_id: number
}

export interface IncomeRecord {
  id: number
  description: string
  amount: number
  date_received: string
  category: string
  notes?: string
  company_id: number
  user_id: number
}

export interface ExpenseRecord {
  id: number
  description: string
  amount: number
  date_incurred: string
  category: string
  vendor?: string
  notes?: string
  company_id: number
  user_id: number
}

export interface InventoryItem {
  id: number
  name: string
  description?: string
  sku?: string
  purchase_price?: number
  sale_price?: number
  quantity_on_hand: number
  unit_of_measure?: string
  company_id: number
}

export interface Invoice {
  id: number
  customer_name: string
  customer_email?: string
  customer_address?: string
  issue_date: string
  due_date: string
  status: "Draft" | "Sent" | "Paid" | "Overdue"
  notes?: string
  total_amount: number
  company_id: number
  created_by_user_id: number
  items: InvoiceItem[]
}

export interface InvoiceItem {
  id: number
  invoice_id: number
  item_id?: number
  item_description: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface SalaryRecord {
  id: number
  employee_id: number
  payment_date: string
  gross_amount: number
  deductions: number
  net_amount: number
  payment_period_start: string
  payment_period_end: string
  notes?: string
  recorded_by_user_id: number
}
