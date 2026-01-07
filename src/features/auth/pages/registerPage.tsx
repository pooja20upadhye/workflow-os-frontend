import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const RegisterPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Start using WorkflowOS
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input placeholder="John Doe" />
        </div>

        <div>
          <Label>Email</Label>
          <Input type="email" />
        </div>

        <div>
          <Label>Password</Label>
          <Input type="password" />
        </div>

        <Button className="w-full">Register</Button>
      </div>
    </div>
  )
}
