import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '../services/authService'

export const LoginPage = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      const user = await authService.login(form)
      localStorage.setItem('authUser', JSON.stringify(user))
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>

      <Input
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <div className="relative">
        <Input
          type={show ? 'text' : 'password'}
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="button"
          className="absolute right-3 top-2.5"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button className="w-full" onClick={handleLogin}>
        Login
      </Button>
    </div>
  )
}
