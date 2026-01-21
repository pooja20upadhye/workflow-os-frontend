// src/features/workflow/mock/mockData.ts
import { Workflow } from '@/features/workflow/types/workflowTypes'

// Hardcoded initial data — used only when localStorage is empty or missing
export const initialMockWorkflows: Workflow[] = [
  {
    id: 'wf-001',
    title: 'Software License Request',
    description: 'Request for Adobe Creative Cloud license for design team',
    category: 'Software',
    status: 'approved',
    priority: 'high',
    requesterId: '1',
    requesterName: 'Pooja Prasad Upadhye',
    approverId: 'appr-001',
    approverName: 'HR Manager',
    createdAt: '2025-12-10',
    updatedAt: '2025-12-15',
    dueDate: '2025-12-30'
  },
  {
    id: 'wf-002',
    title: 'New Ergonomic Chair',
    description: 'Split ergonomic chair and keyboard to reduce wrist strain',
    category: 'Hardware',
    status: 'rejected',
    priority: 'medium',
    requesterId: '1',
    requesterName: 'Pooja Prasad Upadhye',
    approverId: 'appr-001',
    approverName: 'HR Manager',
    createdAt: '2026-01-05',
    updatedAt: '2026-01-10'
  },
  {
    id: 'wf-003',
    title: 'React Advanced Training Subscription',
    description: 'Frontend Masters annual subscription for upskilling',
    category: 'Training',
    status: 'draft',
    priority: 'low',
    requesterId: '1',
    requesterName: 'Pooja Prasad Upadhye',
    createdAt: '2026-01-18',
    updatedAt: '2026-01-18'
  },
];

// Helper function to get initial data (used in service)
export const getInitialWorkflows = (): Workflow[] => {
  const saved = localStorage.getItem('workflows');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Basic validation — if not array, fallback
      if (Array.isArray(parsed)) return parsed;
    } catch (err) {
      console.warn('Invalid workflows in localStorage → using initial mock data');
    }
  }
  // First time or corrupted → return copy of mock
  return [...initialMockWorkflows];
};