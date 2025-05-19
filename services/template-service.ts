import type { MessageTemplate } from "@/types/message-template"
import { v4 as uuidv4 } from "uuid"

// Default templates that come with the system
const defaultTemplates: MessageTemplate[] = [
  {
    id: "template-1",
    title: "Initial Interest",
    category: "recruitment",
    content: `Hi {{playerName}},

We noticed your profile on RugbyConnect and were impressed by your {{playerStrength}} and experience as a {{playerPosition}}.

{{clubName}} is currently looking for talented players to join our {{teamLevel}} squad for the upcoming season.

Would you be interested in learning more about opportunities with our club?

Best regards,
{{recruiterName}}
{{clubName}}`,
    variables: [
      { key: "playerName", label: "Player Name", required: true },
      { key: "playerStrength", label: "Player Strength", description: "e.g., speed, tackling ability, leadership" },
      { key: "playerPosition", label: "Player Position" },
      { key: "clubName", label: "Club Name", required: true },
      { key: "teamLevel", label: "Team Level", description: "e.g., U18, Senior, First XV" },
      { key: "recruiterName", label: "Recruiter Name", required: true },
    ],
    tags: ["introduction", "first contact", "recruitment"],
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "template-2",
    title: "Training Invitation",
    category: "recruitment",
    content: `Hi {{playerName}},

Following our previous conversation, we'd like to invite you to attend a training session with {{clubName}} on {{trainingDate}} at {{trainingTime}}.

Location: {{trainingLocation}}

Please bring your training kit and boots. This will be a great opportunity for you to meet the coaches and other players, and for us to see how you might fit into our squad.

Please let me know if you can attend or if you have any questions.

Looking forward to meeting you,
{{recruiterName}}
{{clubName}}`,
    variables: [
      { key: "playerName", label: "Player Name", required: true },
      { key: "clubName", label: "Club Name", required: true },
      { key: "trainingDate", label: "Training Date", required: true },
      { key: "trainingTime", label: "Training Time", required: true },
      { key: "trainingLocation", label: "Training Location", required: true },
      { key: "recruiterName", label: "Recruiter Name", required: true },
    ],
    tags: ["training", "invitation", "recruitment"],
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "template-3",
    title: "Follow-up After Training",
    category: "recruitment",
    content: `Hi {{playerName}},

Thank you for attending the training session with {{clubName}} on {{trainingDate}}.

The coaching team was impressed with your {{playerSkill}} and how you integrated with the team.

We would like to discuss the next steps with you. Are you available for a call on {{proposedDate}} at {{proposedTime}}?

Best regards,
{{recruiterName}}
{{clubName}}`,
    variables: [
      { key: "playerName", label: "Player Name", required: true },
      { key: "clubName", label: "Club Name", required: true },
      { key: "trainingDate", label: "Training Date", required: true },
      {
        key: "playerSkill",
        label: "Player Skill",
        description: "e.g., passing accuracy, fitness level, game awareness",
      },
      { key: "proposedDate", label: "Proposed Date", required: true },
      { key: "proposedTime", label: "Proposed Time", required: true },
      { key: "recruiterName", label: "Recruiter Name", required: true },
    ],
    tags: ["follow-up", "feedback", "recruitment"],
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "template-4",
    title: "Formal Offer",
    category: "recruitment",
    content: `Dear {{playerName}},

On behalf of {{clubName}}, I am pleased to formally offer you a position in our {{teamLevel}} squad for the {{seasonYear}} season.

Based on your performance and our discussions, we believe you would be a valuable addition to our team as a {{playerPosition}}.

Key details:
- Season starts: {{seasonStartDate}}
- Training schedule: {{trainingSchedule}}
- Club membership fee: {{membershipFee}}
- Additional benefits: {{benefits}}

Please let us know if you would like to accept this offer by {{responseDeadline}}.

We look forward to welcoming you to the {{clubName}} family.

Yours in rugby,
{{recruiterName}}
{{recruiterPosition}}
{{clubName}}`,
    variables: [
      { key: "playerName", label: "Player Name", required: true },
      { key: "clubName", label: "Club Name", required: true },
      { key: "teamLevel", label: "Team Level", description: "e.g., U18, Senior, First XV", required: true },
      { key: "seasonYear", label: "Season Year", required: true },
      { key: "playerPosition", label: "Player Position", required: true },
      { key: "seasonStartDate", label: "Season Start Date", required: true },
      { key: "trainingSchedule", label: "Training Schedule", required: true },
      { key: "membershipFee", label: "Membership Fee", required: true },
      { key: "benefits", label: "Benefits", description: "e.g., gym access, physio services" },
      { key: "responseDeadline", label: "Response Deadline", required: true },
      { key: "recruiterName", label: "Recruiter Name", required: true },
      { key: "recruiterPosition", label: "Recruiter Position", required: true },
    ],
    tags: ["offer", "formal", "recruitment"],
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "template-5",
    title: "Rejection - With Feedback",
    category: "recruitment",
    content: `Dear {{playerName}},

Thank you for your interest in joining {{clubName}} and for taking the time to attend our training sessions.

After careful consideration, we regret to inform you that we are unable to offer you a position in our {{teamLevel}} squad at this time.

The coaching team was impressed with your {{playerStrength}}, but felt that {{feedbackReason}}.

We encourage you to continue developing your skills, and we would be happy to reconsider your application in the future.

Best wishes for your rugby career,
{{recruiterName}}
{{clubName}}`,
    variables: [
      { key: "playerName", label: "Player Name", required: true },
      { key: "clubName", label: "Club Name", required: true },
      { key: "teamLevel", label: "Team Level", description: "e.g., U18, Senior, First XV", required: true },
      { key: "playerStrength", label: "Player Strength", required: true },
      {
        key: "feedbackReason",
        label: "Feedback Reason",
        description: "Constructive feedback on areas for improvement",
        required: true,
      },
      { key: "recruiterName", label: "Recruiter Name", required: true },
    ],
    tags: ["rejection", "feedback", "recruitment"],
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
]

// In a real app, this would be stored in a database
let templates: MessageTemplate[] = [...defaultTemplates]

export const templateService = {
  getTemplates: () => {
    return [...templates]
  },

  getTemplatesByCategory: (category: MessageTemplate["category"]) => {
    return templates.filter((template) => template.category === category)
  },

  getTemplateById: (id: string) => {
    return templates.find((template) => template.id === id)
  },

  createTemplate: (template: Omit<MessageTemplate, "id" | "createdAt">) => {
    const newTemplate: MessageTemplate = {
      ...template,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }

    templates.push(newTemplate)
    return newTemplate
  },

  updateTemplate: (id: string, updates: Partial<Omit<MessageTemplate, "id" | "createdAt">>) => {
    const index = templates.findIndex((template) => template.id === id)
    if (index === -1) return null

    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return templates[index]
  },

  deleteTemplate: (id: string) => {
    const index = templates.findIndex((template) => template.id === id)
    if (index === -1) return false

    // Don't allow deletion of default templates
    if (templates[index].isDefault) return false

    templates.splice(index, 1)
    return true
  },

  resetToDefaults: () => {
    // Keep user templates, but reset default ones
    const userTemplates = templates.filter((template) => !template.isDefault)
    templates = [...defaultTemplates, ...userTemplates]
    return templates
  },

  // Process a template by replacing variables with actual values
  processTemplate: (templateId: string, variables: Record<string, string>) => {
    const template = templateService.getTemplateById(templateId)
    if (!template) return null

    let content = template.content

    // Replace all variables in the content
    template.variables.forEach((variable) => {
      const value = variables[variable.key] || variable.defaultValue || ""
      const regex = new RegExp(`{{${variable.key}}}`, "g")
      content = content.replace(regex, value)
    })

    return content
  },
}
