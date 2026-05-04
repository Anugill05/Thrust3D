import { useState, useEffect } from 'react'
import { Search, ToggleLeft, ToggleRight } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Spinner } from '../../components/common'

export default function AdminUsers() {
  const [users,    setUsers]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [toggling, setToggling] = useState(null)

  useEffect(() => {
    api.get('/admin/users?limit=100')
      .then(({ data }) => setUsers(data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const toggleUser = async (id) => {
    setToggling(id)
    try {
      const { data } = await api.put('/admin/users/' + id + '/toggle')
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: data.user.isActive } : u))
      toast.success(data.message)
    } catch { toast.error('Update failed') }
    finally { setToggling(null) }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-display font-bold text-slate-900">Users</h1><p className="text-slate-500 text-sm">{users.length} registered users</p></div>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" style={{width:17,height:17}}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email..." className="input-field pl-10"/>
      </div>
      {loading ? <Spinner size="lg" className="py-16"/> : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>User</th><th>Phone</th><th>Joined</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">{u.name[0]}</div>
                      <div><div className="font-semibold text-slate-800 text-sm">{u.name}</div><div className="text-xs text-slate-400">{u.email}</div></div>
                    </div>
                  </td>
                  <td className="text-sm text-slate-500">{u.phone || '—'}</td>
                  <td className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="text-xs text-slate-500">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN') : 'Never'}</td>
                  <td><span className={`badge ${u.isActive?'badge-success':'badge-danger'}`}>{u.isActive?'Active':'Inactive'}</span></td>
                  <td>
                    <button onClick={()=>toggleUser(u._id)} disabled={toggling===u._id}
                      className={`btn-ghost p-2 ${u.isActive?'text-red-500 hover:bg-red-50':'text-emerald-500 hover:bg-emerald-50'}`}>
                      {toggling===u._id ? <Spinner size="sm"/> : u.isActive ? <ToggleRight className="w-5 h-5"/> : <ToggleLeft className="w-5 h-5"/>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="p-10 text-center text-slate-400 text-sm">No users found</div>}
        </div>
      )}
    </div>
  )
}
