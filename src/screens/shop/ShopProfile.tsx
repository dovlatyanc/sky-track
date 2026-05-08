import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { Profile } from '@/screens/profile/Profile' 

export function ShopProfile() {
  return (
    <div className="min-h-screen bg-background">
      <ShopSidebar />
      
      <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
        <div className="max-w-4xl mx-auto">
          <Profile />
        </div>
      </div>
    </div>
  )
}