import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/shared/icons'
import { workflowService } from '@/features/workflow/services/workflowService'
import { Workflow, CreateWorkflowRequest, UpdateWorkflowRequest } from '@/features/workflow/types/workflowTypes'
import { useAuth } from '@/features/auth/context/auth-context'
import { RequesterAddModal } from '@/features/workflow/components/requester/RequesterAddModal'
import { RequesterEditModal } from '@/features/workflow/components/requester/RequesterEditModal'
import { RequesterDeleteModal } from '@/features/workflow/components/requester/RequesterDeleteModal'
import { toast } from 'sonner'

export const RequesterDashboard = () => {
  const { user } = useAuth()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [statistics, setStatistics] = useState({ total: 0, draft: 0, submitted: 0, pending: 0, approved: 0, rejected: 0, completed: 0 })
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  // Selected workflow for edit/delete
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)

  useEffect(() => {
    if (user) {
      loadWorkflows()
    }
  }, [user])

  const loadWorkflows = () => {
    if (!user) return
    
    const userWorkflows = workflowService.getWorkflowsByRequester(user.id)
    setWorkflows(userWorkflows)
    setStatistics(workflowService.getStatistics(user.id))
  }

  const handleCreateWorkflow = (data: CreateWorkflowRequest) => {
    if (!user) return

    try {
      workflowService.createWorkflow(data, user.id, user.name)
      toast.success('Workflow created successfully!')
      loadWorkflows()
    } catch (error) {
      toast.error('Failed to create workflow')
    }
  }

  const handleUpdateWorkflow = (data: UpdateWorkflowRequest) => {
    if (!selectedWorkflow) return

    try {
      workflowService.updateWorkflow(selectedWorkflow.id, data)
      toast.success('Workflow updated successfully!')
      loadWorkflows()
    } catch (error) {
      toast.error('Failed to update workflow')
    }
  }

  const handleDeleteWorkflow = () => {
    if (!selectedWorkflow) return

    try {
      workflowService.deleteWorkflow(selectedWorkflow.id)
      toast.success('Workflow deleted successfully!')
      loadWorkflows()
    } catch (error) {
      toast.error('Failed to delete workflow')
    }
  }

  const handleSubmitWorkflow = (id: string) => {
    try {
      workflowService.submitWorkflow(id)
      toast.success('Workflow submitted for approval!')
      loadWorkflows()
    } catch (error) {
      toast.error('Failed to submit workflow')
    }
  }

  const openEditModal = (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
    setIsDeleteModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800'
    }
    return colors[status] || colors.draft
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[priority] || colors.medium
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Requester Dashboard</h2>
        <Button 
          className="gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Icons.plus size={16} />
          New Workflow Request
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Icons.fileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Icons.clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{statistics.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{statistics.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <Icons.xCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{statistics.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Workflow Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Priority</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Created</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map((workflow) => (
                  <tr key={workflow.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{workflow.title}</td>
                    <td className="p-3">{workflow.category}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(workflow.priority)}`}>
                        {workflow.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
                        {workflow.status}
                      </span>
                    </td>
                    <td className="p-3">{workflow.createdAt}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {workflow.status === 'draft' && (
                          <>
                            {/* Edit Button - Light Grey Icon */}
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => openEditModal(workflow)}
                              className="h-8 w-8 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-700"
                              title="Edit"
                            >
                              <Icons.edit size={14} />
                            </Button>
                            
                            {/* Submit Button - Light Blue Icon */}
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleSubmitWorkflow(workflow.id)}
                              className="h-8 w-8 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              title="Submit for Approval"
                            >
                              <Icons.check size={14} />
                            </Button>
                            
                            {/* Delete Button - Light Red Icon */}
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => openDeleteModal(workflow)}
                              className="h-8 w-8 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                              title="Delete"
                            >
                              <Icons.trash size={14} />
                            </Button>
                          </>
                        )}
                        
                        {(workflow.status === 'submitted' || workflow.status === 'pending') && (
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex items-center justify-center rounded border border-yellow-300 bg-yellow-50 text-yellow-600">
                              <Icons.clock size={14} />
                            </div>
                            <span className="ml-2 text-sm text-yellow-600">Pending</span>
                          </div>
                        )}
                        
                        {workflow.status === 'approved' && (
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex items-center justify-center rounded border border-green-300 bg-green-50 text-green-600">
                              <Icons.checkCircle size={14} />
                            </div>
                            <span className="ml-2 text-sm text-green-600">Approved</span>
                          </div>
                        )}
                        
                        {workflow.status === 'rejected' && (
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex items-center justify-center rounded border border-red-300 bg-red-50 text-red-600">
                              <Icons.xCircle size={14} />
                            </div>
                            <span className="ml-2 text-sm text-red-600">Rejected</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <RequesterAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateWorkflow}
      />

      <RequesterEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedWorkflow(null)
        }}
        onSubmit={handleUpdateWorkflow}
        workflow={selectedWorkflow}
      />

      <RequesterDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedWorkflow(null)
        }}
        onConfirm={handleDeleteWorkflow}
        workflow={selectedWorkflow}
      />
    </div>
  )
}