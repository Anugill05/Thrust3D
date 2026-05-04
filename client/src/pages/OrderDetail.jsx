import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { PageHeader, PageLoader, OrderStatusBadge, PaymentStatusBadge } from '../components/common'
import { initiatePayment } from '../utils/razorpay'

export default function OrderDetail() {
  const { id } = useParams()
  const { user } = useSelector(s => s.auth)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    api.get('/orders/' + id)
      .then(({ data }) => setOrder(data.order))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLoader />
  if (!order) return (
    <div className="page-container py-20 text-center">
      <Link to="/orders" className="btn-primary">Back to Orders</Link>
    </div>
  )

  const handlePay = async () => {
    setPaying(true)
    await initiatePayment({
      orderId: order._id, user,
      onSuccess: (paid) => setOrder(paid),
      onFailure: () => {}
    })
    setPaying(false)
  }

  return (
    <div>
      <PageHeader title={`Order #${order.orderNumber}`} breadcrumb="Home / Orders / Detail" />
      <div className="page-container py-10">
        <Link to="/orders" className="btn-ghost mb-6 -ml-2"><ArrowLeft className="w-4 h-4" /> All Orders</Link>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-slate-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img src={item.image || 'https://placehold.co/64x64/e2e8f0/475569?text=P'} alt=""
                      className="w-16 h-16 rounded-xl object-cover bg-slate-50 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.material} · Qty: {item.quantity}</p>
                      <p className="text-xs text-slate-500">₹{item.pricePerUnit?.toLocaleString('en-IN')}/unit</p>
                    </div>
                    <p className="font-bold text-slate-800">₹{item.totalPrice?.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Timeline */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-slate-900 mb-4">Order Timeline</h3>
              <div className="space-y-3">
                {order.statusHistory?.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-800 capitalize">{h.status?.replace('_', ' ')}</p>
                      <p className="text-xs text-slate-500">{h.note}</p>
                      <p className="text-xs text-slate-400">{new Date(h.timestamp).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-display font-bold text-slate-900 mb-3">Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center"><span className="text-slate-500">Order</span><OrderStatusBadge status={order.orderStatus} /></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Payment</span><PaymentStatusBadge status={order.payment?.status} /></div>
                {order.payment?.paidAt && (
                  <div className="flex justify-between"><span className="text-slate-500">Paid At</span><span className="text-xs">{new Date(order.payment.paidAt).toLocaleDateString('en-IN')}</span></div>
                )}
              </div>
              {order.payment?.status === 'pending' && (
                <button onClick={handlePay} disabled={paying} className="btn-primary w-full justify-center mt-4">
                  {paying ? 'Processing...' : 'Pay Now'}
                </button>
              )}
            </div>
            <div className="card p-5">
              <h3 className="font-display font-bold text-slate-900 mb-3">Ship To</h3>
              <div className="text-sm text-slate-600 space-y-0.5">
                <p className="font-semibold text-slate-800">{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-display font-bold text-slate-900 mb-3">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>₹{order.pricing?.subtotal?.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span>{order.pricing?.shipping === 0 ? 'Free' : '₹' + order.pricing?.shipping}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">GST</span><span>₹{order.pricing?.tax?.toLocaleString('en-IN')}</span></div>
                <hr className="border-slate-100" />
                <div className="flex justify-between font-bold text-slate-900"><span>Total</span><span>₹{order.pricing?.total?.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
