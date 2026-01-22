// src/features/workflow/pages/RequesterHistoryPage.tsx
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { workflowService } from '@/features/workflow/services/workflowService'
import { Workflow } from '@/features/workflow/types/workflowTypes'
import { useAuth } from '@/features/auth/context/auth-context'
import { RequesterWorkflowTable } from '@/features/workflow/components/requester/RequesterWorkflowTable'

export default function RequesterHistoryPage() {
  const { user } = useAuth()
  const [history, setHistory] = useState<Workflow[]>([])

  useEffect(() => {
    if (!user?.id) return
    const myWorkflows = workflowService.getWorkflowsByRequester(user.id)
    const past = myWorkflows.filter(w =>
      w.status === 'approved' || w.status === 'rejected' || w.status === 'completed'
    )
    setHistory(past)
  }, [user?.id])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Request History</h1>
        <p className="text-muted-foreground mt-1">
          View previously submitted, approved, rejected, and completed requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <RequesterWorkflowTable
            workflows={history}
            onEdit={() => {}}     
            onDelete={() => {}}   
            onSubmit={() => {}}   
          />
        </CardContent>
      </Card>
    </div>
  )
}