import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'
import { authService } from '../services/authService'
import { RegisterPayload } from '../types/authTypes'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
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

    try {
      await authService.register(form)
      navigate('/')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>

      <Input placeholder="Full Name"
        onChange={e => setForm({ ...form, name: e.target.value })} />

      <Input placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })} />

      <Input placeholder="Mobile Number"
        onChange={e => setForm({ ...form, mobile: e.target.value })} />

      <Input type="password" placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })} />

      <Input type="password" placeholder="Confirm Password"
        onChange={e => setConfirmPassword(e.target.value)} />

      <Select
        value={form.role}
        onValueChange={value =>
          setForm({ ...form, role: value as RegisterPayload['role'] })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="requester">Requester</SelectItem>
          <SelectItem value="approver">Approver</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button className="w-full" onClick={handleRegister}>
        Register
      </Button>
    </div>
  )
}
