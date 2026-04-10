export function correctCity(city: string | undefined): string | null {
	if (!city) return null

	const parts = city.split(/,|\(/)
	const name = parts[0].trim()

	return name || null
}
