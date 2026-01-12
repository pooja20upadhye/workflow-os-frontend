import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectContent 
} from '@/components/ui/select'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { authService } from '../services/authService'
import { RegisterPayload } from '../types/authTypes'
import { Icons } from '@/components/shared/icons'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'requester',
  })
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleRegister = async () => {
    if (form.password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Just register, don't auto-login
      await authService.register(form)
      
      // Show success message and redirect to login
      alert('Registration successful! Please login with your credentials.')
      navigate('/login')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-background flex min-h-screen flex-col p-4">
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-card border-border w-full max-w-5xl overflow-hidden rounded-2xl border shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Register Form */}
            <div className="p-8 lg:p-12">
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="space-y-3 px-0 text-left">
                  <CardTitle className="text-card-foreground text-3xl font-bold">
                    Create Account
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    Join WorkflowOS and start managing your workflows efficiently.
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-8 px-0">
                  <div className="space-y-6">
                    {/* Full Name Field */}
                    <div className="space-y-2">
                      <Label className="text-card-foreground text-sm font-semibold">
                        Full Name*
                      </Label>
                      <Input
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="bg-background border-input focus:border-primary focus:ring-primary h-12 rounded-lg"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label className="text-card-foreground text-sm font-semibold">
                        Email Address*
                      </Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="bg-background border-input focus:border-primary focus:ring-primary h-12 rounded-lg"
                      />
                    </div>

                    {/* Mobile Number Field */}
                    <div className="space-y-2">
                      <Label className="text-card-foreground text-sm font-semibold">
                        Mobile Number*
                      </Label>
                      <Input
                        name="mobile"
                        placeholder="Enter your mobile number"
                        value={form.mobile}
                        onChange={handleChange}
                        required
                        className="bg-background border-input focus:border-primary focus:ring-primary h-12 rounded-lg"
                      />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label className="text-card-foreground text-sm font-semibold">
                        Password*
                      </Label>
                      <div className="relative">
                        <Input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          className="bg-background border-input focus:border-primary focus:ring-primary h-12 rounded-lg pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
                        >
                          {showPassword ? (
                            <Icons.eyeOff size={16} />
                          ) : (
                            <Icons.eye size={16} />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label className="text-card-foreground text-sm font-semibold">
                        Confirm Password*
                      </Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="bg-background border-input focus:border-primary focus:ring-primary h-12 rounded-lg pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <Icons.eyeOff size={16} />
                          ) : (
                            <Icons.eye size={16} />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                      <Label className="text-card-foreground text-sm font-semibold">
                        Select Role*
                      </Label>
                      <Select
                        value={form.role}
                        onValueChange={(value) =>
                          setForm({ ...form, role: value as RegisterPayload['role'] })
                        }
                      >
                        <SelectTrigger className="h-12 rounded-lg">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="requester">Requester</SelectItem>
                          <SelectItem value="approver">Approver</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="rounded-md bg-red-50 p-3">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Register Button */}
                    <Button
                      size="lg"
                      className="w-full text-base font-semibold"
                      onClick={handleRegister}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Creating Account...
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </Button>

                    {/* Login Link */}
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">
                        Already have an account?{' '}
                        <Button
                          variant="link"
                          className="text-primary p-0 text-sm font-medium hover:underline"
                          onClick={() => navigate('/login')}
                        >
                          Sign In
                        </Button>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Benefits Section */}
            <div className="bg-muted/50 flex items-center justify-center p-8 lg:p-12">
              <div className="max-w-sm space-y-6 text-center">
                {/* Icon Placeholder */}
                <div className="mx-auto mb-4 flex h-56 w-56 items-center justify-center rounded-lg bg-primary/10">
                  <Icons.user size={80} className="text-primary" />
                </div>

                <h3 className="text-card-foreground text-2xl font-bold">
                  Join WorkflowOS Today
                </h3>

                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-green-100 p-1">
                      <Icons.checkCircle size={16} className="text-green-600" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      <span className="font-medium text-card-foreground">Requester:</span> Submit and track your workflow requests
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-blue-100 p-1">
                      <Icons.checkCircle size={16} className="text-blue-600" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      <span className="font-medium text-card-foreground">Approver:</span> Review and approve requests efficiently
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-purple-100 p-1">
                      <Icons.checkCircle size={16} className="text-purple-600" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      <span className="font-medium text-card-foreground">Admin:</span> Manage users and system configuration
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  Choose your role and start optimizing your workflow management process.
                  Each role comes with tailored features and permissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-auto py-4 text-center">
        <p className="text-muted-foreground text-sm">© 2025 WorkflowOS</p>
      </div>
    </div>
  )
}