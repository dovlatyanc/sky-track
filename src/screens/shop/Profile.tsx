import { CenterLayout } from '@/components/CenterLayout'
import { Heading } from '@/components/custom-ui/Heading'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { Profile } from '@/screens/profile/Profile' 

export function ShopProfile() {
  return (
    <CenterLayout>
      <div className="w-full px-3">
        <Heading>My Profile</Heading>
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <ShopSidebar />
          <div className="flex-1">
            <Profile />
          </div>
        </div>
      </div>
    </CenterLayout>
  )
}