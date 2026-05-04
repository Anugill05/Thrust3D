import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Upload, CheckCircle, FileText, Trash2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { PageHeader } from '../components/common'

const ALLOWED = ['.stl','.obj','.3mf','.step','.iges','.sat']

export default function UploadPage() {
  const { isAuthenticated } = useSelector(s=>s.auth)
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(null)
  const [notes, setNotes] = useState('')

  const onDrop = useCallback(accepted => {
    if (!accepted.length) return
    const f = accepted[0]
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (!ALLOWED.includes(ext)) return toast.error('Unsupported file. Allowed: ' + ALLOWED.join(', '))
    if (f.size > 100 * 1024 * 1024) return toast.error('File too large. Max 100MB.')
    setFile(f); setDone(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

  const handleUpload = async () => {
    if (!file) return toast.error('Select a file first.')
    if (!isAuthenticated) { toast('Please login to upload.', {icon:'ℹ️'}); navigate('/login'); return }
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const { data } = await api.post('/upload/design', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setDone(data.file); toast.success('Design uploaded! Our team will review and contact you.')
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed.') }
    finally { setUploading(false) }
  }

  const fmt = (b) => b > 1048576 ? (b/1048576).toFixed(2)+' MB' : (b/1024).toFixed(1)+' KB'

  return (
    <div>
      <PageHeader breadcrumb="Home / Upload" title="Upload Your Design" subtitle="Upload your 3D design file and get a personalized quote within 24 hours." />
      <div className="page-container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[{n:1,label:'Upload',desc:'Upload your 3D model'},{n:2,label:'Review',desc:'Team reviews your model'},{n:3,label:'Get Quote',desc:'Receive price & timeline'}].map(({n,label,desc})=>(
              <div key={n} className={`card p-4 text-center ${n===1?'border-primary-200 bg-primary-50':''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold ${n===1?'bg-primary-600 text-white':'bg-slate-100 text-slate-500'}`}>{n}</div>
                <div className="font-semibold text-slate-800 text-sm">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
            ))}
          </div>

          <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 mb-6 ${isDragActive?'border-primary-500 bg-primary-50':'border-slate-200 hover:border-primary-400 hover:bg-slate-50 bg-white'}`}>
            <input {...getInputProps()} />
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary-600"/>
            </div>
            {isDragActive
              ? <p className="text-primary-600 font-semibold text-lg">Drop your file here...</p>
              : <><p className="text-slate-700 font-semibold text-lg mb-1">Drag & drop your file here</p><p className="text-slate-400 text-sm mb-4">or</p><span className="btn-primary inline-flex">Choose File</span></>
            }
            <p className="text-xs text-slate-400 mt-4">Supported: {ALLOWED.join(', ')} • Max 100MB</p>
          </div>

          {file && !done && (
            <div className="card p-4 flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5 text-primary-600"/></div>
              <div className="flex-1 min-w-0"><p className="font-semibold text-slate-800 text-sm truncate">{file.name}</p><p className="text-xs text-slate-500">{fmt(file.size)}</p></div>
              <button onClick={()=>setFile(null)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4"/></button>
            </div>
          )}

          {done && (
            <div className="card p-4 flex items-center gap-4 mb-6 bg-emerald-50 border-emerald-200">
              <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0"/>
              <div><p className="font-semibold text-emerald-800">File uploaded!</p><p className="text-sm text-emerald-600">{done.originalName} – Our team will review and contact you.</p></div>
            </div>
          )}

          <div className="mb-6">
            <label className="label">Special Instructions (optional)</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4}
              placeholder="Quantity, material preference, color, finishing, delivery timeline..." className="input-field resize-none"/>
          </div>

          {!isAuthenticated && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5"/>
              <span>You need to <Link to="/login" className="font-semibold underline">login</Link> to upload your design file.</span>
            </div>
          )}

          <button onClick={handleUpload} disabled={!file||uploading||!!done} className="btn-primary w-full py-3.5 text-base disabled:opacity-50">
            {uploading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Uploading...</>
              : done ? <><CheckCircle className="w-5 h-5"/>Uploaded Successfully</>
              : <><Upload className="w-5 h-5"/>Submit Request</>}
          </button>
        </div>
      </div>
    </div>
  )
}
