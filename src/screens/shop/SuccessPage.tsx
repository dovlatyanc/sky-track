import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { CheckCircle, Ticket, Mail, Home } from 'lucide-react'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { trpc } from '@/lib/trpc'

export function SuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get('orderId')
  
  const { data: order, isLoading, error } = trpc.orders.getOrderByIdPublic.useQuery(
    { orderId: orderId || '' },
    { enabled: !!orderId }
  )
  
  useEffect(() => {
    if (!orderId) {
      navigate('/shop')
    }
  }, [orderId, navigate])
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ShopSidebar />
        <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading order details...</div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <ShopSidebar />
        <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold text-foreground mb-2">Order not found</h2>
            <p className="text-muted-foreground mb-4">We couldn't find your order details</p>
            <Link to="/shop" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      <ShopSidebar />
      
      <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
        <div className="max-w-2xl mx-auto">
          {/* Успех */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your order has been confirmed and ticket has been sent to your email.
            </p>
          </div>
          
          {/* Информация о заказе */}
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
            <div className="p-5 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Order Details</h2>
              <p className="text-sm text-muted-foreground">Order ID: {order.id.slice(0, 12)}</p>
            </div>
            
            <div className="p-5 space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">
                      {item.ticket?.from?.code} → {item.ticket?.to?.code}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.ticket?.airline} · {item.ticket?.flightNumber}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.ticket?.departureTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {(item.price * item.quantity).toLocaleString()} ₽
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x {item.price.toLocaleString()} ₽
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total paid</span>
                  <span className="text-primary">
                    {order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0).toLocaleString()} ₽
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Информация о пассажире */}
          {(order as any).passengerData && (
            <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
              <div className="p-5 border-b border-border bg-muted/30">
                <h2 className="font-semibold text-foreground">Passenger Information</h2>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Name</span>
                  <span className="text-foreground font-medium">{(order as any).passengerData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="text-foreground">{(order as any).passengerData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground">{(order as any).passengerData.email}</span>
                </div>
                {(order as any).passengerData.passportNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passport Number</span>
                    <span className="text-foreground">{(order as any).passengerData.passportNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/shop"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Home size={18} />
              Continue Shopping
            </Link>
          </div>
          
          {/* Email уведомление */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={16} />
              <span>Ticket confirmation has been sent to your email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}