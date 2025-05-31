"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface CSVExportProps {
  assessment: string
}

export function CSVExport({ assessment }: CSVExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleCSVDownload = () => {
    setIsExporting(true)

    try {
      // Parse assessment content to extract questions and answers
      const assessmentData = parseAssessment(assessment)

      // Create CSV content for questions
      let csvContent = "Question Number,Question,Student Answer\n"
      assessmentData.questions.forEach((question, index) => {
        // Escape quotes in the question text
        const escapedQuestion = question.replace(/"/g, '""')
        csvContent += `${index + 1},"${escapedQuestion}",\n`
      })

      // Add a separator
      csvContent += "\n\nANSWER KEY\n"
      csvContent += "Question Number,Answer\n"

      // Add answers
      assessmentData.answers.forEach((answer, index) => {
        // Escape quotes in the answer text
        const escapedAnswer = answer.replace(/"/g, '""')
        csvContent += `${index + 1},"${escapedAnswer}"\n`
      })

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "kid-assessment.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting to CSV:", error)
      alert("Failed to export to CSV. Please try downloading as text instead.")
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
    <Button variant="outline" size="sm" onClick={handleCSVDownload} disabled={isExporting}>
      <FileText className="h-4 w-4 mr-2" />
      {isExporting ? "Exporting..." : "CSV"}
    </Button>
  )
}
