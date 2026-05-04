import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../store/authSlice'
import { useForm } from 'react-hook-form'
import { Printer, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const dispatch = useDispatch(); const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector(s=>s.auth)
  const [show, setShow] = useState(false)
  const { register, handleSubmit, formState:{errors} } = useForm()

  useEffect(() => {
    if (isAuthenticated) navigate('/')
    return () => dispatch(clearError())
  }, [isAuthenticated])

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name.split(' ')[0]}!`)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center"><Printer className="w-6 h-6 text-white"/></div>
            <span className="font-display font-bold text-2xl text-slate-900">Print<span className="text-primary-600">3D</span></span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>
        <div className="card p-8">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input {...register('email',{required:'Email required',pattern:{value:/\S+@\S+\.\S+/,message:'Invalid email'}})} type="email" className="input-field" placeholder="you@example.com"/>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input {...register('password',{required:'Password required'})} type={show?'text':'password'} className="input-field pr-10" placeholder="Your password"/>
                <button type="button" onClick={()=>setShow(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Signing in...</> : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          Are you an admin? <Link to="/admin/login" className="text-primary-600 hover:underline font-medium">Admin Login →</Link>
        </p>
      </div>
    </div>
  )
}
