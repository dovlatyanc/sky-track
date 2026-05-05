import { useAuth } from '@/hooks/useAuth'
import { trpc } from '@/lib/trpc'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { Package, Calendar, CreditCard, MapPin } from 'lucide-react'
import { format } from 'date-fns'

export function Orders() {
  const { user } = useAuth()
  const { data: orders, isLoading } = trpc.orders.getUserOrders.useQuery(undefined, {
    enabled: !!user
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <ShopSidebar />
        <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <p className="text-muted-foreground mb-4">Please login to view your orders</p>
            <a href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              Sign In
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ShopSidebar />
        <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading orders...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <ShopSidebar />
        <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Package size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground text-center mb-6">
              You haven't placed any orders yet.
            </p>
            <a href="/shop" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg">
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500'
      case 'confirmed': return 'bg-blue-500/20 text-blue-500'
      case 'delivered': return 'bg-green-500/20 text-green-500'
      case 'cancelled': return 'bg-red-500/20 text-red-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'confirmed': return 'Confirmed'
      case 'delivered': return 'Delivered'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopSidebar />
      
      <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">View and track your orders</p>
        </div>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Заголовок заказа */}
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-4">
                    <Package size={20} className="text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Order #{order.id.slice(0, 8)}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        <span>{format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Товары в заказе */}
              <div className="p-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {item.ticket?.from?.code || '???'} → {item.ticket?.to?.code || '???'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.ticket?.airline} · {item.ticket?.flightNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.ticket?.from?.city} → {item.ticket?.to?.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {(item.price * item.quantity).toLocaleString()} ₽
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {item.price.toLocaleString()} ₽
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Итого */}
              <div className="p-4 border-t border-border bg-muted/20">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total amount</span>
                  <span className="font-bold text-lg text-primary">
                    {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()} ₽
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}