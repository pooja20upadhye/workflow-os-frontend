import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/shared/icons'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')

  // Load remembered credentials
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    const rememberedPassword = localStorage.getItem('rememberedPassword')
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }))
    }
    if (rememberedPassword) {
      setFormData(prev => ({
        ...prev,
        password: rememberedPassword
      }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      // Handle remember me
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email)
        localStorage.setItem('rememberedPassword', formData.password)
      } else {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberedPassword')
      }

      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="bg-background flex min-h-screen flex-col p-4">
      <div className="flex flex-1 items-center justify-center">
        {/* Combined Container with Shadow */}
        <div className="bg-card border-border w-full max-w-5xl overflow-hidden rounded-2xl border shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Login Form */}
            <div className="p-8 lg:p-12">
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="space-y-3 px-0 text-left">
                  <CardTitle className="text-card-foreground text-3xl font-bold">
                    Sign In
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    Welcome back! Log in with your credentials.
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-8 px-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label className="text-card-foreground text-sm font-semibold">
                        Email address*
                      </Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
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
                          value={formData.password}
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

                    {/* Remember Me and Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                        />
                        <Label
                          htmlFor="rememberMe"
                          className="text-card-foreground cursor-pointer text-sm font-normal"
                        >
                          Remember Me
                        </Label>
                      </div>

                      <Button
                        variant="link"
                        className="text-primary hover:text-primary/80 h-auto p-0 text-sm font-medium hover:underline"
                        onClick={() => navigate('/forgot-password')}
                      >
                        Forgot Password?
                      </Button>
                    </div>

                    {error && (
                      <div className="rounded-md bg-red-50 p-3">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-base font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Signing in...
                        </div>
                      ) : (
                        'Sign in to WorkflowOS'
                      )}
                    </Button>

                    {/* Register Link */}
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">
                        Don't have an account?{' '}
                        <Button
                          variant="link"
                          className="text-primary p-0 text-sm font-medium hover:underline"
                          onClick={() => navigate('/register')}
                        >
                          Register
                        </Button>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - MFA Section */}
            <div className="bg-muted/50 flex items-center justify-center p-8 lg:p-12">
              <div className="max-w-sm space-y-6 text-center">
                {/* Icon Placeholder */}
                <div className="mx-auto mb-4 flex h-56 w-56 items-center justify-center rounded-lg bg-primary/10">
                  <Icons.fileText size={80} className="text-primary" />
                </div>

                <h3 className="text-card-foreground text-2xl font-bold">
                  Multi-Role Workflow Management
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  Experience role-based dashboards for Requesters, Approvers, and Admins.
                  <br />
                  Streamline your approval processes with intelligent workflow automation.
                  <br />
                  Track requests and manage approvals seamlessly.
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