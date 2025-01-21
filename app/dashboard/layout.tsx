"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Train, Search, BookOpen, LogOut, PlusCircle } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Train className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold">RailwayGo</span>
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/dashboard/search"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Search Trains</span>
              </Link>

              <Link
                href="/dashboard/bookings"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                <span>My Bookings</span>
              </Link>

              {user.role === "admin" && (
                <Link
                  href="/dashboard/add-train"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Add Train</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>

              <div className="flex items-center space-x-2 text-gray-300">
                <span className="text-sm">Welcome,</span>
                <span className="font-medium">{user.username}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

