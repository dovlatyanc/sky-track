import { useCart } from '@/hooks/useCart'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router'
import { useNavigate } from 'react-router'
import { trpc } from '@/lib/trpc'

export function Cart() {
  const { cart, updateQuantity, removeItem, clearCart, isLoading,refetch } = useCart()
  
  const navigate = useNavigate()

  const checkout = trpc.cart.checkout.useMutation({
    onSuccess: (order) => {
      alert(`Order #${order.id.slice(0, 8)} created!`)
      refetch()
      navigate('/shop/orders')
    },
    onError: (error) => {
      alert(`Error: ${error.message}`)
    }
})
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ShopSidebar />
        <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading cart...</div>
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
            <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground text-center mb-6">
              Looks like you haven't added any tickets to your cart yet.
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Tickets
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
          <h1 className="text-xl font-bold text-foreground lg:text-2xl">Your Cart</h1>
          <button
            onClick={() => clearCart.mutate({})}
            className="text-sm text-destructive hover:underline flex items-center gap-1"
          >
            <Trash2 size={16} /> Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {cart.items.map((item: any) => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-4">
              {/* Маршрут */}
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
              
              {/* Управление количеством */}
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
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          ))}
          
          {/* Итого */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{cart.totalAmount.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span>{cart.itemCount}</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 mb-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{cart.totalAmount.toLocaleString()} ₽</span>
              </div>
            </div>
            <button
              onClick={() => checkout.mutate({})}
              disabled={checkout.isPending}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {checkout.isPending ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}