import Link from "next/link"
import { Train } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Train className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold">RailwayGo</span>
          </div>
          <div className="space-x-4">
            <Link href="/auth/login" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center space-y-6 mt-20">
          <h1 className="text-5xl font-bold text-blue-500">Welcome to RailwayGo</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Book train tickets easily and securely. Check seat availability, manage bookings, and travel with
            confidence.
          </p>
          <div className="space-x-4">
            <Link
              href="/auth/register"
              className="inline-block px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/trains/search"
              className="inline-block px-6 py-3 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-lg font-semibold"
            >
              Search Trains
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
            <h2 className="text-xl font-semibold mb-4">Easy Booking</h2>
            <p className="text-gray-400">
              Book your train tickets in just a few clicks. Simple and hassle-free process.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
            <h2 className="text-xl font-semibold mb-4">Real-time Availability</h2>
            <p className="text-gray-400">Check seat availability in real-time and secure your preferred seats.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
            <h2 className="text-xl font-semibold mb-4">Secure Payments</h2>
            <p className="text-gray-400">Safe and secure payment options for your peace of mind.</p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 RailwayGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

