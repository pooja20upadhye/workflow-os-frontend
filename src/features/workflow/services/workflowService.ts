// src/features/workflow/services/workflowService.ts
import { Workflow, CreateWorkflowRequest, UpdateWorkflowRequest } from '../types/workflowTypes';
import { getInitialWorkflows } from '../components/requester/mock/mockData';

// Load workflows once (from localStorage or mock)
let workflows: Workflow[] = getInitialWorkflows();

// Save current state to localStorage
const saveWorkflows = () => {
  localStorage.setItem('workflows', JSON.stringify(workflows));
};

export const workflowService = {
  // ────────────────────────────────────────────────
  // Read operations
  // ────────────────────────────────────────────────
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

  // ────────────────────────────────────────────────
  // Write operations (all call saveWorkflows)
  // ────────────────────────────────────────────────
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
    const before = workflows.length;
    workflows = workflows.filter((w) => w.id !== id);
    saveWorkflows();
    return workflows.length < before;
  },

  submitWorkflow(id: string): Workflow | undefined {
    return this.updateWorkflow(id, { status: 'submitted' });
  },

  approveWorkflow(
    id: string,
    approverId: string,
    approverName: string
  ): Workflow | undefined {
    const wf = workflows.find((w) => w.id === id);
    if (!wf) return undefined;

    wf.status = 'approved';
    wf.approverId = approverId;
    wf.approverName = approverName;
    wf.updatedAt = new Date().toISOString().split('T')[0];

    saveWorkflows();
    return wf;
  },

  rejectWorkflow(
    id: string,
    approverId: string,
    approverName: string
  ): Workflow | undefined {
    const wf = workflows.find((w) => w.id === id);
    if (!wf) return undefined;

    wf.status = 'rejected';
    wf.approverId = approverId;
    wf.approverName = approverName;
    wf.updatedAt = new Date().toISOString().split('T')[0];

    saveWorkflows();
    return wf;
  },

  // ────────────────────────────────────────────────
  // Statistics
  // ────────────────────────────────────────────────
  getStatistics(userId?: string) {
    let filtered = workflows;

    if (userId) {
      filtered = workflows.filter(
        (w) => w.requesterId === userId || w.approverId === userId
      );
    }

    return {
      total: filtered.length,
      draft: filtered.filter((w) => w.status === 'draft').length,
      submitted: filtered.filter((w) => w.status === 'submitted').length,
      pending: filtered.filter((w) => w.status === 'pending').length,
      approved: filtered.filter((w) => w.status === 'approved').length,
      rejected: filtered.filter((w) => w.status === 'rejected').length,
      completed: filtered.filter((w) => w.status === 'completed').length,
    };
  },
};