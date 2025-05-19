"use client"

import { useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Predefined security questions
const PREDEFINED_QUESTIONS = [
  "What was the name of your first pet?",
  "In what city were you born?",
  "What is your mother's maiden name?",
  "What high school did you attend?",
  "What was the make of your first car?",
  "What was your childhood nickname?",
  "What is the name of your favorite childhood teacher?",
  "What is your favorite movie?",
  "What was the first concert you attended?",
  "What was the name of the street you grew up on?",
]

interface SecurityQuestion {
  id: string
  question: string
  customQuestion?: string
  answer: string
}

export function SecurityQuestions() {
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<SecurityQuestion[]>([
    { id: "1", question: "predefined", customQuestion: "", answer: "" },
    { id: "2", question: "predefined", customQuestion: "", answer: "" },
    { id: "3", question: "predefined", customQuestion: "", answer: "" },
  ])
  const [isEditing, setIsEditing] = useState(true)
  const [savedQuestions, setSavedQuestions] = useState<SecurityQuestion[]>([])

  const handleQuestionTypeChange = (id: string, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              question: value,
              customQuestion: value === "custom" ? q.customQuestion : "",
            }
          : q,
      ),
    )
  }

  const handlePredefinedQuestionChange = (id: string, value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, customQuestion: value } : q)))
  }

  const handleCustomQuestionChange = (id: string, value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, customQuestion: value } : q)))
  }

  const handleAnswerChange = (id: string, value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, answer: value } : q)))
  }

  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, { id: `${Date.now()}`, question: "predefined", customQuestion: "", answer: "" }])
    } else {
      toast({
        title: "Maximum questions reached",
        description: "You can only have up to 5 security questions.",
        variant: "destructive",
      })
    }
  }

  const removeQuestion = (id: string) => {
    if (questions.length > 3) {
      setQuestions(questions.filter((q) => q.id !== id))
    } else {
      toast({
        title: "Minimum questions required",
        description: "You must have at least 3 security questions.",
        variant: "destructive",
      })
    }
  }

  const validateQuestions = () => {
    // Check for duplicate questions
    const selectedQuestions = questions.map((q) => (q.question === "custom" ? q.customQuestion : q.customQuestion))
    const uniqueQuestions = new Set(selectedQuestions)

    if (uniqueQuestions.size !== questions.length) {
      toast({
        title: "Duplicate questions",
        description: "Please ensure all security questions are unique.",
        variant: "destructive",
      })
      return false
    }

    // Check for empty answers or questions
    for (const q of questions) {
      if (!q.answer.trim()) {
        toast({
          title: "Empty answers",
          description: "Please provide an answer for each security question.",
          variant: "destructive",
        })
        return false
      }

      if (q.question === "predefined" && !q.customQuestion) {
        toast({
          title: "Question not selected",
          description: "Please select a question for each entry.",
          variant: "destructive",
        })
        return false
      }

      if (q.question === "custom" && !q.customQuestion?.trim()) {
        toast({
          title: "Empty custom question",
          description: "Please provide a question for each custom entry.",
          variant: "destructive",
        })
        return false
      }

      // Check answer length
      if (q.answer.trim().length < 3) {
        toast({
          title: "Answer too short",
          description: "Security question answers must be at least 3 characters long.",
          variant: "destructive",
        })
        return false
      }
    }

    return true
  }

  const handleSave = async () => {
    if (!validateQuestions()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Save the questions
      setSavedQuestions([...questions])
      setIsEditing(false)

      toast({
        title: "Security questions saved",
        description: "Your security questions have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save security questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Security Questions</h3>
        <p className="text-sm text-muted-foreground">
          Set up security questions to help recover your account if you forget your password
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Recovery Questions</CardTitle>
          <CardDescription>
            Choose questions that have answers only you would know. Avoid questions with answers that can be easily
            found online.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              Security questions provide an additional way to verify your identity if you need to recover your account.
              We recommend setting up at least 3 questions.
            </AlertDescription>
          </Alert>

          {questions.map((question, index) => (
            <div key={question.id} className="space-y-4 pb-4 border-b">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Question {index + 1}</h4>
                {questions.length > 3 && isEditing && (
                  <Button variant="ghost" size="icon" onClick={() => removeQuestion(question.id)} disabled={isLoading}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove question</span>
                  </Button>
                )}
              </div>

              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={`question-type-${question.id}`}>Question Type</Label>
                    <Select
                      value={question.question}
                      onValueChange={(value) => handleQuestionTypeChange(question.id, value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger id={`question-type-${question.id}`}>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="predefined">Choose from list</SelectItem>
                        <SelectItem value="custom">Create your own</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {question.question === "predefined" ? (
                    <div className="space-y-2">
                      <Label htmlFor={`predefined-question-${question.id}`}>Select a Question</Label>
                      <Select
                        value={question.customQuestion}
                        onValueChange={(value) => handlePredefinedQuestionChange(question.id, value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger id={`predefined-question-${question.id}`}>
                          <SelectValue placeholder="Select a security question" />
                        </SelectTrigger>
                        <SelectContent>
                          {PREDEFINED_QUESTIONS.map((q) => (
                            <SelectItem key={q} value={q}>
                              {q}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor={`custom-question-${question.id}`}>Your Question</Label>
                      <Input
                        id={`custom-question-${question.id}`}
                        value={question.customQuestion}
                        onChange={(e) => handleCustomQuestionChange(question.id, e.target.value)}
                        placeholder="Enter your security question"
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor={`answer-${question.id}`}>Your Answer</Label>
                    <Input
                      id={`answer-${question.id}`}
                      value={question.answer}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Enter your answer"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Answers are case-sensitive. Remember exactly how you type it.
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">
                    {question.question === "custom" ? question.customQuestion : question.customQuestion}
                  </p>
                  <p className="text-sm text-muted-foreground">Answer: ••••••••</p>
                </div>
              )}
            </div>
          ))}

          {isEditing && questions.length < 5 && (
            <Button variant="outline" className="w-full" onClick={addQuestion} disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              Add Another Question
            </Button>
          )}
        </CardContent>
        <CardFooter>
          {isEditing ? (
            <Button onClick={handleSave} disabled={isLoading} className="bg-[#1e4620] hover:bg-[#2a5f2d] text-white">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Security Questions
            </Button>
          ) : (
            <Button onClick={handleEdit} variant="outline">
              Edit Security Questions
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
