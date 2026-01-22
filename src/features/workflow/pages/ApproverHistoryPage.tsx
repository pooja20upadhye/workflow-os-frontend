// src/features/workflow/pages/ApproverHistoryPage.tsx
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { workflowService } from '@/features/workflow/services/workflowService'
import { Workflow } from '@/features/workflow/types/workflowTypes'
import { useAuth } from '@/features/auth/context/auth-context'

export default function ApproverHistoryPage() {
  const { user } = useAuth()
  const [history, setHistory] = useState<Workflow[]>([])

  useEffect(() => {
    if (user?.role === 'approver' && user?.id) {
      const past = workflowService.getWorkflowsByApprover(user.id)
      setHistory(past)
    }
  }, [user])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Approval History</h1>
        <p className="text-muted-foreground mt-1">
          View your past approvals and rejections
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Past Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action Date</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((wf) => (
                <TableRow key={wf.id}>
                  <TableCell className="font-medium">{wf.title}</TableCell>
                  <TableCell>{wf.requesterName}</TableCell>
                  <TableCell>{wf.category}</TableCell>
                  <TableCell>
                    <Badge variant={wf.priority === 'critical' ? 'destructive' : 'secondary'}>
                      {wf.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={wf.status === 'approved' ? 'secondary' : 'destructive'}>
                      {wf.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{wf.updatedAt}</TableCell>
                  <TableCell>{wf.actions?.[wf.actions.length - 1]?.comment || 'No comment'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}