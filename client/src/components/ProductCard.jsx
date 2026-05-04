import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { ShoppingCart, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const matColors = { PLA:'bg-emerald-100 text-emerald-700', ABS:'bg-blue-100 text-blue-700', PETG:'bg-violet-100 text-violet-700', TPU:'bg-orange-100 text-orange-700', Nylon:'bg-cyan-100 text-cyan-700', 'Resin (SLA)':'bg-pink-100 text-pink-700' }

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const handleAdd = (e) => {
    e.preventDefault()
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success(`Added to cart!`)
  }
  return (
    <Link to={`/products/${product._id}`} className="card group flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img src={product.images?.[0] || `https://placehold.co/400x400/e2e8f0/475569?text=${encodeURIComponent(product.title)}`}
          alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
        {product.featured && <div className="absolute top-3 left-3 badge bg-primary-600 text-white text-[10px]">Popular</div>}
        {!product.inStock && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><span className="badge badge-danger text-sm px-3 py-1">Out of Stock</span></div>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`badge text-[10px] ${matColors[product.material]||'bg-slate-100 text-slate-600'}`}>{product.material}</span>
          <span className="badge badge-grey text-[10px]">{product.category}</span>
        </div>
        <h3 className="font-display font-semibold text-slate-800 text-sm leading-snug mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">{product.title}</h3>
        {product.rating?.count > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/>
            <span className="text-xs font-semibold text-slate-700">{product.rating.average.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({product.rating.count})</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <div>
            <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
            {product.bulkPricing?.length > 0 && <span className="text-xs text-emerald-600 ml-1">Bulk discounts</span>}
          </div>
          <button onClick={handleAdd} disabled={!product.inStock} className="text-xs btn-primary py-1.5 px-3 disabled:opacity-50">Add to Cart</button>
        </div>
      </div>
    </Link>
  )
}
