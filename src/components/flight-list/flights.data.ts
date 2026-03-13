import type { IFlight } from '../../types/flight.types'

export const FLIGHTS: IFlight[] = [
	{
		logo: '/logos/turkish.svg',
		id: 'TK143',
		airline: {
			name: 'Turkish Airlines',
			country: 'Turkey'
		},
		aircraftReg: 'TC-JFP',
		from: {
			city: 'Sofia',
			country: 'Bulgaria',
			countryCode: 'BG',
			timezone: 'UTC +3',
			code: 'SOF'
		},
		to: {
			city: 'Beijing',
			country: 'China',
			countryCode: 'CN',
			timezone: 'UTC +8',
			code: 'PEK'
		},
		airplane: {
			image: '/planes/turkish.png',
			name: 'Airbus A330'
		},
		colorGradient: ['#f9b9b9', '#d34f4f'],
		route: {
			speed: 870,
			altitude: 10600
		},
		progress: 73
	},
	{
		logo: '/logos/ryanair.svg',
		id: 'RN1782',
		airline: {
			name: 'Ryanair',
			country: 'Ireland'
		},
		aircraftReg: 'D-AISP',
		from: {
			city: 'Dublin',
			country: 'Ireland',
			countryCode: 'IE',
			timezone: 'UTC +1',
			code: 'DUB'
		},
		to: {
			city: 'Larnaca',
			country: 'Cyprus',
			countryCode: 'CY',
			timezone: 'UTC +3',
			code: 'LCA'
		},
		airplane: {
			image: '/planes/ryanair.png',
			name: 'Boeing 737-800'
		},
		colorGradient: ['#accffb', '#5281b1'],
		route: {
			speed: 840,
			altitude: 11200
		},
		progress: 50
	},
	{
		logo: '/logos/s7.svg',
		id: 'S7124',
		airline: { name: 'S7 Airlines', country: 'Russia' },
		aircraftReg: 'RA-73415',
		from: {
			city: 'Nice',
			country: 'France',
			countryCode: 'FR',
			timezone: 'UTC +2',
			code: 'NCE'
		},
		to: {
			city: 'Tbilisi',
			country: 'Georgia',
			countryCode: 'GE',
			timezone: 'UTC +4',
			code: 'TBS'
		},
		airplane: {
			image: '/planes/s7.png',
			name: 'Airbus A320neo'
		},
		colorGradient: ['#f0ffdd', '#d2f3ab'],
		route: {
			speed: 860,
			altitude: 10900
		},
		progress: 68
	},
	{
		logo: '/logos/swiss.svg',
		id: 'LX318',
		airline: {
			name: 'SWISS International Air Lines',
			country: 'Switzerland'
		},
		aircraftReg: 'HB-JHK',
		from: {
			city: 'Porto',
			country: 'Portugal',
			countryCode: 'PT',
			timezone: 'UTC +1',
			code: 'OPO'
		},
		to: {
			city: 'Baku',
			country: 'Azerbaijan',
			countryCode: 'AZ',
			timezone: 'UTC +4',
			code: 'GYD'
		},
		airplane: {
			image: '/planes/swiss.png',
			name: 'Airbus A220-300'
		},
		colorGradient: ['#ffc7c7', '#cc6565'],
		route: {
			speed: 830,
			altitude: 10700
		},
		progress: 85
	},
	{
		logo: '/logos/lufthansa.svg',
		id: 'LH401',
		airline: { name: 'Lufthansa', country: 'Germany' },
		aircraftReg: 'D-AIXD',
		from: {
			city: 'Burgas',
			country: 'Bulgaria',
			countryCode: 'BG',
			timezone: 'UTC +3',
			code: 'BOJ'
		},
		to: {
			city: 'Muscat',
			country: 'Oman',
			countryCode: 'OM',
			timezone: 'UTC +4',
			code: 'MCT'
		},
		airplane: {
			image: '/planes/lufthansa.png',
			name: 'Airbus A350-900'
		},
		colorGradient: ['#b7cff7', '#5879ac'],
		route: {
			speed: 890,
			altitude: 11300
		},
		progress: 48
	}
]
