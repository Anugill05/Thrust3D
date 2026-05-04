import { useState, useEffect } from 'react'
import { Eye, ChevronDown } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Spinner, OrderStatusBadge, PaymentStatusBadge } from '../../components/common'

const STATUSES = ['pending','confirmed','printing','quality_check','shipped','delivered','cancelled']

export default function AdminOrders() {
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(null)

  useEffect(() => { fetchOrders() }, [filter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams({ limit: 50 })
      if (filter) p.set('status', filter)
      const { data } = await api.get('/orders?' + p)
      setOrders(data.orders)
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  const updateStatus = async (id, orderStatus) => {
    setUpdating(id)
    try {
      const { data } = await api.put('/orders/' + id + '/status', { orderStatus })
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: data.order.orderStatus } : o))
      if (selected?._id === id) setSelected(prev => ({ ...prev, orderStatus: data.order.orderStatus, statusHistory: data.order.statusHistory }))
      toast.success('Status updated to ' + orderStatus)
    } catch { toast.error('Update failed') }
    finally { setUpdating(null) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-display font-bold text-slate-900">Orders</h1><p className="text-slate-500 text-sm">{orders.length} orders</p></div>
        <div className="relative">
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="input-field pr-8 appearance-none w-auto">
            <option value="">All Statuses</option>
            {STATUSES.map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
        </div>
      </div>

      {loading ? <Spinner size="lg" className="py-16"/> : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Order #</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>View</th></tr></thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o._id}>
                  <td className="font-mono text-xs font-bold text-primary-600">#{o.orderNumber}</td>
                  <td>
                    <div className="font-medium text-sm text-slate-800">{o.user?.name}</div>
                    <div className="text-xs text-slate-400">{o.user?.email}</div>
                  </td>
                  <td className="font-bold">₹{o.pricing?.total?.toLocaleString('en-IN')}</td>
                  <td><PaymentStatusBadge status={o.payment?.status}/></td>
                  <td>
                    <select value={o.orderStatus} disabled={updating===o._id}
                      onChange={e=>updateStatus(o._id, e.target.value)}
                      className="text-xs font-medium border border-slate-200 rounded-lg px-2 py-1 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 appearance-none pr-5">
                      {STATUSES.map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}
                    </select>
                  </td>
                  <td className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td><button onClick={()=>setSelected(o)} className="btn-ghost p-2 text-blue-600"><Eye className="w-4 h-4"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="p-10 text-center text-slate-400 text-sm">No orders found</div>}
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setSelected(null)}/>
          <div className="relative bg-white w-full max-w-md shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-slate-900">#{selected.orderNumber}</h3>
                <div className="flex gap-2 mt-1"><OrderStatusBadge status={selected.orderStatus}/><PaymentStatusBadge status={selected.payment?.status}/></div>
              </div>
              <button onClick={()=>setSelected(null)} className="btn-ghost p-2 text-lg">✕</button>
            </div>
            <div className="p-5 space-y-5 text-sm">
              <div>
                <p className="label">Customer</p>
                <p className="font-semibold text-slate-800">{selected.user?.name}</p>
                <p className="text-slate-500">{selected.user?.email} · {selected.user?.phone}</p>
              </div>
              <div>
                <p className="label">Items</p>
                {selected.items?.map((item,i)=>(
                  <div key={i} className="flex justify-between py-1">
                    <span className="text-slate-700">{item.title} × {item.quantity}</span>
                    <span className="font-semibold">₹{item.totalPrice?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="label">Shipping To</p>
                <p className="text-slate-600">{selected.shippingAddress?.name} · {selected.shippingAddress?.phone}</p>
                <p className="text-slate-600">{selected.shippingAddress?.street}, {selected.shippingAddress?.city} {selected.shippingAddress?.pincode}</p>
              </div>
              <div>
                <p className="label">Pricing</p>
                <div className="space-y-1">
                  <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>₹{selected.pricing?.subtotal?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span>{selected.pricing?.shipping===0?'Free':'₹'+selected.pricing?.shipping}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">GST</span><span>₹{selected.pricing?.tax?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-100 pt-1"><span>Total</span><span>₹{selected.pricing?.total?.toLocaleString('en-IN')}</span></div>
                </div>
              </div>
              <div>
                <p className="label mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map(s=>(
                    <button key={s} onClick={()=>updateStatus(selected._id,s)}
                      disabled={selected.orderStatus===s||updating===selected._id}
                      className={`text-xs px-3 py-2 rounded-lg font-medium capitalize border transition-colors ${selected.orderStatus===s?'bg-primary-100 border-primary-300 text-primary-700':'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      {s.replace('_',' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
