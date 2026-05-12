import { CheckCircle, Users, Award, Zap } from 'lucide-react'
import { PageHeader } from '../components/common'

export default function About() {
  return (
    <div>
      <PageHeader breadcrumb="Home / About Us" title="About Us" subtitle="We are passionate about turning ideas into reality." />
      <div className="page-container py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="divider"/>
            <h2 className="section-heading mb-4">Technology meets craftsmanship</h2>
            <p className="text-slate-500 leading-relaxed mb-4">At Thrust3D, we combine technology, expertise and creativity to deliver outstanding 3D printing solutions. From prototypes to functional parts, we help individuals and businesses bring their ideas to life.</p>
            <p className="text-slate-500 leading-relaxed mb-6">Founded in 2020, we have helped over 500 clients — from individual creators to Fortune 500 companies — realize their vision through precision 3D printing. We operate state-of-the-art FDM and SLA printers capable of achieving tolerances as fine as 50 microns.</p>
            <div className="space-y-2">
              {['ISO-quality processes','Eco-friendly materials','99% on-time delivery','24/7 customer support'].map(f=>(
                <div key={f} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="w-4 h-4 text-primary-600"/>{f}</div>
              ))}
            </div>
          </div>
          <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden">
            <img src="https://placehold.co/640x360/e2e8f0/475569?text=Our+3D+Printing+Facility" alt="Facility" className="w-full h-full object-cover"/>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[{icon:Award,value:'1000+',label:'Projects Completed'},{icon:Users,value:'500+',label:'Happy Clients'},{icon:Zap,value:'99%',label:'On-time Delivery'},{icon:CheckCircle,value:'4.9/5',label:'Customer Rating'}].map(({icon:Icon,value,label})=>(
            <div key={label} className="card p-5 text-center">
              <Icon className="w-8 h-8 text-primary-600 mx-auto mb-2"/>
              <div className="text-3xl font-display font-bold text-slate-900">{value}</div>
              <div className="text-slate-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
        <div className="card p-8 bg-primary-50 border-primary-100 text-center">
          <h3 className="section-heading mb-3">Ready to work with us?</h3>
          <p className="text-slate-500 mb-6">Upload your design or get in touch for a custom quote.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/upload" className="btn-primary">Upload Design</a>
            <a href="/contact" className="btn-secondary">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}
