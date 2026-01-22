// src/features/workflow/services/workflowService.ts
import { Workflow, CreateWorkflowRequest, UpdateWorkflowRequest, WorkflowStatus, WorkflowAction } from '../types/workflowTypes';
import { getInitialWorkflows } from '../components/requester/mock/mockData';

// Load workflows once (from localStorage or mock)
let workflows: Workflow[] = getInitialWorkflows();

// Save current state to localStorage
const saveWorkflows = () => {
  localStorage.setItem('workflows', JSON.stringify(workflows));
};

export const workflowService = {
  // Read operations
  getAllWorkflows(): Workflow[] {
    return workflows;
  },

  getWorkflowById(id: string): Workflow | undefined {
    return workflows.find((w) => w.id === id);
  },

  getWorkflowsByRequester(requesterId: string): Workflow[] {
    return workflows.filter((w) => w.requesterId === requesterId);
  },

  getWorkflowsByApprover(approverId: string): Workflow[] {
    return workflows.filter((w) => w.approverId === approverId);
  },

  getPendingApprovals(): Workflow[] {
    return workflows.filter((w) => w.status === 'pending' || w.status === 'submitted');
  },

  // Write operations
  createWorkflow(
    data: CreateWorkflowRequest,
    requesterId: string,
    requesterName: string
  ): Workflow {
    const newWorkflow: Workflow = {
      id: crypto.randomUUID(),
      ...data,
      status: 'draft',
      requesterId,
      requesterName,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      actions: [] // Initialized
    };

    workflows.push(newWorkflow);
    saveWorkflows();
    return newWorkflow;
  },

  updateWorkflow(id: string, data: UpdateWorkflowRequest): Workflow | undefined {
    const index = workflows.findIndex((w) => w.id === id);
    if (index === -1) return undefined;

    workflows[index] = {
      ...workflows[index],
      ...data,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    saveWorkflows();
    return workflows[index];
  },

  deleteWorkflow(id: string): boolean {
    const initialLength = workflows.length
    workflows = workflows.filter(w => w.id !== id)
    saveWorkflows()
    return workflows.length < initialLength
  },

  submitWorkflow(id: string): Workflow | undefined {
    return workflowService.updateWorkflow(id, { status: 'submitted' })
  },

  approveWorkflow(id: string, approverId: string, approverName: string): Workflow | undefined {
    const workflow = workflows.find(w => w.id === id)
    if (!workflow) return undefined

    workflow.status = 'approved'
    workflow.approverId = approverId
    workflow.approverName = approverName
    workflow.updatedAt = new Date().toISOString().split('T')[0]
    workflow.actions = workflow.actions || []
    workflow.actions.push({
      action: 'approved',
      actorId: approverId,
      actorName: approverName,
      timestamp: new Date().toISOString(),
    })
    
    saveWorkflows()
    return workflow
  },

  rejectWorkflow(id: string, approverId: string, approverName: string, comment?: string): Workflow | undefined {
    const workflow = workflows.find(w => w.id === id)
    if (!workflow) return undefined

    workflow.status = 'rejected'
    workflow.approverId = approverId
    workflow.approverName = approverName
    workflow.updatedAt = new Date().toISOString().split('T')[0]
    workflow.actions = workflow.actions || []
    workflow.actions.push({
      action: 'rejected',
      actorId: approverId,
      actorName: approverName,
      timestamp: new Date().toISOString(),
      comment: comment || 'No comment provided'
    })
    
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