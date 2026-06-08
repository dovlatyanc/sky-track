import type { IFlight } from '../types/flight.types'
import { AIRLINE_ASSETS } from './airline-assets.data'

type TGetFlightSchedule = {
  departure: {
    scheduled: { iso: string; localTime: string }
    actual: { iso: string; localTime: string }
  }
  arrival: {
    scheduled: { iso: string; localTime: string }
    actual: { iso: string; localTime: string }
  }
}

function createSchedule(departureHoursFromNow: number, arrivalHoursFromNow: number): TGetFlightSchedule {
  const departureDate = new Date(Date.now() + departureHoursFromNow * 60 * 60 * 1000)
  const arrivalDate = new Date(Date.now() + arrivalHoursFromNow * 60 * 60 * 1000)
  
  // Короткий формат: DD.MM HH:MM
  const formatShort = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  
  return {
    departure: {
      scheduled: { 
        iso: departureDate.toISOString(), 
        localTime: formatShort(departureDate) 
      },
      actual: { 
        iso: departureDate.toISOString(), 
        localTime: formatShort(departureDate) 
      }
    },
    arrival: {
      scheduled: { 
        iso: arrivalDate.toISOString(), 
        localTime: formatShort(arrivalDate) 
      },
      actual: { 
        iso: arrivalDate.toISOString(), 
        localTime: formatShort(arrivalDate) 
      }
    }
  }
}

function createMockFlight(
  airlineName: string,
  data: Partial<IFlight> & { 
    departureHours?: number; 
    arrivalHours?: number; 
    currentLat?: number; 
    currentLng?: number;
    progressPercent?: number;  
  }
): IFlight {
  const assets = AIRLINE_ASSETS.find(a => a.name === airlineName)
  
  if (!assets) {
    throw new Error(`Airline assets not found for: ${airlineName}`)
  }
  
  const schedule = createSchedule(
    data.departureHours || 2,
    data.arrivalHours || 8
  )
  
  // progressPercent уже в процентах (0-100)
  const progress = data.progressPercent ?? 50
  
  return {
    id: data.id || 'unknown',
    number: data.number || '000',
    icao: data.icao || 'XXX000',
    airline: { name: airlineName },
    assets,
    from: data.from!,
    to: data.to!,
    route: {
      ...data.route!,
      metrics: {
        ...data.route!.metrics,
      }
    },
    progress,
    currentLocation: {
      coordinates: { 
        lat: data.currentLat || 45.0, 
        lng: data.currentLng || 45.0 
      }
    },
    schedule,
    ...data
  }
}

export const MOCK_FLIGHTS: IFlight[] = [
  createMockFlight('Turkish Airlines', {
    id: 'TK143',
    number: '143',
    icao: 'THY143',
    departureHours: 2,
    arrivalHours: 8,
    progressPercent: 35, 
    currentLat: 48.5,
    currentLng: 55.0,
    from: {
      code: 'SOF',
      city: 'Sofia',
      country: 'Bulgaria',
      countryCode: 'BG',
      countryName: 'Bulgaria',
      timezone: 'UTC +3',
      coordinates: { lat: 42.6977, lng: 23.3219 }
    },
    to: {
      code: 'PEK',
      city: 'Beijing',
      country: 'China',
      countryCode: 'CN',
      countryName: 'China',
      timezone: 'UTC +8',
      coordinates: { lat: 40.0801, lng: 116.5846 }
    },
    route: {
      speed: 870,
      altitude: 10600,
      metrics: {
        distanceDoneKm: 2100,
        distanceLeftKm: 3900,
        durationDoneHm: '3h 30m',
        durationLeftHm: '4h 30m'
      }
    }
  }),
  
  createMockFlight('Ryanair', {
    id: 'RN1782',
    number: '1782',
    icao: 'RYR1782',
    departureHours: 1,
    arrivalHours: 5.5,
    progressPercent: 45,  
    currentLat: 45.5,
    currentLng: 15.0,
    from: {
      code: 'DUB',
      city: 'Dublin',
      country: 'Ireland',
      countryCode: 'IE',
      countryName: 'Ireland',
      timezone: 'UTC +1',
      coordinates: { lat: 53.4215, lng: -6.2701 }
    },
    to: {
      code: 'LCA',
      city: 'Larnaca',
      country: 'Cyprus',
      countryCode: 'CY',
      countryName: 'Cyprus',
      timezone: 'UTC +3',
      coordinates: { lat: 34.8751, lng: 33.6245 }
    },
    route: {
      speed: 840,
      altitude: 11200,
      metrics: {
        distanceDoneKm: 1500,
        distanceLeftKm: 1800,
        durationDoneHm: '2h 30m',
        durationLeftHm: '3h 0m'
      }
    }
  }),
  
  createMockFlight('S7 Airlines', {
  id: 'S7124',
  number: '124',
  icao: 'SBI124',
  departureHours: 3,
  arrivalHours: 7,
  progressPercent: 55,
  currentLat: 42.5,
  currentLng: 28.0,
  from: {
    code: 'NCE',
    city: 'Nice',
    country: 'France',
    countryCode: 'FR',
    countryName: 'France',
    timezone: 'UTC +2',
    coordinates: { lat: 43.6655, lng: 7.2138 }
  },
  to: {
    code: 'TBS',
    city: 'Tbilisi',
    country: 'Georgia',
    countryCode: 'GE',
    countryName: 'Georgia',
    timezone: 'UTC +4',
    coordinates: { lat: 41.6693, lng: 44.9548 }
  },
  route: {
    speed: 860,
    altitude: 10900,
    metrics: {
      distanceDoneKm: 1300,
      distanceLeftKm: 1100,
      durationDoneHm: '2h 30m',
      durationLeftHm: '2h 0m'
    }
  }
}),

  
  createMockFlight('SWISS International Air Lines', {
    id: 'LX318',
    number: '318',
    icao: 'SWR318',
    departureHours: 0.5,
    arrivalHours: 6,
    progressPercent: 25,  
    currentLat: 42.0,
    currentLng: 20.0,
    from: {
      code: 'OPO',
      city: 'Porto',
      country: 'Portugal',
      countryCode: 'PT',
      countryName: 'Portugal',
      timezone: 'UTC +1',
      coordinates: { lat: 41.1579, lng: -8.6291 }
    },
    to: {
      code: 'GYD',
      city: 'Baku',
      country: 'Azerbaijan',
      countryCode: 'AZ',
      countryName: 'Azerbaijan',
      timezone: 'UTC +4',
      coordinates: { lat: 40.4675, lng: 50.0467 }
    },
    route: {
      speed: 830,
      altitude: 10700,
      metrics: {
        distanceDoneKm: 900,
        distanceLeftKm: 2700,
        durationDoneHm: '1h 30m',
        durationLeftHm: '4h 30m'
      }
    }
  }),
  
  createMockFlight('Lufthansa', {
  id: 'LH401',
  number: '401',
  icao: 'DLH401',
  departureHours: 4,
  arrivalHours: 10,
  progressPercent: 40,
  currentLat: 38.0,
  currentLng: 42.0,
  from: {
    code: 'BOJ',
    city: 'Burgas',
    country: 'Bulgaria',
    countryCode: 'BG',
    countryName: 'Bulgaria',
    timezone: 'UTC +3',
    coordinates: { lat: 42.4946, lng: 27.4801 }
  },
  to: {
    code: 'MCT',
    city: 'Muscat',
    country: 'Oman',
    countryCode: 'OM',
    countryName: 'Oman',
    timezone: 'UTC +4',
    coordinates: { lat: 23.5933, lng: 58.2844 }
  },
  route: {
    speed: 890,
    altitude: 11300,
    metrics: {
      distanceDoneKm: 1700,
      distanceLeftKm: 2500,
      durationDoneHm: '2h 30m',
      durationLeftHm: '4h 0m'
    }
  }
})
]