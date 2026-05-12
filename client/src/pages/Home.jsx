import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Upload, FileText, Star, CheckCircle, Zap, Shield, Package, Cpu, Users, Home as HomeIcon, Layers, Wrench, ChevronRight } from 'lucide-react'
import api from '../utils/api'
import ProductCard from '../components/ProductCard'
import { Spinner } from '../components/common'

const MATERIALS = [
  { name:'PLA',         desc:'Eco-friendly & Easy to print', from:'from-emerald-50', to:'to-emerald-100', text:'text-emerald-700', icon:'🌱' },
  { name:'ABS',         desc:'Strong & Impact resistant',    from:'from-blue-50',    to:'to-blue-100',    text:'text-blue-700',    icon:'💪' },
  { name:'PETG',        desc:'Durable & Chemical resistant', from:'from-violet-50',  to:'to-violet-100',  text:'text-violet-700',  icon:'🔬' },
  { name:'TPU',         desc:'Flexible & Tough',             from:'from-orange-50',  to:'to-orange-100',  text:'text-orange-700',  icon:'⚡' },
  { name:'Nylon',       desc:'Industrial strength',          from:'from-cyan-50',    to:'to-cyan-100',    text:'text-cyan-700',    icon:'🎯' },
  { name:'Resin (SLA)', desc:'Ultra-high detail finish',     from:'from-pink-50',    to:'to-pink-100',    text:'text-pink-700',    icon:'✨' },
]

const WHY = [
  { icon:Cpu,     title:'Advanced Technology', desc:'Latest FDM & SLA printers for perfect results every time.' },
  { icon:Users,   title:'Expert Support',      desc:'Our team guides you at every step of your project.' },
  { icon:Zap,     title:'Fast Turnaround',     desc:'Standard 3–7 days. Rush orders in 24–48 hours.' },
  { icon:Package, title:'Bulk Benefits',       desc:'Special tiered pricing for businesses of all sizes.' },
]

const STATS = [
  { value:'1000+', label:'Projects Completed' },
  { value:'500+',  label:'Happy Clients' },
  { value:'99%',   label:'On-time Delivery' },
  { value:'4.9/5', label:'Customer Rating' },
]

const TESTIMONIALS = [
  { name:'Rohit Sharma',  role:'Product Designer',   rating:5, text:'Excellent quality prints and super fast delivery! The team was very helpful throughout the entire process.' },
  { name:'Anjali Verma',  role:'Procurement Manager', rating:5, text:'We placed a bulk order for 300+ parts. The quality and pricing were outstanding for B2B.' },
  { name:'Vikram Patel',  role:'Startup Founder',     rating:5, text:'Great support and seamless experience from upload to delivery. Fastest turnaround I have seen.' },
]

const GALLERY = [
  'https://placehold.co/400x400/e2e8f0/475569?text=Spiral+Vase',
  'https://placehold.co/400x400/dbeafe/1e40af?text=Dragon',
  'https://placehold.co/400x400/fce7f3/9d174d?text=Gear+Model',
  'https://placehold.co/400x400/d1fae5/065f46?text=Planter',
  'https://placehold.co/400x400/ede9fe/4c1d95?text=Arch+Model',
  'https://placehold.co/400x400/fef3c7/92400e?text=Keychain',
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products/featured')
      .then(({ data }) => setFeatured(data.products.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-primary-50 pt-16 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.08),transparent_70%)]" />
        <div className="page-container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse" />
                India's Premium 3D Printing Service
              </div>
              <h1 className="text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-[1.1] mb-5">
                Bringing Your<br />Ideas to Life with{' '}
                <span className="gradient-text">3D Printing</span>
              </h1>
              <p className="text-slate-500 text-lg mb-8 max-w-md leading-relaxed">
                High quality. Precision prints. Fast turnaround.<br />For creators, innovators & businesses.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/upload" className="btn-primary text-base px-8 py-3.5">
                  <Upload className="w-5 h-5" /> Upload Your Design
                </Link>
                <Link to="/products" className="btn-secondary text-base px-8 py-3.5">
                  <FileText className="w-5 h-5" /> Browse Products
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                {[{i:'🏆',t:'Premium Quality'},{i:'⚡',t:'Fast Delivery'},{i:'🔒',t:'Secure Payment'}].map(({i,t})=>(
                  <div key={t} className="flex items-center gap-1.5"><span>{i}</span><span className="font-medium">{t}</span></div>
                ))}
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full" />
                <div className="absolute inset-4 bg-white rounded-full shadow-2xl flex items-center justify-center">
                  <img src="https://i.pinimg.com/1200x/bf/9b/c3/bf9bc3e76ded9a968768e7fb15f23f38.jpg" alt="3D Print" className="w-[500px] h-[450px] rounded-[50%] object-contain animate-float" />
                </div>
                <div className="absolute -top-3 -right-3 card px-3 py-2 shadow-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> 99% On-time
                </div>
                <div className="absolute -bottom-3 -left-3 card px-3 py-2 shadow-lg text-xs font-semibold flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10 gradient-primary">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
                <div className="text-primary-200 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <div className="divider mx-auto" />
            <h2 className="section-heading">Browse by Category</h2>
            <p className="section-subheading mx-auto">Find the perfect 3D printed product for your needs</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{icon:HomeIcon,label:'Home Decor',slug:'Home Decor'},{icon:Wrench,label:'Functional Parts',slug:'Functional Parts'},{icon:Layers,label:'Prototypes',slug:'Prototypes'},{icon:Package,label:'Custom Orders',slug:'Custom Orders'}].map(({icon:Icon,label,slug})=>(
              <Link key={label} to={`/products?category=${encodeURIComponent(slug)}`}
                className="card p-6 text-center group hover:border-primary-200 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-primary-50 group-hover:bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <span className="font-display font-semibold text-slate-700 text-sm">{label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 mx-auto mt-1 group-hover:text-primary-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-slate-50">
        <div className="page-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="divider" />
              <h2 className="section-heading">Featured Products</h2>
              <p className="section-subheading">Our most popular 3D printed items</p>
            </div>
            <Link to="/products" className="btn-ghost text-sm hidden md:flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {loading ? <Spinner size="lg" className="py-16" /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div className="text-center mt-8 md:hidden">
            <Link to="/products" className="btn-secondary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* MATERIALS */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <div className="divider mx-auto" />
            <h2 className="section-heading">Materials & Options</h2>
            <p className="section-subheading mx-auto">Choose from premium materials with multiple finish options</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {MATERIALS.map(({ name, desc, from, to, text, icon }) => (
              <div key={name} className={`bg-gradient-to-b ${from} ${to} rounded-2xl p-4 text-center hover:-translate-y-1 transition-transform duration-300`}>
                <div className="text-3xl mb-2">{icon}</div>
                <div className={`font-display font-bold text-sm ${text}`}>{name}</div>
                <div className="text-xs text-slate-500 mt-1 leading-snug">{desc}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{l:'Wide Range of Colors',d:'Vibrant & Customizable'},{l:'Multiple Finishes',d:'Smooth, Matte, Glossy & more'},{l:'High Precision',d:'Up to 50 microns Layer Resolution'},{l:'Custom Sizes',d:'From small parts to Large prototypes'}].map(({l,d})=>(
              <div key={l} className="card p-4">
                <CheckCircle className="w-5 h-5 text-primary-600 mb-2" />
                <div className="font-semibold text-slate-800 text-sm">{l}</div>
                <div className="text-xs text-slate-500 mt-0.5">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-slate-900">
        <div className="page-container">
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-primary-500 rounded-full mx-auto mb-4" />
            <h2 className="section-heading text-white">Why Choose Thrust3D?</h2>
            <p className="text-slate-400 mt-3">Technology meets craftsmanship for outstanding results</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center group">
                <div className="w-14 h-14 bg-primary-600/20 border border-primary-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors">
                  <Icon className="w-7 h-7 text-primary-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <div className="divider mx-auto" />
            <h2 className="section-heading">How It Works</h2>
            <p className="section-subheading mx-auto">Get your 3D prints in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{n:'01',icon:Upload,title:'Upload Your Design',desc:'Upload STL, OBJ or 3MF file. We support all major 3D formats up to 100MB.'},{n:'02',icon:FileText,title:'Get Your Quote',desc:'Our team reviews your model and provides pricing & delivery timeline within 24h.'},{n:'03',icon:Package,title:'Receive Your Print',desc:'We print, quality-check and deliver right to your doorstep across India.'}].map(({n,icon:Icon,title,desc})=>(
              <div key={n} className="text-center">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-xs font-bold text-primary-400 mb-1">STEP {n}</div>
                <h3 className="font-display font-bold text-slate-800 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/upload" className="btn-primary text-base px-8">Start Now <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-20 bg-slate-50">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <div><div className="divider" /><h2 className="section-heading">Our Gallery</h2><p className="section-subheading">A showcase of our finest work</p></div>
            <Link to="/products" className="btn-secondary text-sm hidden md:flex">Explore All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {GALLERY.map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden group cursor-pointer">
                <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <div className="divider mx-auto" />
            <h2 className="section-heading">What Our Customers Say</h2>
            <p className="section-subheading mx-auto">Join 500+ satisfied customers across India</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, rating, text }) => (
              <div key={name} className="card p-6">
                <div className="flex mb-3">{Array.from({length:rating}).map((_,i)=><Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}</div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 text-sm">{name[0]}</div>
                  <div><div className="font-semibold text-slate-800 text-sm">{name}</div><div className="text-xs text-slate-500">{role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-primary">
        <div className="page-container text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-4">Ready to Print Your Idea?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">Upload your design and get a quote within 24 hours. Fast, affordable, premium quality.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/upload" className="bg-white text-primary-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg flex items-center gap-2">
              <Upload className="w-5 h-5" /> Upload Design
            </Link>
            <Link to="/contact" className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
