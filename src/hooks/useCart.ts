import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc'
import { useAuth } from './useAuth'

export function useCart() {
  const { user } = useAuth()
  const [guestId, setGuestId] = useState<string | null>(null)
  
  // Получаем guestId из localStorage (только если нет пользователя)
  useEffect(() => {
    if (user) return // Если пользователь авторизован, не используем guestId
    
    let id = localStorage.getItem('guestId')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('guestId', id)
    }
    setGuestId(id)
  }, [user])
  
  const utils = trpc.useUtils()
  
  // Получаем корзину (передаём userId если есть, иначе guestId)
  const { data: cart, refetch, isLoading } = trpc.cart.getCart.useQuery(
    { 
      guestId: !user ? guestId || undefined : undefined,
      // userId передаётся через контекст (ctx.userId)
    },
    { enabled: !user ? !!guestId : true }
  )
  
  // Добавление в корзину
  const addItem = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      refetch()
      utils.cart.getCart.invalidate()
    }
  })
  
  // Обновление количества
  const updateQuantity = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => {
      refetch()
      utils.cart.getCart.invalidate()
    }
  })
  
  // Удаление товара
  const removeItem = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      refetch()
      utils.cart.getCart.invalidate()
    }
  })
  
  // Очистка корзины
  const clearCart = trpc.cart.clearCart.useMutation({
    onSuccess: () => {
      refetch()
      utils.cart.getCart.invalidate()
    }
  })
  
  // Функция добавления в корзину
  const addToCart = (ticketId: string, quantity: number = 1) => {
    if (!user && !guestId) {
      console.error('No user and no guestId')
      return
    }
    addItem.mutate({ 
      ticketId, 
      quantity, 
      guestId: !user ? guestId || undefined : undefined 
    })
  }
  
  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    isAdding: addItem.isPending,
    isUpdating: updateQuantity.isPending,
    guestId: !user ? guestId : null,
    refetch
  }
}