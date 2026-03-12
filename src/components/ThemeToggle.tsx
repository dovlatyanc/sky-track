import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/providers/theme/useTheme'

import { Button } from './ui/button'

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme()

	return (
		<>
			<Button
				onClick={() => {
					toggleTheme()
				}}
				variant='secondary'
				size='icon'
			>
				{/* <button
			
				className='bg-card flex items-center justify-center rounded-full p-2 transition-colors hover:bg-neutral-700 sm:p-1'
			> */}
				{theme === 'dark' ? <Moon size={23} /> : <Sun size={23} />}
				{/* </button> */}
			</Button>
		</>
	)
}
