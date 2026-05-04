import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { ShoppingCart, Star, CheckCircle, ArrowLeft, Upload, Package, Minus, Plus, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { PageLoader } from '../components/common'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selImg, setSelImg] = useState(0)
  const [selColor, setSelColor] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    api.get('/products/' + id)
      .then(({ data }) => { setProduct(data.product); setSelColor(data.product.colors?.[0] || '') })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLoader />
  if (!product) return (
    <div className="page-container py-20 text-center">
      <h2 className="section-heading">Product not found</h2>
      <Link to="/products" className="btn-primary mt-4 inline-flex">Back to Products</Link>
    </div>
  )

  const effectivePrice = () => {
    if (product.bulkPricing?.length && qty > 1) {
      const tier = product.bulkPricing.filter(t => qty >= t.minQty).sort((a,b) => b.minQty - a.minQty)[0]
      if (tier) return tier.pricePerUnit
    }
    return product.price
  }

  const price = effectivePrice()
  const savings = product.price - price
  const images = product.images?.length ? product.images : [`https://placehold.co/600x600/e2e8f0/475569?text=${encodeURIComponent(product.title)}`]

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: qty, material: selColor || product.material }))
    toast.success(`${qty}× added to cart!`)
  }

  return (
    <div>
      <div className="bg-slate-50 border-b border-slate-100 py-3">
        <div className="page-container flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-primary-600">Home</Link><ChevronRight className="w-4 h-4"/>
          <Link to="/products" className="hover:text-primary-600">Products</Link><ChevronRight className="w-4 h-4"/>
          <span className="text-slate-700 font-medium line-clamp-1">{product.title}</span>
        </div>
      </div>
      <div className="page-container py-10">
        <Link to="/products" className="btn-ghost mb-6 -ml-2"><ArrowLeft className="w-4 h-4"/>Back</Link>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 mb-3">
              <img src={images[selImg]} alt={product.title} className="w-full h-full object-cover"/>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img,i)=>(
                  <button key={i} onClick={()=>setSelImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${selImg===i?'border-primary-600':'border-slate-200 hover:border-slate-300'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Details */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge badge-primary">{product.material}</span>
              <span className="badge badge-grey">{product.category}</span>
              {product.customizable && <span className="badge badge-success">Customizable</span>}
              {!product.inStock && <span className="badge badge-danger">Out of Stock</span>}
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-3">{product.title}</h1>
            {product.rating?.count > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{Array.from({length:5}).map((_,i)=><Star key={i} className={`w-4 h-4 ${i<Math.round(product.rating.average)?'fill-amber-400 text-amber-400':'text-slate-200'}`}/>)}</div>
                <span className="text-sm font-semibold text-slate-700">{product.rating.average.toFixed(1)}</span>
                <span className="text-sm text-slate-400">({product.rating.count} reviews)</span>
              </div>
            )}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-display font-bold text-slate-900">₹{price}</span>
              {savings > 0 && <><span className="text-xl text-slate-400 line-through">₹{product.price}</span><span className="badge badge-success">Save ₹{savings}/unit</span></>}
            </div>
            <p className="text-xs text-slate-500 mb-5">+ 18% GST applicable</p>
            <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <p className="label">Color / Finish</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(c=>(
                    <button key={c} onClick={()=>setSelColor(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selColor===c?'border-primary-600 bg-primary-50 text-primary-700':'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Quantity */}
            <div className="mb-5">
              <p className="label">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={()=>setQty(q=>Math.max(product.minimumOrderQty||1,q-1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 text-slate-600"><Minus className="w-4 h-4"/></button>
                  <span className="w-12 text-center font-semibold text-slate-800">{qty}</span>
                  <button onClick={()=>setQty(q=>q+1)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 text-slate-600"><Plus className="w-4 h-4"/></button>
                </div>
                <span className="text-sm text-slate-500">Total: <span className="font-bold text-slate-800">₹{(price*qty).toLocaleString('en-IN')}</span></span>
              </div>
            </div>
            {product.bulkPricing?.length > 0 && (
              <div className="card p-4 mb-5 bg-emerald-50 border-emerald-100">
                <p className="text-sm font-semibold text-emerald-800 mb-2">💰 Bulk Discounts</p>
                <div className="space-y-1">
                  {product.bulkPricing.map((t,i)=>(
                    <div key={i} className="flex justify-between text-xs text-emerald-700">
                      <span>{t.minQty}+ units{t.maxQty ? ` (up to ${t.maxQty})` : ''}</span>
                      <span className="font-semibold">₹{t.pricePerUnit}/unit</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 mb-5">
              <button onClick={handleAdd} disabled={!product.inStock} className="btn-primary flex-1 disabled:opacity-50">
                <ShoppingCart className="w-5 h-5"/>Add to Cart
              </button>
              <Link to="/upload" className="btn-secondary flex-1 justify-center">
                <Upload className="w-5 h-5"/>Upload Design
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{icon:CheckCircle,t:'Quality Guaranteed'},{icon:Package,t:'Fast Shipping'},{icon:Star,t:'Premium Material'}].map(({icon:Icon,t})=>(
                <div key={t} className="text-center bg-slate-50 rounded-xl p-3">
                  <Icon className="w-5 h-5 text-primary-600 mx-auto mb-1"/>
                  <span className="text-xs text-slate-600 font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
