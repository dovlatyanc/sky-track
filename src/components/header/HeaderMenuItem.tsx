import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import type { IHeaderMenuItem } from './header-menu.data'

interface Props {
  item: IHeaderMenuItem
  isActive?: boolean
}

export function HeaderMenuItem({ item, isActive }: Props) {
  return (
    <li>
      <Link
        to={item.href}
        className={cn(
          'text-sm font-medium transition-colors hover:text-primary',
          isActive ? 'text-primary' : 'text-foreground'
        )}
      >
        {item.label}
      </Link>
    </li>
  )
}