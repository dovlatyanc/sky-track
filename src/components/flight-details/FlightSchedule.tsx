export function FlightSchedule() {
	return (
		<div className='xs:text-sm'>
			<div className='mb-1 grid grid-cols-2 gap-1'>
				<div className='bg-card p-mini-element flex items-center justify-between'>
					<p className='text-muted-foreground'>Scheduled</p>
					<p>08:15</p>
				</div>
				<div className='bg-card p-mini-element flex items-center justify-between'>
					<p className='text-muted-foreground'>Actual</p>
					<p>08:24</p>
				</div>
			</div>
			<div className='mb-1 grid grid-cols-2 gap-1'>
				<div className='bg-card p-mini-element flex items-center justify-between rounded-bl-xl'>
					<p className='text-muted-foreground'>Scheduled</p>
					<p>08:24</p>
				</div>
				<div className='bg-card p-mini-element flex items-center justify-between rounded-br-xl'>
					<p className='text-muted-foreground'>Estimated</p>
					<p>13:23</p>
				</div>
			</div>
		</div>
	)
}
