"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, BookOpen, PlusCircle } from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/search"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all transform hover:-translate-y-1"
        >
          <Search className="h-8 w-8 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Search Trains</h2>
          <p className="text-gray-400">Search for available trains and check seat availability.</p>
        </Link>

        <Link
          href="/dashboard/bookings"
          className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all transform hover:-translate-y-1"
        >
          <BookOpen className="h-8 w-8 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">My Bookings</h2>
          <p className="text-gray-400">View your booking history and upcoming journeys.</p>
        </Link>

        {user?.role === "admin" && (
          <Link
            href="/dashboard/add-train"
            className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all transform hover:-translate-y-1"
          >
            <PlusCircle className="h-8 w-8 text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Add Train</h2>
            <p className="text-gray-400">Add new trains and manage train schedules.</p>
          </Link>
        )}
      </div>
    </div>
  )
}

