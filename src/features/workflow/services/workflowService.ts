import { Workflow, CreateWorkflowRequest, UpdateWorkflowRequest, WorkflowStatus } from '../types/workflowTypes'

// Mock data for workflows
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    title: 'Software License Request',
    description: 'Request for Adobe Creative Cloud license',
    category: 'Software',
    status: 'approved',
    priority: 'high',
    requesterId: '1',
    requesterName: 'Demo Requester',
    approverId: '2',
    approverName: 'Demo Approver',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-11',
    dueDate: '2024-01-20'
  },
  {
    id: '2',
    title: 'Hardware Purchase',
    description: 'Need new laptop for development team',
    category: 'Hardware',
    status: 'pending',
    priority: 'medium',
    requesterId: '1',
    requesterName: 'Demo Requester',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
    dueDate: '2024-01-25'
  },
  {
    id: '3',
    title: 'Travel Request',
    description: 'Conference attendance in San Francisco',
    category: 'Travel',
    status: 'rejected',
    priority: 'high',
    requesterId: '4',
    requesterName: 'John Requester',
    approverId: '2',
    approverName: 'Demo Approver',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-09',
    dueDate: '2024-02-01'
  }
]

// Helper to save to localStorage
const saveWorkflows = () => {
  localStorage.setItem('workflows', JSON.stringify(mockWorkflows))
}

// Load from localStorage or use mock data
const savedWorkflows = localStorage.getItem('workflows')
let workflows: Workflow[] = savedWorkflows ? JSON.parse(savedWorkflows) : [...mockWorkflows]

export const workflowService = {
  // CRUD Operations
  getAllWorkflows: (): Workflow[] => {
    return workflows
  },

  getWorkflowById: (id: string): Workflow | undefined => {
    return workflows.find(w => w.id === id)
  },

  getWorkflowsByRequester: (requesterId: string): Workflow[] => {
    return workflows.filter(w => w.requesterId === requesterId)
  },

  getWorkflowsByApprover: (approverId: string): Workflow[] => {
    return workflows.filter(w => w.approverId === approverId)
  },

  getPendingApprovals: (): Workflow[] => {
    return workflows.filter(w => w.status === 'pending' || w.status === 'submitted')
  },

  createWorkflow: (data: CreateWorkflowRequest, requesterId: string, requesterName: string): Workflow => {
    const newWorkflow: Workflow = {
      id: crypto.randomUUID(),
      ...data,
      status: 'draft',
      requesterId,
      requesterName,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    workflows.push(newWorkflow)
    saveWorkflows()
    return newWorkflow
  },

  updateWorkflow: (id: string, data: UpdateWorkflowRequest): Workflow | undefined => {
    const index = workflows.findIndex(w => w.id === id)
    if (index === -1) return undefined

    workflows[index] = {
      ...workflows[index],
      ...data,
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    saveWorkflows()
    return workflows[index]
  },

  deleteWorkflow: (id: string): boolean => {
    const initialLength = workflows.length
    workflows = workflows.filter(w => w.id !== id)
    saveWorkflows()
    return workflows.length < initialLength
  },

  // Workflow Actions
  submitWorkflow: (id: string): Workflow | undefined => {
    return workflowService.updateWorkflow(id, { status: 'submitted' })
  },

  approveWorkflow: (id: string, approverId: string, approverName: string): Workflow | undefined => {
    const workflow = workflows.find(w => w.id === id)
    if (!workflow) return undefined

    workflow.status = 'approved'
    workflow.approverId = approverId
    workflow.approverName = approverName
    workflow.updatedAt = new Date().toISOString().split('T')[0]
    
    saveWorkflows()
    return workflow
  },

  rejectWorkflow: (id: string, approverId: string, approverName: string): Workflow | undefined => {
    const workflow = workflows.find(w => w.id === id)
    if (!workflow) return undefined

    workflow.status = 'rejected'
    workflow.approverId = approverId
    workflow.approverName = approverName
    workflow.updatedAt = new Date().toISOString().split('T')[0]
    
    saveWorkflows()
    return workflow
  },

  // Statistics
  getStatistics: (userId?: string) => {
    let filteredWorkflows = workflows
    if (userId) {
      filteredWorkflows = workflows.filter(w => 
        w.requesterId === userId || w.approverId === userId
      )
    }

    return {
      total: filteredWorkflows.length,
      draft: filteredWorkflows.filter(w => w.status === 'draft').length,
      submitted: filteredWorkflows.filter(w => w.status === 'submitted').length,
      pending: filteredWorkflows.filter(w => w.status === 'pending').length,
      approved: filteredWorkflows.filter(w => w.status === 'approved').length,
      rejected: filteredWorkflows.filter(w => w.status === 'rejected').length,
      completed: filteredWorkflows.filter(w => w.status === 'completed').length
    }
  }
}