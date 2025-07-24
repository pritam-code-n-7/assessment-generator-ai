import { BookOpen } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-800">Demo</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              Templates
            </Link>
            <Link href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
