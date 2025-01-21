"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Clock, MapPin } from "lucide-react"

export default function SearchTrains() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    source: "",
    destination: "",
    date: "",
  })
  const [trains, setTrains] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const queryParams = new URLSearchParams({
        source: searchData.source,
        destination: searchData.destination,
        date: searchData.date,
      })

      const res = await fetch(`http://localhost:5000/api/trains/search?${queryParams}`)
      const data = await res.json()

      if (res.ok) {
        setTrains(data)
      } else {
        setError(data.message || "Failed to search trains")
        setTrains([])  // Clear the train results
      }
    } catch (err) {
      setError("Network error. Please try again.")
      setTrains([])  // Clear the train results
    } finally {
      setLoading(false)
    }
  }

  const handleBook = (trainId: number) => {
    router.push(`/dashboard/book/${trainId}`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Search Trains</h1>

      <div className="bg-gray-800 rounded-lg p-6">
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 rounded p-3 mb-4">{error}</div>}

        <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <input
              type="text"
              value={searchData.source}
              onChange={(e) => setSearchData({ ...searchData, source: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              required
              disabled={loading}
              placeholder="Enter source station"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <input
              type="text"
              value={searchData.destination}
              onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              required
              disabled={loading}
              placeholder="Enter destination station"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={searchData.date}
              onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              required
              disabled={loading}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <button
            type="submit"
            className="md:col-span-3 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            disabled={loading}
          >
            <Search className="h-5 w-5" />
            <span>{loading ? "Searching..." : "Search Trains"}</span>
          </button>
        </form>
      </div>

      {trains.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Trains</h2>

          <div className="grid gap-4">
            {trains.map((train: any) => (
              <div key={train.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{train.train_name}</h3>
                    <p className="text-sm text-gray-400">Train No: {train.train_number}</p>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{train.source}</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{train.destination}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{new Date(train.departure_datetime).toLocaleString()}</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{new Date(train.arrival_datetime).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Available Seats</p>
                      <p className="text-2xl font-bold text-blue-500">{train.available_seats}</p>
                    </div>

                    <button
                      onClick={() => handleBook(train.id)}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                      disabled={train.available_seats === 0}
                    >
                      {train.available_seats === 0 ? "Sold Out" : "Book Now"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
