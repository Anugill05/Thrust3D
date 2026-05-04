import api from './api'
import toast from 'react-hot-toast'

export const initiatePayment = async ({ orderId, user, onSuccess, onFailure }) => {
  try {
    const { data } = await api.post('/payments/create-order', { orderId })
    if (!data.success) throw new Error(data.message)

    if (data.mock) {
      const tid = toast.loading('Processing payment...')
      await new Promise(r => setTimeout(r, 1500))
      const verify = await api.post('/payments/verify', {
        orderId, razorpay_order_id: data.razorpayOrder.id,
        razorpay_payment_id: 'pay_mock_' + Date.now(), razorpay_signature: 'mock_sig'
      })
      toast.dismiss(tid)
      if (verify.data.success) { toast.success('Payment successful! 🎉'); onSuccess?.(verify.data.order) }
      return
    }

    const options = {
      key: data.key, amount: data.razorpayOrder.amount, currency: 'INR',
      name: 'Print3D', description: 'Order Payment', order_id: data.razorpayOrder.id,
      prefill: { name: user?.name || '', email: user?.email || '', contact: user?.phone || '' },
      theme: { color: '#4f46e5' },
      handler: async (resp) => {
        const verify = await api.post('/payments/verify', {
          orderId, razorpay_order_id: resp.razorpay_order_id,
          razorpay_payment_id: resp.razorpay_payment_id, razorpay_signature: resp.razorpay_signature
        })
        if (verify.data.success) { toast.success('Payment successful! 🎉'); onSuccess?.(verify.data.order) }
        else { toast.error('Verification failed.'); onFailure?.() }
      },
      modal: { ondismiss: () => { toast('Payment cancelled.', { icon: 'ℹ️' }); onFailure?.() } }
    }
    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', () => { toast.error('Payment failed.'); onFailure?.() })
    rzp.open()
  } catch (err) { toast.error(err.response?.data?.message || 'Payment failed.'); onFailure?.() }
}

export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
