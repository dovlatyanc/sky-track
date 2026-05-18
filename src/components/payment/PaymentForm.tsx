import { useState } from 'react'
import { CreditCard, Calendar, Lock, User} from 'lucide-react'

interface PaymentFormProps {
  amount: number
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentForm({ amount, onSuccess, onCancel }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Форматирование номера карты (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '').slice(0, 16)
    const groups = cleaned.match(/.{1,4}/g) || []
    return groups.join(' ')
  }

  // Форматирование даты (MM/YY)
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4)
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
    }
    return cleaned
  }

  // Валидация
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Enter valid 16-digit card number'
    }
    
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = 'Enter valid expiry date (MM/YY)'
    }
    
    if (!cvv.match(/^\d{3}$/)) {
      newErrors.cvv = 'Enter valid CVV (3 digits)'
    }
    
    if (!cardHolder.trim() || cardHolder.length < 3) {
      newErrors.cardHolder = 'Enter cardholder name'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsProcessing(true)
    
    // Симуляция обработки платежа
    setTimeout(() => {
      setIsProcessing(false)
      onSuccess()
    }, 2000)
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-foreground mb-4">Payment Details</h3>
      
      {/* Сумма */}
      <div className="bg-primary/5 rounded-lg p-4 mb-6 text-center">
        <p className="text-sm text-muted-foreground mb-1">Total to pay</p>
        <p className="text-3xl font-bold text-primary">{amount.toLocaleString()} ₽</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Номер карты */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              className={`w-full px-4 py-2 pl-10 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.cardNumber ? 'border-red-500' : 'border-input'
              }`}
              disabled={isProcessing}
            />
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
        </div>

        {/* Дата и CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Expiry Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                className={`w-full px-4 py-2 pl-10 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.expiryDate ? 'border-red-500' : 'border-input'
                }`}
                disabled={isProcessing}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              CVV
            </label>
            <div className="relative">
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                className={`w-full px-4 py-2 pl-10 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.cvv ? 'border-red-500' : 'border-input'
                }`}
                disabled={isProcessing}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
          </div>
        </div>

        {/* Держатель карты */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Cardholder Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              placeholder="IVAN IVANOV"
              className={`w-full px-4 py-2 pl-10 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.cardHolder ? 'border-red-500' : 'border-input'
              }`}
              disabled={isProcessing}
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${amount.toLocaleString()} ₽`
            )}
          </button>
        </div>
      </form>

      {/* Безопасность */}
      <div className="mt-4 pt-4 border-t border-border text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>Secure payment. Test mode — no real charges</span>
        </div>
      </div>
    </div>
  )
}