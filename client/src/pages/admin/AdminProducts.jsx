import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X, Save } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Spinner } from '../../components/common'

const CATS = ['Home Decor','Toys & Figurines','Functional Parts','Prototypes','Industrial Parts','Custom Orders','Art & Design']
const MATS = ['PLA','ABS','PETG','TPU','Nylon','Resin (SLA)','Other']

// FIX 1: Initial state uses strings for array-destined fields to ensure input stability
const EMPTY = { 
  title: '', 
  shortDescription: '', 
  description: '', 
  material: 'PLA', 
  category: 'Home Decor', 
  price: '', 
  images: '', // Changed from ['']
  featured: false, 
  inStock: true, 
  customizable: false, 
  colors: '', 
  tags: '' 
}

export default function AdminProducts() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showForm, setShowForm]   = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState(null)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try { 
      const { data } = await api.get('/products')
      setProducts(data.products) 
    } catch { 
      toast.error('Failed to load products') 
    } finally { 
      setLoading(false) 
    }
  }

  const openCreate = () => { 
    setForm(EMPTY)
    setEditing(null)
    setShowForm(true) 
  }

  const openEdit = (p) => {
    // FIX 2: Join existing arrays into comma-separated strings for the form fields
    setForm({ 
      ...p, 
      images: Array.isArray(p.images) ? p.images.join(', ') : '',
      colors: Array.isArray(p.colors) ? p.colors.join(', ') : '', 
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '' 
    })
    setEditing(p._id)
    setShowForm(true)
  }

  const handleSave = async () => {
    // FIX 3: Expanded Frontend Validation to match Backend Schema
    const required = ['title', 'price', 'description', 'material', 'category']
    const missing = required.filter(key => !form[key] || form[key].toString().trim() === '')
    
    if (missing.length > 0) {
      return toast.error(`Missing fields: ${missing.join(', ')}`)
    }

    setSaving(true)
    try {
      // FIX 4: Transform strings back into arrays before sending to API
      const payload = { 
        ...form, 
        price: Number(form.price),
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean) 
      }

      if (editing) {
        const { data } = await api.put('/products/' + editing, payload)
        setProducts(prev => prev.map(p => p._id === editing ? data.product : p))
        toast.success('Product updated!')
      } else {
        const { data } = await api.post('/products', payload)
        setProducts(prev => [data.product, ...prev])
        toast.success('Product created!')
      }
      setShowForm(false)
    } catch (err) { 
      // Show specific backend validation message if available
      toast.error(err.response?.data?.message || 'Save failed.') 
    } finally { 
      setSaving(false) 
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    setDeleting(id)
    try {
      await api.delete('/products/' + id)
      setProducts(prev => prev.filter(p => p._id !== id))
      toast.success('Product deleted.')
    } catch { 
      toast.error('Delete failed.') 
    } finally { 
      setDeleting(null) 
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.material.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* Header & Search */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm">{products.length} products</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4"/>Add Product</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" style={{width:17,height:17}}/>
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search products..." 
          className="input-field pl-10"
        />
      </div>

      {/* Table Section */}
      {loading ? <Spinner size="lg" className="py-16"/> : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Material</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img 
                        src={p.images?.[0] || 'https://placehold.co/40x40/e2e8f0/475569?text=P'} 
                        alt="" 
                        className="w-10 h-10 rounded-lg object-cover bg-slate-50"
                      />
                      <div>
                        <div className="font-semibold text-slate-800 text-sm line-clamp-1">{p.title}</div>
                        {p.featured && <span className="badge badge-primary text-[10px]">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-slate-500">{p.category}</td>
                  <td><span className="badge badge-grey">{p.material}</span></td>
                  <td className="font-bold text-slate-800">₹{p.price?.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge ${p.inStock ? 'badge-success' : 'badge-danger'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="btn-ghost p-2 text-blue-600"><Edit2 className="w-4 h-4"/></button>
                      <button 
                        onClick={() => handleDelete(p._id)} 
                        disabled={deleting === p._id} 
                        className="btn-ghost p-2 text-red-500 hover:bg-red-50"
                      >
                        {deleting === p._id ? <Spinner size="sm"/> : <Trash2 className="w-4 h-4"/>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-10 text-center text-slate-400 text-sm">No products found</div>}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)}/>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-display font-bold text-slate-900">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="btn-ghost p-2"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Product title" className="input-field"/>
                </div>
                
                <div>
                  <label className="label">Material *</label>
                  <select name="material" value={form.material} onChange={handleChange} className="input-field">
                    {MATS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="label">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field">
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Base Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="499" className="input-field"/>
                </div>

                <div>
                  <label className="label">Images (URLs, comma separated) *</label>
                  <input name="images" value={form.images} onChange={handleChange} placeholder="https://..." className="input-field"/>
                </div>

                <div>
                  <label className="label">Colors (comma separated)</label>
                  <input name="colors" value={form.colors} onChange={handleChange} placeholder="White, Black" className="input-field"/>
                </div>

                <div>
                  <label className="label">Tags (comma separated)</label>
                  <input name="tags" value={form.tags} onChange={handleChange} placeholder="vase, gift" className="input-field"/>
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Short Description</label>
                  <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="input-field"/>
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Full Description *</label>
                  <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="input-field resize-none"/>
                </div>

                <div className="sm:col-span-2 flex gap-6 flex-wrap">
                  {[{k:'featured',l:'Featured'},{k:'inStock',l:'In Stock'},{k:'customizable',l:'Customizable'}].map(({k,l})=>(
                    <label key={k} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        name={k}
                        type="checkbox" 
                        checked={!!form[k]} 
                        onChange={handleChange} 
                        className="w-4 h-4 rounded border-slate-300 text-primary-600"
                      />
                      <span className="text-sm text-slate-700 font-medium">{l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-3">
                  {saving ? <Spinner size="sm"/> : <><Save className="w-4 h-4"/>{editing ? 'Save Changes' : 'Create Product'}</>}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-secondary px-5">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}