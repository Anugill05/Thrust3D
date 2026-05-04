import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import api from '../utils/api'
import ProductCard from '../components/ProductCard'
import { PageHeader, PageLoader, EmptyState } from '../components/common'
import { Package } from 'lucide-react'

const CATEGORIES = ['All','Home Decor','Toys & Figurines','Functional Parts','Prototypes','Industrial Parts','Custom Orders','Art & Design']
const MATERIALS  = ['All','PLA','ABS','PETG','TPU','Nylon','Resin (SLA)']
const SORTS = [
  { value:'-createdAt', label:'Newest First' },
  { value:'price',      label:'Price: Low to High' },
  { value:'-price',     label:'Price: High to Low' },
  { value:'-rating.average', label:'Highest Rated' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page:1, pages:1, total:0 })
  const [showFilters, setShowFilters] = useState(false)

  const category = searchParams.get('category') || 'All'
  const material  = searchParams.get('material')  || 'All'
  const search    = searchParams.get('search')    || ''
  const sort      = searchParams.get('sort')      || '-createdAt'
  const page      = Number(searchParams.get('page') || 1)

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams)
    if (val && val !== 'All') next.set(key, val); else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (category !== 'All') p.set('category', category)
      if (material  !== 'All') p.set('material', material)
      if (search) p.set('search', search)
      p.set('sort', sort); p.set('page', page); p.set('limit', 12)
      const { data } = await api.get('/products?' + p)
      setProducts(data.products); setPagination(data.pagination)
    } catch {}
    finally { setLoading(false) }
  }, [category, material, search, sort, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const activeFilters = [
    category !== 'All' && { key:'category', label:category },
    material  !== 'All' && { key:'material',  label:material },
  ].filter(Boolean)

  return (
    <div>
      <PageHeader breadcrumb="Home / Products" title="Our Products & Services" subtitle="Browse our range of 3D printed products or upload your design for a custom quote." />
      <div className="page-container py-8">

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" style={{width:17,height:17}} />
            <input type="text" placeholder="Search products..." value={search}
              onChange={e => setParam('search', e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowFilters(v=>!v)} className="btn-ghost border border-slate-200 px-4 gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {activeFilters.length > 0 && <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">{activeFilters.length}</span>}
            </button>
            <div className="relative">
              <select value={sort} onChange={e => setParam('sort', e.target.value)} className="input-field pr-8 appearance-none cursor-pointer w-auto">
                {SORTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="card p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="label">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setParam('category', cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category===cat ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="label">Material</p>
                <div className="flex flex-wrap gap-2">
                  {MATERIALS.map(mat => (
                    <button key={mat} onClick={() => setParam('material', mat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${material===mat ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs text-slate-500">Active:</span>
            {activeFilters.map(f => (
              <button key={f.key} onClick={() => setParam(f.key, 'All')}
                className="flex items-center gap-1.5 bg-primary-100 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-primary-200 transition-colors">
                {f.label} <X className="w-3 h-3" />
              </button>
            ))}
            <button onClick={() => setSearchParams({})} className="text-xs text-slate-500 hover:text-slate-700">Clear all</button>
          </div>
        )}

        {!loading && <p className="text-sm text-slate-500 mb-6">{pagination.total} product{pagination.total !== 1 ? 's' : ''} found</p>}

        {loading ? <PageLoader /> : products.length === 0 ? (
          <EmptyState icon={Package} title="No products found" subtitle="Try changing your filters or search query."
            action={<button onClick={() => setSearchParams({})} className="btn-primary">Clear Filters</button>} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setParam('page', page-1)} disabled={page<=1} className="btn-ghost px-3 py-2 disabled:opacity-40">← Prev</button>
                {Array.from({length:pagination.pages},(_,i)=>i+1).map(pg=>(
                  <button key={pg} onClick={() => setParam('page', pg)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page===pg?'bg-primary-600 text-white':'btn-ghost'}`}>{pg}</button>
                ))}
                <button onClick={() => setParam('page', page+1)} disabled={page>=pagination.pages} className="btn-ghost px-3 py-2 disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}

        {/* Bulk Banner */}
        <div className="mt-12 card p-6 bg-gradient-to-r from-primary-50 to-violet-50 border-primary-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-slate-800 text-lg">Need a Bulk Order?</h3>
              <p className="text-slate-500 text-sm">Get special discounts on bulk orders for businesses and resellers.</p>
            </div>
            <a href="/contact" className="btn-primary whitespace-nowrap">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}
