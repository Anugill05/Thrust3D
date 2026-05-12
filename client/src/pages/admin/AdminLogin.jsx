import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../../store/authSlice'
import { useForm } from 'react-hook-form'
import { Printer, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const dispatch = useDispatch(); const navigate = useNavigate()
  const { loading, error, isAuthenticated, user } = useSelector(s => s.auth)
  const [show, setShow] = useState(false)
  const { register, handleSubmit, formState:{errors} } = useForm()

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') navigate('/admin')
    return () => dispatch(clearError())
  }, [isAuthenticated, user])

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser({ ...data, isAdmin: true }))
    if (loginUser.fulfilled.match(result)) {
      if (result.payload.user.role !== 'admin') { toast.error('Not an admin account.'); return }
      toast.success('Welcome, Admin!'); navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center"><Printer className="w-7 h-7 text-white"/></div>
            <span className="font-display font-bold text-2xl text-white">Thrust<span className="text-primary-400">3D</span></span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-primary-400"/>
            <h1 className="text-xl font-display font-bold text-white">Admin Portal</h1>
          </div>
          <p className="text-slate-400 text-sm">Restricted access — authorized personnel only</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          {error && <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-xl text-sm text-red-400">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Admin Email</label>
              <input {...register('email',{required:'Email required'})} type="email"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-500"
                placeholder="admin@thrust3d.com"/>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input {...register('password',{required:'Password required'})} type={show?'text':'password'}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-slate-500 pr-10"
                  placeholder="Admin password"/>
                <button type="button" onClick={()=>setShow(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Signing in...</> : <><ShieldCheck className="w-4 h-4"/>Access Dashboard</>}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">
            <a href="/" className="hover:text-slate-300 transition-colors">← Back to website</a>
          </p>
        </div>
      </div>
    </div>
  )
}
