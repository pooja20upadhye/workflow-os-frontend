// src/features/dashboard/components/ApproverDashboard.tsx
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/shared/icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { workflowService } from '@/features/workflow/services/workflowService'
import { Workflow } from '@/features/workflow/types/workflowTypes'
import { useAuth } from '@/features/auth/context/auth-context'

export const ApproverDashboard = () => {
  const { user } = useAuth()
  const [pendingApprovals, setPendingApprovals] = useState<Workflow[]>([])
  const [approvedToday, setApprovedToday] = useState(0)
  const [rejectedToday, setRejectedToday] = useState(0)

  useEffect(() => {
    if (user?.role !== 'approver') return

    const pending = workflowService.getPendingApprovals()
    setPendingApprovals(pending)

    const history = workflowService.getWorkflowsByApprover(user.id)
    const today = new Date().toISOString().split('T')[0]
    setApprovedToday(history.filter(w => w.status === 'approved' && w.updatedAt === today).length)
    setRejectedToday(history.filter(w => w.status === 'rejected' && w.updatedAt === today).length)
  }, [user])

  const handleApprove = (id: string) => {
    workflowService.approveWorkflow(id, user?.id || '', user?.name || 'Approver')
  }

  const handleRejectOpen = (approval: Workflow) => {
    // Implement reject logic here, e.g. open dialog
    console.log('Reject', approval)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Approver Dashboard</h2>
        <Button variant="outline" className="gap-2">
          <Icons.filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Icons.clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting your review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{approvedToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
            <Icons.xCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{rejectedToday}</div>
            <p className="text-xs text-muted-foreground">Rejected requests today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{approval.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Requested by {approval.requesterName} on {approval.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={approval.priority === 'high' ? 'destructive' : 'secondary'}>
                    {approval.priority}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleApprove(approval.id)}>
                      <Icons.checkCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-600" onClick={() => handleRejectOpen(approval)}>
                      <Icons.xCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}