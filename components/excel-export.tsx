"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet } from "lucide-react"

interface ExcelExportProps {
  assessment: string
}

export function ExcelExport({ assessment }: ExcelExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExcelDownload = async () => {
    setIsExporting(true)

    try {
      // Dynamically import xlsx to avoid SSR issues
      const XLSX = await import("xlsx")

      // Parse assessment content to extract questions and answers
      const assessmentData = parseAssessment(assessment)

      // Create workbook with two sheets: Questions and Answer Key
      const wb = XLSX.utils.book_new()

      // Create Questions worksheet
      const questionsData = [
        ["Question Number", "Question", "Student Answer"],
        ...assessmentData.questions.map((q, i) => [i + 1, q, ""]),
      ]
      const questionsWs = XLSX.utils.aoa_to_sheet(questionsData)
      XLSX.utils.book_append_sheet(wb, questionsWs, "Questions")

      // Create Answer Key worksheet
      const answersData = [["Question Number", "Answer"], ...assessmentData.answers.map((a, i) => [i + 1, a])]
      const answersWs = XLSX.utils.aoa_to_sheet(answersData)
      XLSX.utils.book_append_sheet(wb, answersWs, "Answer Key")

      // Generate Excel file and download it using browser APIs
      // Convert the workbook to a binary string
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" })

      // Convert binary string to ArrayBuffer
      function s2ab(s: string) {
        const buf = new ArrayBuffer(s.length)
        const view = new Uint8Array(buf)
        for (let i = 0; i < s.length; i++) {
          view[i] = s.charCodeAt(i) & 0xff
        }
        return buf
      }

      // Create Blob and download
      const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "kid-assessment.xlsx"
      document.body.appendChild(a)
      a.click()

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 0)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Failed to export to Excel. Please try downloading as text instead.")
    } finally {
      setIsExporting(false)
    }
  }

  // Parse assessment text to extract questions and answers
  const parseAssessment = (text: string) => {
    const questions: string[] = []
    const answers: string[] = []

    try {
      // Split by sections
      const sections = text.split(/^#+\s+/m)

      // Find questions section
      const questionsSection = sections.find((s) => s.toLowerCase().includes("questions"))
      if (questionsSection) {
        // Extract numbered questions
        const questionMatches = questionsSection.match(/\d+\.\s+.+?(?=\n\d+\.|$)/gs)
        if (questionMatches) {
          questions.push(...questionMatches.map((q) => q.replace(/^\d+\.\s+/, "")))
        }
      }

      // Find answer key section
      const answerSection = sections.find((s) => s.toLowerCase().includes("answer key"))
      if (answerSection) {
        // Extract numbered answers
        const answerMatches = answerSection.match(/\d+\.\s+.+?(?=\n\d+\.|$)/gs)
        if (answerMatches) {
          answers.push(...answerMatches.map((a) => a.replace(/^\d+\.\s+/, "")))
        }
      }

      // If we couldn't extract questions or answers, use fallback approach
      if (questions.length === 0) {
        const lines = text.split("\n")
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          if (/^\d+\./.test(line) && !line.toLowerCase().includes("answer")) {
            questions.push(line.replace(/^\d+\.\s+/, ""))
          }
        }
      }

      // Ensure we have the same number of answers as questions
      while (answers.length < questions.length) {
        answers.push("Answer not provided")
      }
    } catch (error) {
      console.error("Error parsing assessment:", error)
      // Provide fallback data
      return {
        questions: ["Error parsing questions"],
        answers: ["Error parsing answers"],
      }
    }

    return { questions, answers }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExcelDownload} disabled={isExporting}>
      <FileSpreadsheet className="h-4 w-4 mr-2" />
      {isExporting ? "Exporting..." : "Excel"}
    </Button>
  )
}
