import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import api from '../utils/api'
import { PageHeader, PageLoader, EmptyState, OrderStatusBadge, PaymentStatusBadge } from '../components/common'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  return (
    <div>
      <PageHeader title="My Orders" breadcrumb="Home / Orders" />
      <div className="page-container py-10">
        {orders.length === 0 ? (
          <EmptyState icon={Package} title="No orders yet"
            subtitle="Browse our products and place your first order."
            action={<Link to="/products" className="btn-primary">Shop Now</Link>} />
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`}
                className="card p-5 flex items-center gap-4 hover:border-primary-200 transition-colors">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-800 text-sm">#{order.orderNumber}</span>
                    <OrderStatusBadge status={order.orderStatus} />
                    <PaymentStatusBadge status={order.payment?.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-slate-900">₹{order.pricing?.total?.toLocaleString('en-IN')}</p>
                  <ChevronRight className="w-4 h-4 text-slate-400 ml-auto mt-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
