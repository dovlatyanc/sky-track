export function normalizeFlightStatus(
	progress: number,
	liveSpeed: number,
	liveAltitude: number
) {
	if (progress <= 0 || progress >= 100) {
		const fakeProgress = Math.floor(Math.random() * 80) + 10 // 10–90%
		const fakeSpeed = Math.floor(Math.random() * 800) + 400 // 400–1200 km/h
		const fakeAltitude = Math.floor(Math.random() * 8000) + 2000 // 2–10 km
		return {
			progress: fakeProgress,
			speed: fakeSpeed,
			altitude: fakeAltitude
		}
	}

	return {
		progress,
		speed: liveSpeed,
		altitude: liveAltitude
	}
}
