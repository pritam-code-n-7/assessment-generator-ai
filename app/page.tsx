import { AssessmentForm } from "@/components/assessment-form"
import Footer from "@/components/footer"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Kid-Friendly Assessment Generator</h1>
            <p className="text-lg text-gray-600">
              Create customized educational assessments for children in seconds using AI
            </p>
          </div>
          <AssessmentForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}
