import { useState, useEffect } from 'react'
import { MessageSquare, Check, Mail } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Spinner } from '../../components/common'

const STATUS_STYLES = { new:'badge-danger', read:'badge-warning', replied:'badge-success', closed:'badge-grey' }

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('')
  const [selected, setSelected] = useState(null)
  const [marking,  setMarking]  = useState(null)

  useEffect(() => { fetchContacts() }, [filter])

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams({ limit: 50 })
      if (filter) p.set('status', filter)
      const { data } = await api.get('/admin/contacts?' + p)
      setContacts(data.contacts)
    } catch { toast.error('Failed to load contacts') }
    finally { setLoading(false) }
  }

  const markStatus = async (id, status) => {
    setMarking(id)
    try {
      const { data } = await api.put('/admin/contacts/' + id, { status })
      setContacts(prev => prev.map(c => c._id === id ? data.contact : c))
      if (selected?._id === id) setSelected(data.contact)
    } catch { toast.error('Update failed') }
    finally { setMarking(null) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-display font-bold text-slate-900">Contacts</h1><p className="text-slate-500 text-sm">{contacts.length} messages</p></div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="input-field w-auto">
          <option value="">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? <Spinner size="lg" className="py-16"/> : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>From</th><th>Subject</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {contacts.map(c=>(
                <tr key={c._id} className={c.status==='new'?'bg-amber-50/30':''}>
                  <td>
                    <div className="font-semibold text-slate-800 text-sm">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.email}</div>
                  </td>
                  <td className="text-sm text-slate-600 max-w-[200px] truncate">{c.subject}</td>
                  <td><span className={`badge ${STATUS_STYLES[c.status]||'badge-grey'} capitalize`}>{c.status}</span></td>
                  <td className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={()=>{ setSelected(c); if(c.status==='new') markStatus(c._id,'read') }} className="btn-ghost p-2 text-blue-600">
                        <MessageSquare className="w-4 h-4"/>
                      </button>
                      <button onClick={()=>markStatus(c._id,'replied')} disabled={marking===c._id||c.status==='replied'}
                        className="btn-ghost p-2 text-emerald-600 disabled:opacity-40">
                        <Check className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contacts.length===0 && <div className="p-10 text-center text-slate-400 text-sm">No messages found</div>}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setSelected(null)}/>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-slate-900">{selected.subject}</h3>
                <p className="text-sm text-slate-500">{selected.name} · {selected.email}</p>
              </div>
              <button onClick={()=>setSelected(null)} className="btn-ghost p-2 text-lg">✕</button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-3">{selected.message}</p>
              {selected.phone && <p className="text-xs text-slate-500 mb-4">📞 {selected.phone}</p>}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  onClick={()=>markStatus(selected._id,'replied')}
                  className="btn-primary flex-1 justify-center text-sm py-2.5">
                  <Mail className="w-4 h-4"/>Reply via Email
                </a>
                <button onClick={()=>{ markStatus(selected._id,'closed'); setSelected(null) }} className="btn-secondary px-4 text-sm py-2.5">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
