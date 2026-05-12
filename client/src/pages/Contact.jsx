import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { PageHeader } from '../components/common'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState:{errors}, reset } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/contact', data)
      setSent(true); reset(); toast.success("Message sent! We'll reply within 24 hours.")
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send.') }
    finally { setLoading(false) }
  }

  const CONTACTS = [
    { icon:Phone, label:'Phone', value:'+91 73898 30287', href:'tel:+917389830287' },
    { icon:Mail,  label:'Email', value:'Thrust3dofficial@gmail.com', href:'mailto:Thrust3dofficial@gmail.com' },
    { icon:MapPin,label:'Address', value:'123 Innovation Drive, Tech Park, Bangalore – 560001', href:null },
    { icon:Clock, label:'Working Hours', value:'Mon–Sat: 10:00 AM – 7:00 PM', href:null },
  ]

  return (
    <div>
      <PageHeader breadcrumb="Home / Contact" title="Get In Touch" subtitle="Have a question or ready to start? We are here to help." />
      <div className="page-container py-12">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-5">
            {CONTACTS.map(({ icon:Icon, label, value, href }) => (
              <div key={label} className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5 text-primary-600"/></div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
                  {href ? <a href={href} className="text-slate-800 font-medium hover:text-primary-600 transition-colors text-sm">{value}</a>
                         : <p className="text-slate-800 font-medium text-sm">{value}</p>}
                </div>
              </div>
            ))}
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
               className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.117 1.533 5.845L0 24l6.335-1.512A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
          <div className="lg:col-span-3 card p-8">
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4"/>
                <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500">We will get back to you within 24 hours. You can also reach us on WhatsApp for faster responses.</p>
                <button onClick={()=>setSent(false)} className="btn-ghost mt-6">Send another message</button>
              </div>
            ) : (
              <>
                <h2 className="font-display font-bold text-xl text-slate-900 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Your Name *</label>
                      <input {...register('name',{required:'Required'})} className="input-field" placeholder="Rohit Sharma"/>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="label">Email *</label>
                      <input {...register('email',{required:'Required',pattern:{value:/\S+@\S+\.\S+/,message:'Invalid email'}})} type="email" className="input-field" placeholder="you@example.com"/>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div><label className="label">Phone (optional)</label><input {...register('phone')} className="input-field" placeholder="+91 98765 43210"/></div>
                  <div>
                    <label className="label">Subject *</label>
                    <input {...register('subject',{required:'Required'})} className="input-field" placeholder="Bulk Order / Custom Print / General Query"/>
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="label">Message *</label>
                    <textarea {...register('message',{required:'Required',minLength:{value:10,message:'Min 10 characters'}})} rows={5} className="input-field resize-none" placeholder="Tell us about your project, quantity, material, timeline..."/>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                    {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Sending...</> : <><Send className="w-4 h-4"/>Send Message</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
