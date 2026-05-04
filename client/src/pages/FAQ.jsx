import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PageHeader } from '../components/common'

const FAQS = [
  {q:'What file formats do you support?',a:'We support STL, OBJ, 3MF, STEP, IGES and SAT formats. STL and OBJ are most common. Maximum file size is 100MB per upload.'},
  {q:'What is the minimum and maximum order quantity?',a:'We accept orders starting from 1 unit. For bulk orders (100+ units) contact us for special pricing. There is no upper limit for bulk orders.'},
  {q:'How long does 3D printing take?',a:'Standard orders take 3–7 business days depending on complexity and material. Rush orders (additional charges) can be done in 1–2 days. We confirm your timeline after reviewing your design.'},
  {q:'What factors affect the price?',a:'Pricing depends on material type, object volume, support structures needed, quantity ordered, finishing requirements, and urgency. Use our pricing page as a guide or contact us for a custom quote.'},
  {q:'Do you offer design assistance?',a:'Yes! Our team can optimize your design for 3D printing (DFM) at an additional charge. Contact us to discuss your requirements.'},
  {q:'What materials are available?',a:'We offer PLA (eco-friendly), ABS (strong), PETG (chemical resistant), TPU (flexible), Nylon (industrial), and Resin SLA (ultra-detail). Each suits different applications.'},
  {q:'How is shipping handled?',a:'We ship pan-India via reputed couriers. Free shipping on orders above ₹999. Standard delivery takes 2–5 days after printing is complete. Tracking numbers provided for all orders.'},
  {q:'What payment methods do you accept?',a:'We accept all methods via Razorpay including UPI, credit/debit cards, net banking, EMI and wallets. All transactions are 100% secure.'},
  {q:'Can I get a refund or reprint?',a:'If the print has a defect due to our error, we offer a free reprint or full refund. Custom orders with approved designs cannot be refunded unless there is a print quality issue on our end.'},
  {q:'Do you ship internationally?',a:'Currently we ship within India only. International shipping will be available soon. Follow us on social media for updates.'},
]

export default function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <div>
      <PageHeader breadcrumb="Home / FAQ" title="Frequently Asked Questions" subtitle="Everything you need to know about our 3D printing services." />
      <div className="page-container py-12">
        <div className="max-w-3xl mx-auto divide-y divide-slate-100">
          {FAQS.map((faq,i)=>(
            <div key={i} className="py-4">
              <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center justify-between text-left gap-4">
                <span className="font-semibold text-slate-800 text-sm sm:text-base">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${open===i?'rotate-180':''}`}/>
              </button>
              {open===i && <p className="mt-3 text-slate-500 text-sm leading-relaxed pr-8">{faq.a}</p>}
            </div>
          ))}
        </div>
        <div className="text-center mt-10 card p-6 max-w-xl mx-auto bg-primary-50 border-primary-100">
          <p className="font-semibold text-slate-800 mb-2">Still have questions?</p>
          <p className="text-slate-500 text-sm mb-4">Our team is ready to help you via WhatsApp or email.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/contact" className="btn-primary text-sm py-2">Contact Us</a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn-secondary text-sm py-2">WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  )
}
