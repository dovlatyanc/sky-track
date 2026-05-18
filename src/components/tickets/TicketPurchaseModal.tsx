import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { X, User, Phone, Mail, IdCard } from 'lucide-react'

interface TicketPurchaseModalProps {
  ticket: any
  onClose: () => void
  onSuccess: () => void
}

export function TicketPurchaseModal({ ticket, onClose, onSuccess }: TicketPurchaseModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    passportNumber: '',
    email: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const purchase = trpc.orders.processTicket.useMutation({
    onSuccess: () => {
      onSuccess()
      onClose()
    },
    onError: (error) => {
      alert(`Error: ${error.message}`)
    }
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    
    if (formData.passportNumber && formData.passportNumber.length < 6) {
      newErrors.passportNumber = 'Passport number must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      purchase.mutate({
        ticketId: ticket.id,
        quantity: 1,
        customerData: formData
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-card rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">Complete Purchase</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
              <X size={20} />
            </button>
          </div>
          
          {/* Ticket info */}
          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="font-semibold">{ticket.from.code} → {ticket.to.code}</p>
            <p className="text-sm text-muted-foreground">{ticket.airline} · {ticket.flightNumber}</p>
            <p className="text-sm text-muted-foreground">{ticket.duration}</p>
            <p className="text-lg font-bold text-primary mt-2">{ticket.price.toLocaleString()} ₽</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <User size={14} className="inline mr-1" /> Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full p-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.fullName ? 'border-red-500' : 'border-input'
                }`}
                placeholder="Ivan Ivanov"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                <Phone size={14} className="inline mr-1" /> Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full p-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? 'border-red-500' : 'border-input'
                }`}
                placeholder="+7 999 123-45-67"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                <Mail size={14} className="inline mr-1" /> Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full p-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? 'border-red-500' : 'border-input'
                }`}
                placeholder="ivan@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
             <label className="block text-sm font-medium mb-1">
                <IdCard size={14} className="inline mr-1" /> Passport Number (optional)
            </label>
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                className={`w-full p-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.passportNumber ? 'border-red-500' : 'border-input'
                }`}
                placeholder="AB1234567"
              />
              {errors.passportNumber && <p className="text-red-500 text-xs mt-1">{errors.passportNumber}</p>}
            </div>
            
            <button
              type="submit"
              disabled={purchase.isPending}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {purchase.isPending ? 'Processing...' : `Pay ${ticket.price.toLocaleString()} ₽`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}