import Image from "next/image"
import Link from "next/link"
import LOGO from "@/public/logo.svg"

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={LOGO} alt="roboclasses-logo" height={100} width={150}/>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-cyan-600 transition-colors">
              Home
            </Link>
            <Link href="#" className="text-gray-600 hover:text-cyan-600 transition-colors">
              Templates
            </Link>
            <Link href="#" className="text-gray-600 hover:text-cyan-600 transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
