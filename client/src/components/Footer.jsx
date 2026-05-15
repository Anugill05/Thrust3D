import { Link } from 'react-router-dom'
import { Printer, Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <span className="font-display font-bold text-xl text-white">Thrust<span className="text-primary-400">3D</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">Bringing your ideas to life with precision 3D printing. High quality, fast turnaround for creators, innovators & businesses.</p>
            <div className="space-y-2 text-sm">
              <a href="tel:+917389830287" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors"><Phone className="w-4 h-4 text-primary-400" />+91 73898 30287</a>
              <a href="mailto:Thrust3dofficial@gmail.com" className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors"><Mail className="w-4 h-4 text-primary-400" />Thrust3dofficial@gmail.com</a>
              <div className="flex items-start gap-2.5 text-slate-400">
                   <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                   <span>
                     Thrust 3D<br />
                      Second Floor, MK Apartment<br />
                      Jazzy Property, Behind LPU<br />
                      Phagwara, Punjab – 144411<br />
                     India
                   </span>
               </div>
            </div>
            <div className="flex gap-3 mt-5">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/thrust3dofficial?igsh=MWdldmhidWl1MDEwaA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-slate-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                {/* Twitter (unchanged for now) */}
                <a
                  href="#"
                  className="w-9 h-9 bg-slate-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/thrust-3d-b6228a409/?skipRedirect=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-slate-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

</div>
          </div>
          {[
            { title:'Quick Links', links:[{to:'/',l:'Home'},{to:'/products',l:'Products'},{to:'/pricing',l:'Pricing'},{to:'/upload',l:'Upload Design'},{to:'/about',l:'About Us'}] },
            { title:'Services', links:[{to:'/products?category=Prototypes',l:'Prototyping'},{to:'/products?category=Industrial Parts',l:'Industrial Parts'},{to:'/products?category=Custom Orders',l:'Custom Orders'},{to:'/products?category=Home Decor',l:'Home Décor'}] },
            { title:'Support', links:[{to:'/faq',l:'FAQ'},{to:'/contact',l:'Contact Us'},{to:'/orders',l:'Track Order'}] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white font-semibold font-display mb-4">{title}</h4>
              <ul className="space-y-2.5">{links.map(({ to, l }) => <li key={l}><Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors">{l}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Thrust3d. All rights reserved.</p>
          <div className="flex gap-5 text-sm text-slate-500">
            <a href="/privacy-policy.pdf" target="_blank" rel="noopener noreferrer"
                className="hover:text-slate-300 transition-colors">
                Privacy Policy
            </a>

            <a href="/terms-and-conditions.pdf" target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors">
              Terms and Conditions
            </a>

            <a href="/refund-policy.pdf" target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
