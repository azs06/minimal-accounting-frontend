const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Expected JSON response but got: ${contentType}. Response: ${text.substring(0, 100)}...`)
      }

      return response.json()
    } catch (error) {
      console.error(`API request to ${url} failed:`, error)
      throw error
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: any) {
    return this.request("/api/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Company methods
  async getCompanies() {
    return this.request("/api/companies")
  }

  async createCompany(name: string) {
    return this.request("/api/companies", {
      method: "POST",
      body: JSON.stringify({ name }),
    })
  }

  // Income methods
  async getIncome(companyId: number) {
    return this.request(`/api/companies/${companyId}/income`)
  }

  async createIncome(companyId: number, data: any) {
    return this.request(`/api/companies/${companyId}/income`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateIncome(companyId: number, incomeId: number, data: any) {
    return this.request(`/api/companies/${companyId}/income/${incomeId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteIncome(companyId: number, incomeId: number) {
    return this.request(`/api/companies/${companyId}/income/${incomeId}`, {
      method: "DELETE",
    })
  }

  // Expense methods
  async getExpenses(companyId: number) {
    return this.request(`/api/companies/${companyId}/expenses`)
  }

  async createExpense(companyId: number, data: any) {
    return this.request(`/api/companies/${companyId}/expenses`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Employee methods
  async getEmployees(companyId: number) {
    return this.request(`/api/companies/${companyId}/employees`)
  }

  async createEmployee(companyId: number, data: any) {
    return this.request(`/api/companies/${companyId}/employees`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Inventory methods
  async getInventory(companyId: number) {
    return this.request(`/api/companies/${companyId}/inventory`)
  }

  async createInventoryItem(companyId: number, data: any) {
    return this.request(`/api/companies/${companyId}/inventory`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Invoice methods
  async getInvoices(companyId: number) {
    return this.request(`/api/companies/${companyId}/invoices`)
  }

  async createInvoice(companyId: number, data: any) {
    return this.request(`/api/companies/${companyId}/invoices`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Reports methods
  async getProfitAndLoss(companyId: number, startDate: string, endDate: string) {
    return this.request(
      `/api/companies/${companyId}/reports/profit_and_loss?start_date=${startDate}&end_date=${endDate}`,
    )
  }

  async getSalesReport(companyId: number, startDate: string, endDate: string) {
    return this.request(`/api/companies/${companyId}/reports/sales_report?start_date=${startDate}&end_date=${endDate}`)
  }

  async getExpenseReport(companyId: number, startDate: string, endDate: string) {
    return this.request(
      `/api/companies/${companyId}/reports/expense_report?start_date=${startDate}&end_date=${endDate}`,
    )
  }
}

export const apiClient = new ApiClient()
