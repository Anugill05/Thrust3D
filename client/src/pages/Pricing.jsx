import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, Info } from 'lucide-react'
import { PageHeader } from '../components/common'

const BULK = [
  { m:'PLA',         p100:45, p500:40, p1000:35, p5000:32 },
  { m:'ABS',         p100:55, p500:50, p1000:45, p5000:40 },
  { m:'PETG',        p100:60, p500:55, p1000:50, p5000:45 },
  { m:'TPU',         p100:90, p500:75, p1000:70, p5000:65 },
  { m:'Nylon',       p100:90, p500:85, p1000:80, p5000:75 },
  { m:'Resin (SLA)', p100:120,p500:110,p1000:100,p5000:90 },
]
const PLANS = [
  { name:'Starter', desc:'For hobbyists & small projects', price:'₹499', per:'per order', highlight:false,
    features:['1–10 units per order','PLA / ABS materials','Standard quality (200μ)','5–7 business days','Email support','Basic finishing'], cta:'Get Started', href:'/products' },
  { name:'Professional', desc:'For creators & growing businesses', price:'₹2,999', per:'per order', highlight:true, badge:'Most Popular',
    features:['10–500 units per order','All materials','High quality (100μ)','3–5 business days','Priority WhatsApp support','Multiple finishes','Bulk discount pricing'], cta:'Start Printing', href:'/upload' },
  { name:'Enterprise', desc:'Large-scale industrial production', price:'Custom', per:'contact us', highlight:false,
    features:['500+ units','All materials + specialty','Ultra precision (50μ)','2–3 business days','Dedicated account manager','Post-processing','NDA available','API integration'], cta:'Contact Sales', href:'/contact' },
]

export default function Pricing() {
  const [tab, setTab] = useState('standard')
  return (
    <div>
      <PageHeader breadcrumb="Home / Pricing" title="Pricing & Plans" subtitle="Transparent pricing with bulk discounts. The more you order, the more you save." />
      <div className="page-container py-12">
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-100 rounded-xl p-1">
            {['standard','bulk'].map(t=>(
              <button key={t} onClick={()=>setTab(t)} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab===t?'bg-white text-slate-900 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>
                {t==='standard' ? 'Standard Orders' : 'Bulk Orders (Save More!)'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'standard' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map(plan=>(
              <div key={plan.name} className={`card p-6 relative ${plan.highlight?'border-primary-400 ring-2 ring-primary-200 shadow-card-hover':''}`}>
                {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-primary-600 text-white px-3 py-1 text-xs">{plan.badge}</div>}
                <h3 className="font-display font-bold text-xl text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{plan.desc}</p>
                <div className="mb-6"><span className="text-4xl font-display font-bold text-slate-900">{plan.price}</span><span className="text-slate-500 text-sm ml-1">{plan.per}</span></div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f=>(
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight?'text-primary-600':'text-emerald-500'}`}/>{f}
                    </li>
                  ))}
                </ul>
                <Link to={plan.href} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${plan.highlight?'btn-primary w-full justify-center':'btn-secondary w-full justify-center'}`}>
                  {plan.cta}<ArrowRight className="w-4 h-4"/>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="table-container max-w-4xl mx-auto">
              <table className="table">
                <thead>
                  <tr><th>Material</th><th className="text-center">100+ pcs</th><th className="text-center">500+ pcs</th><th className="text-center">1000+ pcs</th><th className="text-center">5000+ pcs</th></tr>
                </thead>
                <tbody>
                  {BULK.map(row=>(
                    <tr key={row.m}>
                      <td className="font-semibold text-slate-800">{row.m}</td>
                      <td className="text-center">₹{row.p100}</td>
                      <td className="text-center text-emerald-600 font-medium">₹{row.p500}</td>
                      <td className="text-center text-emerald-700 font-semibold">₹{row.p1000}</td>
                      <td className="text-center text-emerald-800 font-bold">₹{row.p5000}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-start gap-2 mt-4 max-w-4xl mx-auto">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5"/>
              <p className="text-xs text-slate-500">* Prices are indicative (₹/gram). May vary based on size, complexity & finishing. Contact us for a custom quote.</p>
            </div>
            <div className="text-center mt-8">
              <Link to="/contact" className="btn-primary">Request Custom Bulk Quote</Link>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-5xl mx-auto">
          {[{t:'Shipping',d:'Free on orders above ₹999. Standard ₹99 for smaller orders.'},{t:'GST',d:'18% GST applies to all orders as per Indian tax regulations.'},{t:'Custom Designs',d:'Upload STL/OBJ and get a quote within 24 hours.'}].map(({t,d})=>(
            <div key={t} className="card p-5"><h4 className="font-display font-semibold text-slate-800 mb-1.5">{t}</h4><p className="text-slate-500 text-sm">{d}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}
