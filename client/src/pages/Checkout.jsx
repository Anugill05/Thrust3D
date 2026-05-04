import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { clearCart, selectCartTotal } from '../store/cartSlice'
import { initiatePayment } from '../utils/razorpay'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { PageHeader } from '../components/common'
import { CreditCard } from 'lucide-react'

export default function Checkout() {
  const { items } = useSelector(s=>s.cart)
  const total = useSelector(selectCartTotal)
  const { user } = useSelector(s=>s.auth)
  const dispatch = useDispatch(); const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const shipping = total > 999 ? 0 : 99
  const tax = Math.round(total * 0.18)
  const grand = total + shipping + tax

  const { register, handleSubmit, formState:{errors} } = useForm({
    defaultValues: { name: user?.name||'', phone: user?.phone||'' }
  })

  if (!items.length) { navigate('/cart'); return null }

  const onSubmit = async (fd) => {
    setLoading(true)
    try {
      const { data } = await api.post('/orders', {
        items: items.map(i=>({productId:i.productId,quantity:i.quantity,material:i.material})),
        shippingAddress: { name:fd.name, phone:fd.phone, street:fd.street, city:fd.city, state:fd.state, pincode:fd.pincode },
        specialInstructions: fd.note
      })
      await initiatePayment({
        orderId: data.order._id, user,
        onSuccess: (paid) => { dispatch(clearCart()); navigate('/orders/'+paid._id) },
        onFailure: () => { toast.error('Payment failed. Order saved – retry from Orders.'); navigate('/orders') }
      })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place order.') }
    finally { setLoading(false) }
  }

  const F = ({ label, name, required, type='text', placeholder='' }) => (
    <div>
      <label className="label">{label}{required?' *':''}</label>
      <input {...register(name, required ? {required:'Required'} : {})} type={type} placeholder={placeholder} className="input-field"/>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
    </div>
  )

  return (
    <div>
      <PageHeader title="Checkout" breadcrumb="Home / Cart / Checkout"/>
      <div className="page-container py-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-6">
              <h2 className="font-display font-bold text-xl text-slate-900 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="Full Name" name="name" required placeholder="Rohit Sharma"/>
                <F label="Phone" name="phone" required placeholder="+91 98765 43210"/>
                <div className="sm:col-span-2"><F label="Street Address" name="street" required placeholder="123 MG Road, Apt 4B"/></div>
                <F label="City" name="city" required placeholder="Bangalore"/>
                <F label="State" name="state" required placeholder="Karnataka"/>
                <F label="PIN Code" name="pincode" required placeholder="560001"/>
                <div>
                  <label className="label">Country</label>
                  <input value="India" readOnly className="input-field bg-slate-100 text-slate-500 cursor-not-allowed"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Special Instructions</label>
                  <textarea {...register('note')} rows={3} className="input-field resize-none" placeholder="Printing notes, color preference, delivery instructions..."/>
                </div>
              </div>
            </div>
            <div>
              <div className="card p-5 mb-4">
                <h3 className="font-display font-bold text-base text-slate-900 mb-4">Items ({items.length})</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item,i)=>(
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image||'https://placehold.co/48x48/e2e8f0/475569?text=P'} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-slate-50"/>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-slate-400">×{item.quantity} · {item.material}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-800 flex-shrink-0">₹{(item.price*item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-5">
                <div className="space-y-2.5 text-sm mb-4">
                  <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className={shipping===0?'text-emerald-600':''}>{shipping===0?'FREE':'₹'+shipping}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
                  <hr className="border-slate-100"/>
                  <div className="flex justify-between font-bold text-base text-slate-900"><span>Total</span><span>₹{grand.toLocaleString('en-IN')}</span></div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Processing...</>
                           : <><CreditCard className="w-5 h-5"/>Pay ₹{grand.toLocaleString('en-IN')}</>}
                </button>
                <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">🔒 Secured by Razorpay</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
