"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      setIsConnected(response.ok)
    } catch (error) {
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }

  if (isChecking) {
    return (
      <Alert className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Checking backend connection...</AlertDescription>
      </Alert>
    )
  }

  if (isConnected === false) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Cannot connect to backend server at {process.env.NEXT_PUBLIC_API_URL || "http:/localhost:8080"}. Please make
          sure your backend server is running.
        </AlertDescription>
      </Alert>
    )
  }

  if (isConnected === true) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>Successfully connected to backend server.</AlertDescription>
      </Alert>
    )
  }

  return null
}
