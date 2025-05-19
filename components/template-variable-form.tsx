"use client"

import { useState, useEffect } from "react"
import type { MessageTemplate } from "@/types/message-template"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { templateService } from "@/services/template-service"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TemplateVariableFormProps {
  template: MessageTemplate
  onComplete: (processedContent: string, variables: Record<string, string>) => void
  onCancel: () => void
  initialValues?: Record<string, string>
}

export function TemplateVariableForm({
  template,
  onComplete,
  onCancel,
  initialValues = {},
}: TemplateVariableFormProps) {
  const [variables, setVariables] = useState<Record<string, string>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Initialize with default values from template
    const defaultValues: Record<string, string> = {}
    template.variables.forEach((variable) => {
      if (variable.defaultValue) {
        defaultValues[variable.key] = variable.defaultValue
      }
    })

    setVariables({ ...defaultValues, ...initialValues })
  }, [template, initialValues])

  const handleChange = (key: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [key]: value,
    }))

    // Clear error for this field if it exists
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  const handleSubmit = () => {
    // Validate required fields
    const newErrors: Record<string, string> = {}
    template.variables.forEach((variable) => {
      if (variable.required && (!variables[variable.key] || variables[variable.key].trim() === "")) {
        newErrors[variable.key] = "This field is required"
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Process the template
    const processedContent = templateService.processTemplate(template.id, variables)
    if (processedContent) {
      onComplete(processedContent, variables)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{template.title}</h3>
        <p className="text-sm text-muted-foreground">Fill in the variables to complete your message</p>
      </div>

      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please fill in all required fields</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {template.variables.map((variable) => (
          <div key={variable.key} className="space-y-2">
            <Label htmlFor={variable.key} className="flex items-center">
              {variable.label}
              {variable.required && <span className="ml-1 text-red-500">*</span>}
            </Label>
            <Input
              id={variable.key}
              value={variables[variable.key] || ""}
              onChange={(e) => handleChange(variable.key, e.target.value)}
              placeholder={variable.description}
              className={errors[variable.key] ? "border-red-500" : ""}
            />
            {errors[variable.key] && <p className="text-xs text-red-500">{errors[variable.key]}</p>}
            {variable.description && !errors[variable.key] && (
              <p className="text-xs text-muted-foreground">{variable.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Use Template</Button>
      </div>
    </div>
  )
}
