import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { User, Save } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { PageHeader } from '../components/common'

export default function Profile() {
  const { user } = useSelector(s=>s.auth)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState:{errors} } = useForm({
    defaultValues: { name:user?.name||'', phone:user?.phone||'', street:user?.address?.street||'', city:user?.address?.city||'', state:user?.address?.state||'', pincode:user?.address?.pincode||'' }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.put('/auth/profile', { name:data.name, phone:data.phone, address:{street:data.street,city:data.city,state:data.state,pincode:data.pincode} })
      toast.success('Profile updated!')
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed.') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <PageHeader title="My Profile" breadcrumb="Home / Profile"/>
      <div className="page-container py-10">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center"><User className="w-8 h-8 text-primary-600"/></div>
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">{user?.name}</h2>
                <p className="text-slate-500 text-sm">{user?.email}</p>
                <span className={`badge mt-1 ${user?.role==='admin'?'badge-primary':'badge-grey'}`}>{user?.role}</span>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input {...register('name',{required:'Required'})} className="input-field"/>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div><label className="label">Phone</label><input {...register('phone')} className="input-field" placeholder="+91 98765 43210"/></div>
              </div>
              <div>
                <label className="label">Email (read-only)</label>
                <input value={user?.email} readOnly className="input-field bg-slate-100 text-slate-400 cursor-not-allowed"/>
              </div>
              <hr className="border-slate-100"/>
              <h3 className="font-semibold text-slate-700">Default Shipping Address</h3>
              <div><label className="label">Street</label><input {...register('street')} className="input-field" placeholder="123 MG Road"/></div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className="label">City</label><input {...register('city')} className="input-field" placeholder="Bangalore"/></div>
                <div><label className="label">State</label><input {...register('state')} className="input-field" placeholder="Karnataka"/></div>
                <div><label className="label">PIN Code</label><input {...register('pincode')} className="input-field" placeholder="560001"/></div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading?'Saving...':<><Save className="w-4 h-4"/>Save Changes</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
