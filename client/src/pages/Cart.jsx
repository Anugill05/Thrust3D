import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQty, selectCartTotal } from '../store/cartSlice'
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react'
import { EmptyState, PageHeader } from '../components/common'

export default function Cart() {
  const { items } = useSelector(s=>s.cart)
  const total = useSelector(selectCartTotal)
  const dispatch = useDispatch(); const navigate = useNavigate()

  const shipping = total > 999 ? 0 : 99
  const tax = Math.round(total * 0.18)
  const grand = total + shipping + tax

  if (!items.length) return (
    <div><PageHeader title="Your Cart" breadcrumb="Home / Cart"/>
      <div className="page-container py-12">
        <EmptyState icon={ShoppingCart} title="Your cart is empty" subtitle="Browse our products and add items to your cart."
          action={<Link to="/products" className="btn-primary">Browse Products</Link>}/>
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader title="Your Cart" breadcrumb="Home / Cart"/>
      <div className="page-container py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item,i)=>(
              <div key={i} className="card p-4 flex items-center gap-4">
                <img src={item.image || 'https://placehold.co/80x80/e2e8f0/475569?text=P'} alt={item.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-slate-50"/>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.material}</p>
                  <p className="text-primary-600 font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button onClick={()=>dispatch(updateQty({index:i,quantity:item.quantity-1}))} disabled={item.quantity<=1} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"><Minus className="w-3.5 h-3.5"/></button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={()=>dispatch(updateQty({index:i,quantity:item.quantity+1}))} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50"><Plus className="w-3.5 h-3.5"/></button>
                </div>
                <div className="text-right min-w-[70px]">
                  <p className="font-bold text-slate-800">₹{(item.price*item.quantity).toLocaleString('en-IN')}</p>
                </div>
                <button onClick={()=>dispatch(removeFromCart(i))} className="text-red-400 hover:text-red-600 p-1 transition-colors"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
          </div>
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="font-display font-bold text-lg text-slate-900 mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-medium">₹{total.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className={shipping===0?'text-emerald-600 font-medium':'font-medium'}>{shipping===0?'FREE':'₹'+shipping}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">GST (18%)</span><span className="font-medium">₹{tax.toLocaleString('en-IN')}</span></div>
              <hr className="border-slate-100"/>
              <div className="flex justify-between text-base font-bold text-slate-900"><span>Total</span><span>₹{grand.toLocaleString('en-IN')}</span></div>
            </div>
            {shipping > 0 && <p className="text-xs text-slate-500 mb-4 p-2 bg-amber-50 rounded-lg">Add ₹{(1000-total)} more for free shipping</p>}
            <button onClick={()=>navigate('/checkout')} className="btn-primary w-full justify-center py-3">Proceed to Checkout <ArrowRight className="w-4 h-4"/></button>
            <Link to="/products" className="btn-ghost w-full justify-center mt-2 text-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
