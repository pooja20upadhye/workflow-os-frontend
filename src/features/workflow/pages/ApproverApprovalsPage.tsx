// src/features/workflow/pages/ApproverApprovalsPage.tsx
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { workflowService } from '@/features/workflow/services/workflowService'
import { Workflow } from '@/features/workflow/types/workflowTypes'
import { useAuth } from '@/features/auth/context/auth-context'

export default function ApproverApprovalsPage() {
  const { user } = useAuth()
  const [pending, setPending] = useState<Workflow[]>([])
  const [selected, setSelected] = useState<Workflow | null>(null)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (user?.role === 'approver') {
      setPending(workflowService.getPendingApprovals())
    }
  }, [user])

  const handleApprove = (id: string) => {
    workflowService.approveWorkflow(id, user?.id || '', user?.name || 'Approver')
    toast.success('Request approved')
    setPending(workflowService.getPendingApprovals())
  }

  const handleReject = () => {
    if (!comment.trim()) return toast.error('Comment required for rejection')
    workflowService.rejectWorkflow(selected?.id || '', user?.id || '', user?.name || 'Approver', comment)
    toast.success('Request rejected')
    setIsRejectOpen(false)
    setComment('')
    setSelected(null)
    setPending(workflowService.getPendingApprovals())
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
        <p className="text-muted-foreground mt-1">
          Review and act on submitted requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((wf) => (
                <TableRow key={wf.id}>
                  <TableCell className="font-medium">{wf.title}</TableCell>
                  <TableCell>{wf.requesterName}</TableCell>
                  <TableCell>{wf.category}</TableCell>
                  <TableCell>
                    <Badge variant={wf.priority === 'critical' ? 'destructive' : 'secondary'}>
                      {wf.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{wf.createdAt}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" onClick={() => handleApprove(wf.id)}>
                      Approve
                    </Button>
                    <Button variant="destructive" onClick={() => {
                      setSelected(wf)
                      setIsRejectOpen(true)
                    }}>
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to reject "{selected?.title}" from {selected?.requesterName}?</p>
            <div>
              <Label htmlFor="comment">Rejection Reason (required)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain why you're rejecting this request..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}