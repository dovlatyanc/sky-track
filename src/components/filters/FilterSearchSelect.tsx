import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface Props {
	value: string | null
	onChange: (value: string | null) => void
	data: string[]
	entityName?: string
}

// TODO: Maybe add flag for country and logo for airline
export function FilterSearchSelect({
	data,
	onChange,
	value,
	entityName
}: Props) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={isOpen}
					className='w-[180px] justify-between gap-0.5 opacity-70'
				>
					{value
						? data.find(item => item === value)
						: `Select ${entityName}...`}
					<ChevronsUpDownIcon className='h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[180px] p-0'>
				<Command>
					<CommandInput placeholder={`Search ${entityName}...`} />
					<CommandList>
						<CommandEmpty>No {entityName} found.</CommandEmpty>
						<CommandGroup>
							{data.map(item => (
								<CommandItem
									key={item}
									value={item}
									onSelect={currentValue => {
										if (currentValue === value) return onChange(null)

										onChange(currentValue)
										setIsOpen(false)
									}}
								>
									<CheckIcon
										className={cn(
											'mr-2 h-4 w-4',
											value === item ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{item}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
