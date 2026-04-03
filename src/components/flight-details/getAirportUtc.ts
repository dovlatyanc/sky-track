export function getUtcOffsetFromTimezone(timezone: string): string {
	const now = new Date()
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		timeZoneName: 'short'
	})
	const parts = formatter.formatToParts(now)
	const tzPart = parts.find(p => p.type === 'timeZoneName')?.value

	return tzPart?.replace('GMT', 'UTC') ?? 'UTC+0'
}
