// src/features/dashboard/components/RequesterDashboard.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/shared/icons'
import { workflowService } from '@/features/workflow/services/workflowService'
import { Workflow } from '@/features/workflow/types/workflowTypes'
import { useAuth } from '@/features/auth/context/auth-context'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieLabelRenderProps,
} from 'recharts'
import { toast } from 'sonner'

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#a855f7', '#6b7280']

export const RequesterDashboard = () => {
  const { user } = useAuth()
  const [recentWorkflows, setRecentWorkflows] = useState<Workflow[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    draft: 0,
    submitted: 0,
  })
  const [statusData, setStatusData] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [timeData, setTimeData] = useState<Array<{ month: string; count: number }>>([])
  const [priorityData, setPriorityData] = useState<Array<{ name: string; value: number }>>([])

  useEffect(() => {
    if (user?.id) loadData()
  }, [user?.id])

  const loadData = () => {
    if (!user) return

    const all = workflowService.getWorkflowsByRequester(user.id)
    const sorted = [...all].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    setRecentWorkflows(sorted.slice(0, 5))

    const statistics = workflowService.getStatistics(user.id)
    setStats({
      total: statistics.total,
      pending: statistics.pending,
      approved: statistics.approved,
      rejected: statistics.rejected,
      draft: statistics.draft,
      submitted: statistics.submitted,
    })

    // Status pie data
    const pieData = [
      { name: 'Approved', value: statistics.approved, color: '#22c55e' },
      { name: 'Pending', value: statistics.pending, color: '#eab308' },
      { name: 'Rejected', value: statistics.rejected, color: '#ef4444' },
      { name: 'Draft', value: statistics.draft, color: '#6b7280' },
      { name: 'Submitted', value: statistics.submitted, color: '#3b82f6' },
    ].filter(item => item.value > 0)

    setStatusData(pieData)

    // Requests over time (monthly grouping)
    const monthly = all.reduce((acc: Record<string, number>, wf) => {
      const date = new Date(wf.createdAt)
      const month = date.toLocaleString('default', { month: 'short', year: '2-digit' })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})
    setTimeData(Object.entries(monthly).map(([month, count]) => ({ month, count })))

    // Priority breakdown
    const prioCount = all.reduce((acc: Record<string, number>, wf) => {
      acc[wf.priority] = (acc[wf.priority] || 0) + 1
      return acc
    }, {})
    setPriorityData([
      { name: 'Low', value: prioCount.low || 0 },
      { name: 'Medium', value: prioCount.medium || 0 },
      { name: 'High', value: prioCount.high || 0 },
      { name: 'Critical', value: prioCount.critical || 0 },
    ])
  }

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return map[status] || 'bg-gray-100 text-gray-800'
  }

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { name, percent, value } = props
    const percentValue = percent ? (percent * 100).toFixed(0) : '0'
    return `${name}: ${value} (${percentValue}%)`
  }

  // Fixed tooltip formatter – name is optional (Recharts may pass undefined)
  const tooltipFormatter = (value: any, name?: string) => {
    return [`${value} requests`, name ?? 'Value']
  }

  return (
    <div className="space-y-8">
      {/* Header + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Requester Dashboard</h1>
         
        </div>
       
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Status Pie + Time Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {stats.total > 0 && statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={true}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={tooltipFormatter} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No requests data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Requests Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Requests Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {timeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={tooltipFormatter} />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No requests data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Priority Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Requests by Priority</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {priorityData.some(p => p.value > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={tooltipFormatter} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No priority data available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/requests">View All →</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentWorkflows.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <Icons.inbox className="mx-auto h-10 w-10 opacity-40 mb-3" />
              <p className="font-medium">No recent activity</p>
              <p className="text-sm mt-1">Your recent workflow requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentWorkflows.map((wf) => (
                <div
                  key={wf.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{wf.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {wf.category} • {wf.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(wf.status)}`}>
                      {wf.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}