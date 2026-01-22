// src/features/workflow/types/workflowTypes.ts
export type WorkflowStatus = 'draft' | 'submitted' | 'pending' | 'approved' | 'rejected' | 'completed'
export type WorkflowPriority = 'low' | 'medium' | 'high' | 'critical'

export interface WorkflowAction {
  action: 'submitted' | 'approved' | 'rejected'
  actorId: string
  actorName: string
  timestamp: string
  comment?: string
}

export interface Workflow {
  id: string
  title: string
  description: string
  category: string
  status: WorkflowStatus
  priority: WorkflowPriority
  requesterId: string
  requesterName: string
  approverId?: string
  approverName?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  actions?: WorkflowAction[]  // Added for history
}

export interface CreateWorkflowRequest {
  title: string
  description: string
  category: string
  priority: WorkflowPriority
  dueDate?: string
}

export interface UpdateWorkflowRequest {
  title?: string
  description?: string
  category?: string
  priority?: WorkflowPriority
  status?: WorkflowStatus
  dueDate?: string
}