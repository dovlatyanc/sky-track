import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Регистрируем Arial
Font.register({
  family: 'Arial',
  fonts: [
    { src: '/src/fonts/arial.ttf', fontWeight: 'normal' },
  ]
})

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'Arial',
  },

  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  airport: {
    textAlign: 'center',
  },
  airportCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  airportCity: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 3,
  },
  planeIcon: {
    fontSize: 20,
    color: '#2563eb',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  barcode: {
    marginTop: 15,
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'right',
    marginTop: 10,
  },
})

interface TicketPDFProps {
  orderId: string
  ticket: any
  passengerData: {
    fullName: string
    phone: string
    email: string
    passportNumber?: string
  }
}

export function TicketPDF({ orderId, ticket, passengerData }: TicketPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>✈️ SKYTRACKER</Text>
          <Text style={styles.subtitle}>Электронный билет • Посадочный талон</Text>
        </View>

        {/* Flight Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Информация о рейсе</Text>
          <View style={styles.flightRoute}>
            <View style={styles.airport}>
              <Text style={styles.airportCode}>{ticket.from.code}</Text>
              <Text style={styles.airportCity}>{ticket.from.city}</Text>
            </View>
            <Text style={styles.planeIcon}>✈️</Text>
            <View style={styles.airport}>
              <Text style={styles.airportCode}>{ticket.to.code}</Text>
              <Text style={styles.airportCity}>{ticket.to.city}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Авиакомпания</Text>
            <Text style={styles.value}>{ticket.airline}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Номер рейса</Text>
            <Text style={styles.value}>{ticket.flightNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Дата</Text>
            <Text style={styles.value}>
              {new Date(ticket.departureTime).toLocaleDateString('ru-RU')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Время вылета</Text>
            <Text style={styles.value}>
              {new Date(ticket.departureTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Время прилёта</Text>
            <Text style={styles.value}>
              {new Date(ticket.arrivalTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>В пути</Text>
            <Text style={styles.value}>{ticket.duration}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Пересадки</Text>
            <Text style={styles.value}>
              {ticket.stops === 0 ? 'Прямой рейс' : `${ticket.stops} пересадк${ticket.stops === 1 ? 'а' : 'и'}`}
            </Text>
          </View>
        </View>

        {/* Passenger Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Информация о пассажире</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Пассажир</Text>
            <Text style={styles.value}>{passengerData.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Телефон</Text>
            <Text style={styles.value}>{passengerData.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{passengerData.email}</Text>
          </View>
          {passengerData.passportNumber && (
            <View style={styles.row}>
              <Text style={styles.label}>Номер паспорта</Text>
              <Text style={styles.value}>{passengerData.passportNumber}</Text>
            </View>
          )}
        </View>

        {/* Price */}
        <View style={styles.price}>
          <Text>Итого: {ticket.price.toLocaleString('ru-RU')} ₽</Text>
        </View>

        {/* Barcode (simulated) */}
        <View style={styles.barcode}>
          <Text style={{ fontSize: 30, fontFamily: 'Courier' }}>
            {orderId.slice(0, 12).toUpperCase()}
          </Text>
          <Text style={styles.barcodeText}>Код бронирования</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Спасибо, что выбрали SkyTracker! Пожалуйста, прибудьте в аэропорт за 2 часа до вылета.</Text>
          <Text style={{ marginTop: 5 }}>Это электронный билет — распечатывать не обязательно, достаточно показать на мобильном устройстве.</Text>
        </View>
      </Page>
    </Document>
  )
}