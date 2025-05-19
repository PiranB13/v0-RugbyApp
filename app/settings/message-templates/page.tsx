"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MessageTemplate, TemplateVariable } from "@/types/message-template"
import { templateService } from "@/services/template-service"
import { FileText, Plus, Trash, Edit, Copy, RefreshCw, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function MessageTemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [activeCategory, setActiveCategory] = useState<MessageTemplate["category"]>("recruitment")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<MessageTemplate | null>(null)
  const [formData, setFormData] = useState<Partial<MessageTemplate>>({
    title: "",
    category: "recruitment",
    content: "",
    tags: [],
    variables: [],
  })
  const [newVariable, setNewVariable] = useState<Partial<TemplateVariable>>({
    key: "",
    label: "",
    description: "",
    required: false,
  })
  const [newTag, setNewTag] = useState("")
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    const allTemplates = templateService.getTemplates()
    setTemplates(allTemplates)
  }

  const handleCreateTemplate = () => {
    // Validate form
    if (!formData.title || !formData.content) return

    const newTemplate = templateService.createTemplate({
      title: formData.title!,
      category: formData.category as MessageTemplate["category"],
      content: formData.content!,
      tags: formData.tags || [],
      variables: formData.variables || [],
      createdBy: "current-user-id", // In a real app, this would be the current user's ID
    })

    setTemplates([...templates, newTemplate])
    resetForm()
    setIsCreateDialogOpen(false)
  }

  const handleUpdateTemplate = () => {
    if (!currentTemplate || !formData.title || !formData.content) return

    const updatedTemplate = templateService.updateTemplate(currentTemplate.id, {
      title: formData.title,
      category: formData.category as MessageTemplate["category"],
      content: formData.content,
      tags: formData.tags,
      variables: formData.variables,
    })

    if (updatedTemplate) {
      setTemplates(templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)))
    }

    resetForm()
    setIsEditDialogOpen(false)
    setCurrentTemplate(null)
  }

  const handleDeleteTemplate = () => {
    if (!currentTemplate) return

    const success = templateService.deleteTemplate(currentTemplate.id)

    if (success) {
      setTemplates(templates.filter((t) => t.id !== currentTemplate.id))
    }

    setIsDeleteDialogOpen(false)
    setCurrentTemplate(null)
  }

  const handleDuplicateTemplate = (template: MessageTemplate) => {
    const newTemplate = templateService.createTemplate({
      ...template,
      title: `${template.title} (Copy)`,
      isDefault: false,
      createdBy: "current-user-id", // In a real app, this would be the current user's ID
    })

    setTemplates([...templates, newTemplate])
  }

  const handleEditClick = (template: MessageTemplate) => {
    setCurrentTemplate(template)
    setFormData({
      title: template.title,
      category: template.category,
      content: template.content,
      tags: [...template.tags],
      variables: [...template.variables],
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (template: MessageTemplate) => {
    setCurrentTemplate(template)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      category: "recruitment",
      content: "",
      tags: [],
      variables: [],
    })
    setNewVariable({
      key: "",
      label: "",
      description: "",
      required: false,
    })
    setNewTag("")
  }

  const addVariable = () => {
    if (!newVariable.key || !newVariable.label) return

    setFormData({
      ...formData,
      variables: [
        ...(formData.variables || []),
        {
          key: newVariable.key,
          label: newVariable.label,
          description: newVariable.description,
          required: newVariable.required,
        } as TemplateVariable,
      ],
    })

    setNewVariable({
      key: "",
      label: "",
      description: "",
      required: false,
    })
  }

  const removeVariable = (index: number) => {
    const newVariables = [...(formData.variables || [])]
    newVariables.splice(index, 1)
    setFormData({ ...formData, variables: newVariables })
  }

  const addTag = () => {
    if (!newTag.trim()) return

    setFormData({
      ...formData,
      tags: [...(formData.tags || []), newTag.trim()],
    })

    setNewTag("")
  }

  const removeTag = (index: number) => {
    const newTags = [...(formData.tags || [])]
    newTags.splice(index, 1)
    setFormData({ ...formData, tags: newTags })
  }

  const handleResetToDefaults = () => {
    templateService.resetToDefaults()
    loadTemplates()
    setResetConfirmOpen(false)
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Message Templates</h1>
          <p className="text-muted-foreground">Create and manage templates for common messages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setResetConfirmOpen(true)} className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Template
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="recruitment"
        onValueChange={(value) => setActiveCategory(value as MessageTemplate["category"])}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="administrative">Administrative</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates
              .filter((template) => template.category === activeCategory)
              .map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        {template.title}
                      </CardTitle>
                      {template.isDefault && <Badge variant="outline">Default</Badge>}
                    </div>
                    <CardDescription className="line-clamp-2">{template.content.substring(0, 100)}...</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Variables: {template.variables.length}</p>
                      <p className="mt-1">Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => handleDuplicateTemplate(template)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </Button>
                    <div className="flex gap-2">
                      {!template.isDefault && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(template)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(template)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>

          {templates.filter((template) => template.category === activeCategory).length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No templates found</h3>
              <p className="mb-4 text-center text-muted-foreground">
                You don't have any {activeCategory} templates yet.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Template
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>Create a reusable message template with customizable variables.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as MessageTemplate["category"] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recruitment">Recruitment</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">
                Content
              </Label>
              <Textarea
                id="content"
                value={formData.content || ""}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="col-span-3 min-h-[200px]"
                placeholder="Write your template content here. Use {{variableName}} for variables."
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Variables</Label>
              <div className="col-span-3 space-y-4">
                {(formData.variables || []).length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-2 border-b p-2 text-xs font-medium text-muted-foreground">
                      <div className="col-span-3">Key</div>
                      <div className="col-span-3">Label</div>
                      <div className="col-span-4">Description</div>
                      <div className="col-span-1">Required</div>
                      <div className="col-span-1"></div>
                    </div>
                    {(formData.variables || []).map((variable, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 border-b p-2 text-sm last:border-0">
                        <div className="col-span-3 flex items-center">{variable.key}</div>
                        <div className="col-span-3 flex items-center">{variable.label}</div>
                        <div className="col-span-4 flex items-center">{variable.description || "-"}</div>
                        <div className="col-span-1 flex items-center justify-center">
                          {variable.required ? "✓" : "-"}
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeVariable(index)}>
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                    No variables added yet
                  </div>
                )}

                <div className="grid grid-cols-12 gap-2">
                  <Input
                    className="col-span-3"
                    placeholder="Key"
                    value={newVariable.key || ""}
                    onChange={(e) => setNewVariable({ ...newVariable, key: e.target.value })}
                  />
                  <Input
                    className="col-span-3"
                    placeholder="Label"
                    value={newVariable.label || ""}
                    onChange={(e) => setNewVariable({ ...newVariable, label: e.target.value })}
                  />
                  <Input
                    className="col-span-4"
                    placeholder="Description (optional)"
                    value={newVariable.description || ""}
                    onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                  />
                  <div className="col-span-1 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={newVariable.required || false}
                      onChange={(e) => setNewVariable({ ...newVariable, required: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <Button
                    className="col-span-1"
                    variant="outline"
                    size="icon"
                    onClick={addVariable}
                    disabled={!newVariable.key || !newVariable.label}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Tags</Label>
              <div className="col-span-3 space-y-4">
                {(formData.tags || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(formData.tags || []).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-4 w-4 p-0"
                          onClick={() => removeTag(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                    No tags added yet
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button variant="outline" onClick={addTag} disabled={!newTag.trim()}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} disabled={!formData.title || !formData.content}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Update your message template.</DialogDescription>
          </DialogHeader>

          {/* Same form fields as Create Dialog */}
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
              />
            </div>

            {/* Category */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as MessageTemplate["category"] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recruitment">Recruitment</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-content" className="text-right pt-2">
                Content
              </Label>
              <Textarea
                id="edit-content"
                value={formData.content || ""}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="col-span-3 min-h-[200px]"
                placeholder="Write your template content here. Use {{variableName}} for variables."
              />
            </div>

            {/* Variables */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Variables</Label>
              <div className="col-span-3 space-y-4">
                {(formData.variables || []).length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-2 border-b p-2 text-xs font-medium text-muted-foreground">
                      <div className="col-span-3">Key</div>
                      <div className="col-span-3">Label</div>
                      <div className="col-span-4">Description</div>
                      <div className="col-span-1">Required</div>
                      <div className="col-span-1"></div>
                    </div>
                    {(formData.variables || []).map((variable, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 border-b p-2 text-sm last:border-0">
                        <div className="col-span-3 flex items-center">{variable.key}</div>
                        <div className="col-span-3 flex items-center">{variable.label}</div>
                        <div className="col-span-4 flex items-center">{variable.description || "-"}</div>
                        <div className="col-span-1 flex items-center justify-center">
                          {variable.required ? "✓" : "-"}
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeVariable(index)}>
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                    No variables added yet
                  </div>
                )}

                <div className="grid grid-cols-12 gap-2">
                  <Input
                    className="col-span-3"
                    placeholder="Key"
                    value={newVariable.key || ""}
                    onChange={(e) => setNewVariable({ ...newVariable, key: e.target.value })}
                  />
                  <Input
                    className="col-span-3"
                    placeholder="Label"
                    value={newVariable.label || ""}
                    onChange={(e) => setNewVariable({ ...newVariable, label: e.target.value })}
                  />
                  <Input
                    className="col-span-4"
                    placeholder="Description (optional)"
                    value={newVariable.description || ""}
                    onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                  />
                  <div className="col-span-1 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={newVariable.required || false}
                      onChange={(e) => setNewVariable({ ...newVariable, required: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <Button
                    className="col-span-1"
                    variant="outline"
                    size="icon"
                    onClick={addVariable}
                    disabled={!newVariable.key || !newVariable.label}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Tags</Label>
              <div className="col-span-3 space-y-4">
                {(formData.tags || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(formData.tags || []).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-1 h-4 w-4 p-0"
                          onClick={() => removeTag(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                    No tags added yet
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button variant="outline" onClick={addTag} disabled={!newTag.trim()}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTemplate} disabled={!formData.title || !formData.content}>
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {currentTemplate && (
            <div className="py-4">
              <Alert>
                <AlertTitle>{currentTemplate.title}</AlertTitle>
                <AlertDescription className="line-clamp-2">
                  {currentTemplate.content.substring(0, 100)}...
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset to Default Templates</DialogTitle>
            <DialogDescription>
              This will reset all default templates to their original state. Your custom templates will not be affected.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleResetToDefaults}>
              Reset Defaults
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
