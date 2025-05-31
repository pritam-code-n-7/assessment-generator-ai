"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { AssessmentResult } from "@/components/assessment-result"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  ageGroup: z.string({
    required_error: "Please select an age group.",
  }),
  difficultyLevel: z.number().min(1).max(5),
  numberOfQuestions: z.string().transform((val) => Number.parseInt(val, 10)),
  additionalInstructions: z.string().optional(),
  useAI: z.boolean().default(true),
})

export function AssessmentForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [assessment, setAssessment] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isAiGenerated, setIsAiGenerated] = useState(false)
  const [apiQuotaWarning, setApiQuotaWarning] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      difficultyLevel: 3,
      numberOfQuestions: "10",
      additionalInstructions: "",
      useAI: true,
    },
  })

  // Get the current value of useAI from the form
  const useAI = form.watch("useAI")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    setError(null)
    setNotice(null)
    setIsAiGenerated(false)

    try {
      const response = await fetch("/api/generate-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate assessment")
      }

      setAssessment(data.assessment)

      if (data.notice) {
        setNotice(data.notice)
      }

      if (data.aiGenerated) {
        setIsAiGenerated(true)
      }
    } catch (error) {
      console.error("Error generating assessment:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {!assessment ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {apiQuotaWarning && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700 flex justify-between items-center">
                  <span>
                    AI generation may fail due to API quota limitations. The app will automatically fall back to offline
                    mode if needed.
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-amber-700 border-amber-300 hover:bg-amber-100"
                    onClick={() => setApiQuotaWarning(false)}
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="useAI"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Use AI Generation</FormLabel>
                        <FormDescription>
                          {field.value
                            ? "AI mode will create more customized assessments"
                            : "Offline mode uses pre-defined templates"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Math, Science, Reading" {...field} />
                    </FormControl>
                    <FormDescription>The main subject of the assessment</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ageGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3-5">Preschool (3-5 years)</SelectItem>
                        <SelectItem value="6-8">Early Elementary (6-8 years)</SelectItem>
                        <SelectItem value="9-11">Late Elementary (9-11 years)</SelectItem>
                        <SelectItem value="12-14">Middle School (12-14 years)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Target age range for the assessment</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="difficultyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Very Easy</span>
                    <span>Easy</span>
                    <span>Medium</span>
                    <span>Hard</span>
                    <span>Very Hard</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of questions" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="5">5 questions</SelectItem>
                      <SelectItem value="10">10 questions</SelectItem>
                      <SelectItem value="15">15 questions</SelectItem>
                      <SelectItem value="20">20 questions</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific topics, formats, or requirements..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide any additional details to customize the assessment</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Assessment...
                </>
              ) : (
                "Generate Assessment"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <AssessmentResult
          assessment={assessment}
          onReset={() => setAssessment(null)}
          notice={notice}
          isAiGenerated={isAiGenerated}
        />
      )}
    </div>
  )
}
