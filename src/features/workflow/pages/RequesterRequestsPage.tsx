// src/features/workflow/pages/RequesterRequestsPage.tsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/shared/icons'
import { workflowService } from '@/features/workflow/services/workflowService'
import {
  Workflow,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
} from '@/features/workflow/types/workflowTypes'
import { useAuth } from '@/features/auth/context/auth-context'
import { RequesterAddModal } from '@/features/workflow/components/requester/RequesterAddModal'
import { RequesterEditModal } from '@/features/workflow/components/requester/RequesterEditModal'
import { RequesterDeleteModal } from '@/features/workflow/components/requester/RequesterDeleteModal'
import { RequesterWorkflowTable } from '@/features/workflow/components/requester/RequesterWorkflowTable'
import { toast } from 'sonner'

export default function RequesterRequestsPage() {
  const { user } = useAuth()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)

  useEffect(() => {
    if (user?.id) {
      loadWorkflows()
    }
  }, [user?.id])

  const loadWorkflows = () => {
    if (!user) return
    const userWorkflows = workflowService.getWorkflowsByRequester(user.id)
    setWorkflows(userWorkflows)
  }

  const handleCreate = (data: CreateWorkflowRequest) => {
    if (!user) return
    try {
      workflowService.createWorkflow(data, user.id, user.name)
      toast.success('Request created successfully')
      loadWorkflows()
    } catch (err) {
      toast.error('Failed to create request')
    }
  }

  const handleUpdate = (data: UpdateWorkflowRequest) => {
    if (!selectedWorkflow) return
    try {
      workflowService.updateWorkflow(selectedWorkflow.id, data)
      toast.success('Request updated')
      loadWorkflows()
    } catch {
      toast.error('Update failed')
    }
  }

  const handleDelete = () => {
    if (!selectedWorkflow) return
    try {
      workflowService.deleteWorkflow(selectedWorkflow.id)
      toast.success('Request deleted')
      loadWorkflows()
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleSubmit = (id: string) => {
    try {
      workflowService.submitWorkflow(id)
      toast.success('Request submitted for approval')
      loadWorkflows()
    } catch {
      toast.error('Submission failed')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
          <p className="text-muted-foreground mt-1">
            Create, view and manage your workflow requests
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2">
          <Icons.plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Main content card */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <RequesterWorkflowTable
            workflows={workflows}
            onEdit={(wf) => {
              setSelectedWorkflow(wf)
              setIsEditOpen(true)
            }}
            onDelete={(wf) => {
              setSelectedWorkflow(wf)
              setIsDeleteOpen(true)
            }}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <RequesterAddModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreate}
      />

      <RequesterEditModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setSelectedWorkflow(null)
        }}
        onSubmit={handleUpdate}
        workflow={selectedWorkflow}
      />

      <RequesterDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedWorkflow(null)
        }}
        onConfirm={handleDelete}
        workflow={selectedWorkflow}
      />
    </div>
  )
}