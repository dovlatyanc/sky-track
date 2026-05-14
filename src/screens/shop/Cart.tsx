import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { trpc } from '@/lib/trpc'
import { useAuth } from '@/hooks/useAuth'
import { PaymentForm } from '@/components/payment/PaymentForm'
import { useTranslation } from 'react-i18next'

export function Cart() {
  const { t } = useTranslation('cart')
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, updateQuantity, removeItem, clearCart, isLoading, refetch, guestId } = useCart()
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    passportNumber: '',
    email: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const checkout = trpc.cart.checkout.useMutation({
    onSuccess: (data) => {
      console.log('Order created:', data)
      console.log('Order ID:', data.orderId)
      refetch()
      navigate(`/shop/success?orderId=${data.orderId}`)
    },
    onError: (error) => {
      console.error('Checkout error:', error)
      alert(`Error: ${error.message}`)
      setShowPayment(false)
    }
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('name_required')
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = t('name_min_length')
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('phone_required')
    } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = t('phone_invalid')
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('email_required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('email_invalid')
    }
    
    if (formData.passportNumber && formData.passportNumber.length < 6) {
      newErrors.passportNumber = t('passport_min_length')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePaymentSuccess = async () => {
    try {
      const result = await checkout.mutateAsync({
        guestId: !user ? guestId || undefined : undefined,
        customerData: formData
      })
      console.log('✅ Order created:', result)
      console.log('✅ Order ID:', result.orderId)
      refetch()
      navigate(`/shop/success?orderId=${result.orderId}`)
    } catch (error) {
      console.error('❌ Order creation failed:', error)
      setShowPayment(false)
    }
  }

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setShowPayment(true)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ShopSidebar />
        <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">{t('loading')}</div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <ShopSidebar />
        <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <ShoppingBag size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('empty_title')}</h2>
            <p className="text-muted-foreground text-center mb-6">
              {t('empty_message')}
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {t('browse_tickets')}
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  const handleUpdateQuantity = (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change
    if (newQuantity <= 0) {
      removeItem.mutate({ itemId })
    } else {
      updateQuantity.mutate({ itemId, quantity: newQuantity })
    }
  }
  
  return (
    <div className="min-h-screen bg-background">
      <ShopSidebar />
      
      <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-foreground lg:text-2xl">{t('your_cart')}</h1>
          <button
            onClick={() => clearCart.mutate({})}
            className="text-sm text-destructive hover:underline flex items-center gap-1"
          >
            <Trash2 size={16} /> {t('clear_all')}
          </button>
        </div>
        
        {!showCheckoutForm ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {cart.items.map((item: any) => (
                <div key={item.id} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-lg">{item.ticket?.from?.code || '???'}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-bold text-lg">{item.ticket?.to?.code || '???'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.ticket?.airline} · {item.ticket?.flightNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.ticket?.from?.city} → {item.ticket?.to?.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">
                        {(item.price * item.quantity).toLocaleString()} ₽
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.price.toLocaleString()} ₽ each
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem.mutate({ itemId: item.id })}
                      className="text-destructive hover:underline flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={16} /> {t('remove')}
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="text-lg font-semibold mb-4">{t('order_summary')}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('subtotal')}</span>
                    <span>{cart.totalAmount.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('items')}</span>
                    <span>{cart.itemCount}</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>{t('total')}</span>
                    <span>{cart.totalAmount.toLocaleString()} ₽</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {t('proceed_to_checkout')}
                </button>
              </div>
            </div>
          </>
        ) : !showPayment ? (
          <div className="max-w-md mx-auto bg-card rounded-xl border border-border p-6">
            <h2 className="text-2xl font-bold mb-4">{t('complete_purchase')}</h2>
            
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="font-semibold">{t('order_summary')}</p>
              <p className="text-lg font-bold text-primary mt-2">{cart.totalAmount.toLocaleString()} ₽</p>
              <p className="text-sm text-muted-foreground">{t('items')}: {cart.itemCount}</p>
            </div>
            
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('full_name')}</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full p-2 bg-background border rounded-lg ${
                    errors.fullName ? 'border-red-500' : 'border-input'
                  }`}
                  placeholder={t('full_name_placeholder')}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('phone')}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full p-2 bg-background border rounded-lg ${
                    errors.phone ? 'border-red-500' : 'border-input'
                  }`}
                  placeholder={t('phone_placeholder')}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('email')}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-2 bg-background border rounded-lg ${
                    errors.email ? 'border-red-500' : 'border-input'
                  }`}
                  placeholder={t('email_placeholder')}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('passport_number')}</label>
                <input
                  type="text"
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                  className="w-full p-2 bg-background border border-input rounded-lg"
                  placeholder={t('passport_placeholder')}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="flex-1 py-2 bg-secondary text-secondary-foreground rounded-lg"
                >
                  {t('back')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {t('continue_to_payment')}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <PaymentForm
            amount={cart.totalAmount}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        )}
      </div>
    </div>
  )
}