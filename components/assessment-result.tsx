"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Printer, RotateCcw, Info, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CSVExport } from "./csv-export"

interface AssessmentResultProps {
  assessment: string
  onReset: () => void
  notice?: string | null
  isAiGenerated?: boolean
}

export function AssessmentResult({ assessment, onReset, notice, isAiGenerated }: AssessmentResultProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 100)
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([assessment], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "kid-assessment.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Format markdown-style content for better display
  const formatAssessment = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 mt-4">$1</h2>')
      .replace(/\n\n/g, "<br /><br />")
      .replace(/\n/g, "<br />")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-1 gap-2">
          <h2 className="text-2xl font-bold text-gray-800">Generated Assessment</h2>
          {isAiGenerated && (
            <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 w-40 h-10">
              <Sparkles className="h-3 w-3 mr-1 text-cyan-500" />
              AI Generated
            </Badge>
          )}
        </div>
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-2 lg:w-full">
          <CSVExport assessment={assessment} />
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Text
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} disabled={isPrinting}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      {notice && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">{notice}</AlertDescription>
        </Alert>
      )}

      <div className="bg-gray-50 p-6 rounded-md border border-gray-200 print:border-none print:p-0">
        <div className="print-content" dangerouslySetInnerHTML={{ __html: formatAssessment(assessment) }} />
      </div>

      <div className="print:hidden">
        <Button onClick={onReset} className="w-full">
          Create Another Assessment
        </Button>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
