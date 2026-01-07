import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const LoginPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back to WorkflowOS
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" />
        </div>

        <div>
          <Label>Password</Label>
          <Input type="password" placeholder="••••••••" />
        </div>

        <Button className="w-full">Login</Button>
      </div>
    </div>
  )
}
