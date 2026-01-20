// src/features/workflow/components/requester/RequesterWorkflowTable.tsx
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/shared/icons'
import { Workflow } from '@/features/workflow/types/workflowTypes'

interface RequesterWorkflowTableProps {
  workflows: Workflow[]
  onEdit: (workflow: Workflow) => void
  onDelete: (workflow: Workflow) => void
  onSubmit: (id: string) => void
}

export const RequesterWorkflowTable = ({
  workflows,
  onEdit,
  onDelete,
  onSubmit,
}: RequesterWorkflowTableProps) => {
  const getStatusColor = (status: Workflow['status']) => {
    const colors: Record<Workflow['status'], string> = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: Workflow['priority']) => {
    const colors: Record<Workflow['priority'], string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    }
    return colors[priority] || 'bg-yellow-100 text-yellow-800'
  }

  if (workflows.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <Icons.fileText className="mx-auto h-12 w-12 opacity-40 mb-4" />
        <p className="text-lg font-medium">No requests found</p>
        <p className="mt-2 text-sm">Create your first workflow request to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">Title</th>
            <th className="text-left p-4 font-medium">Category</th>
            <th className="text-left p-4 font-medium">Priority</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Created</th>
            <th className="text-left p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((workflow) => (
            <tr key={workflow.id} className="border-b hover:bg-muted/40 transition-colors">
              <td className="p-4 font-medium">{workflow.title}</td>
              <td className="p-4">{workflow.category}</td>
              <td className="p-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(workflow.priority)}`}>
                  {workflow.priority}
                </span>
              </td>
              <td className="p-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                  {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                </span>
              </td>
              <td className="p-4 text-muted-foreground">{workflow.createdAt}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {workflow.status === 'draft' && (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onEdit(workflow)}
                        title="Edit request"
                      >
                        <Icons.edit className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onSubmit(workflow.id)}
                        title="Submit for approval"
                      >
                        <Icons.upload className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete(workflow)}
                        title="Delete request"
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {(workflow.status === 'submitted' || workflow.status === 'pending') && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Icons.clock className="h-4 w-4" />
                      <span className="text-sm">Pending Approval</span>
                    </div>
                  )}

                  {workflow.status === 'approved' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Icons.checkCircle className="h-4 w-4" />
                      <span className="text-sm">Approved</span>
                    </div>
                  )}

                  {workflow.status === 'rejected' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <Icons.xCircle className="h-4 w-4" />
                      <span className="text-sm">Rejected</span>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}