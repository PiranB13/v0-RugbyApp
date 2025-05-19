export interface TemplateVariable {
  key: string
  label: string
  description?: string
  defaultValue?: string
  required?: boolean
}

export interface MessageTemplate {
  id: string
  title: string
  category: "recruitment" | "training" | "administrative" | "general"
  content: string
  variables: TemplateVariable[]
  tags: string[]
  createdBy?: string
  isDefault?: boolean
  createdAt: string
  updatedAt?: string
}
