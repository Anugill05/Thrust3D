import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Package, ShoppingBag, Users, IndianRupee, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'
import api from '../../utils/api'
import { Spinner, OrderStatusBadge, PaymentStatusBadge } from '../../components/common'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const COLORS  = ['#6366f1','#22c55e','#f59e0b','#ef4444','#06b6d4','#8b5cf6']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => setData(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg"/></div>

  const { stats, recentOrders, monthlyRevenue, ordersByStatus } = data

  const revData = (monthlyRevenue||[]).map(d=>({ month: MONTHS[d._id.month-1], revenue: d.revenue, orders: d.orders }))
  const statusData = (ordersByStatus||[]).map(d=>({ name: d._id?.replace('_',' '), value: d.count }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm">Overview of your 3D printing business.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total Revenue',  value:`₹${(stats.totalRevenue||0).toLocaleString('en-IN')}`, icon:IndianRupee, cls:'bg-primary-100 text-primary-700' },
          { label:'Total Orders',   value:stats.totalOrders, icon:ShoppingBag, cls:'bg-emerald-100 text-emerald-700', sub:`${stats.pendingOrders} pending` },
          { label:'Products',       value:stats.totalProducts, icon:Package, cls:'bg-amber-100 text-amber-700' },
          { label:'Users',          value:stats.totalUsers, icon:Users, cls:'bg-sky-100 text-sky-700' },
        ].map(({ label, value, icon:Icon, cls, sub })=>(
          <div key={label} className="card p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${cls}`}><Icon className="w-5 h-5"/></div>
            <div className="text-2xl font-display font-bold text-slate-900">{value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{sub || label}</div>
          </div>
        ))}
      </div>

      {stats.newContacts > 0 && (
        <Link to="/admin/contacts" className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium hover:bg-amber-100 transition-colors">
          <MessageSquare className="w-4 h-4"/>
          {stats.newContacts} new contact message{stats.newContacts>1?'s':''} awaiting reply
          <ArrowRight className="w-4 h-4 ml-auto"/>
        </Link>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-primary-600"/><h2 className="font-display font-semibold text-slate-800">Revenue (Last 6 Months)</h2></div>
          {revData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revData} barSize={32}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize:12,fill:'#94a3b8'}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#94a3b8'}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                <Tooltip formatter={v=>[`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{borderRadius:12,border:'1px solid #e2e8f0',fontSize:12}}/>
                <Bar dataKey="revenue" fill="#6366f1" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm">No revenue data yet</div>
          )}
        </div>
        <div className="card p-5">
          <h2 className="font-display font-semibold text-slate-800 mb-4">Orders by Status</h2>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                    {statusData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius:12,fontSize:12}}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {statusData.map((d,i)=>(
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{background:COLORS[i%COLORS.length]}}/>
                      <span className="text-slate-600 capitalize">{d.name}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No orders yet</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-display font-semibold text-slate-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline font-medium">View all</Link>
        </div>
        {!recentOrders?.length ? (
          <div className="p-8 text-center text-slate-400 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentOrders.map(o=>(
                  <tr key={o._id}>
                    <td className="font-mono text-xs font-bold text-primary-600">#{o.orderNumber}</td>
                    <td><div className="font-medium text-slate-800 text-sm">{o.user?.name}</div><div className="text-xs text-slate-400">{o.user?.email}</div></td>
                    <td className="font-semibold">₹{o.pricing?.total?.toLocaleString('en-IN')}</td>
                    <td><PaymentStatusBadge status={o.payment?.status}/></td>
                    <td><OrderStatusBadge status={o.orderStatus}/></td>
                    <td className="text-slate-500 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
