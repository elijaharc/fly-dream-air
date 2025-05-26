// Function to get flights from localStorage
function getFlights() {
  const bookedFlights = JSON.parse(localStorage.getItem('bookedFlights') || '{}');

  // Convert bookedFlights object to arrays of upcoming and past flights
  const now = new Date();
  const flights = {
    upcoming: [],
    past: [],
  };

  Object.entries(bookedFlights).forEach(([flightId, booking]) => {
    const flightDate = new Date(booking.flight.date);

    const flight = {
      id: flightId,
      route: `${booking.flight.from} → ${booking.flight.to}`,
      status: flightDate > now ? 'Confirmed' : 'Completed',
      departure: {
        time: formatTime(booking.flight.departTime),
        airport: booking.flight.from,
        terminal: 'Terminal 1', // You might want to add this to your flight data
      },
      arrival: {
        time: formatTime(booking.flight.arriveTime),
        airport: booking.flight.to,
        terminal: 'Terminal 1', // You might want to add this to your flight data
      },
      duration: booking.flight.duration,
      type: 'Direct Flight', // You might want to add this to your flight data
      passenger: {
        name: booking.bookingInfo.passengerName || '',
        seat: booking.flight.selectedSeats || 'TBD',
      },
      flightDetails: {
        aircraft: booking.flight.aircraft || 'Boeing 737-800', // Default if not specified
        class: booking.flight.class || 'Economy', // Default if not specified
      },
      booking: {
        date: new Date(booking.bookingInfo.bookingDate).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        id: booking.flight.id,
        flightNumber: flightId,
        price: `$${booking.flight.price.toFixed(2)}`,
      },
    };

    if (flightDate > now) {
      flights.upcoming.push(flight);
    } else {
      flights.past.push(flight);
    }
  });

  // Sort upcoming flights by departure time
  flights.upcoming.sort(
    (a, b) =>
      new Date(bookedFlights[a.id].flight.departureTime) -
      new Date(bookedFlights[b.id].flight.departureTime)
  );

  // Sort past flights by departure time (most recent first)
  flights.past.sort(
    (a, b) =>
      new Date(bookedFlights[b.id].flight.departureTime) -
      new Date(bookedFlights[a.id].flight.departureTime)
  );

  return flights;
}

// Helper function to calculate duration between two times
function calculateDuration(departureTime, arrivalTime) {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  const diffMs = arrival - departure;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHrs}h ${diffMins}m`;
}

// Helper function to format time string
function formatTime(timeStr) {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// Function to get flight data from localStorage
function getFlightData(flightId) {
  const bookedFlights = JSON.parse(localStorage.getItem('bookedFlights')) || {};
  return bookedFlights[flightId];
}

// Function to update flight details in the UI
function updateFlightDetails(flight) {
  if (!flight) {
    alert('Flight not found');
    window.location.href = '/user-flight-info';
    return;
  }
  console.log(flight);

  const flightDate = new Date(flight.flight.date);
  const status = flightDate > new Date() ? 'Confirmed' : 'Completed';

  // Update flight header
  document.querySelector('.flight-number').textContent = `Flight #${flight.flight.id}`;
  document.querySelector('.flight-route').textContent =
    `${flight.flight.from} → ${flight.flight.to}`;
  document.querySelector('.flight-status').textContent = status;
  document.querySelector('.flight-status').className =
    `flight-status status-badge status-${status.toLowerCase()}`;

  // Update departure details
  document.querySelector('.departure-time').textContent = formatTime(flight.flight.departTime);
  document.querySelector('.departure-airport').textContent = flight.flight.from;
  document.querySelector('.departure-terminal').textContent =
    flight.flight.terminal || 'Terminal 1';

  // Update flight duration
  document.querySelector('.flight-duration').textContent = flight.flight.duration;
  document.querySelector('.flight-type').textContent = 'Direct Flight';

  // Update arrival details
  document.querySelector('.arrival-time').textContent = formatTime(flight.flight.arriveTime);
  document.querySelector('.arrival-airport').textContent = flight.flight.to;
  document.querySelector('.arrival-terminal').textContent = flight.flight.terminal || 'Terminal 1';

  // Update passenger information
  document.querySelector('.passenger-name').textContent = flight.bookingInfo.passengerName;
  document.querySelector('.passenger-seat').textContent =
    `Seat: ${flight.flight.selectedSeats || 'TBD'}`;

  // Update flight details
  document.querySelector('.aircraft-info').textContent =
    `Aircraft: ${flight.flight.aircraft || 'Boeing 737-800'}`;

  // Update booking information
  document.querySelector('.booking-date').textContent = `Booking Date: ${new Date(
    flight.bookingInfo.bookingDate
  ).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
  document.querySelector('.booking-id').textContent = `Booking ID: ${flight.flight.id}`;
  document.querySelector('.booking-price').textContent =
    `Price: $${flight.flight.price.toFixed(2)}`;

  // Update flight expenses
  updateFlightExpenses(flight);

  // Pre-fill booking reference in the form
  document.querySelector('.booking-reference-input').value = flight.flight.id;
}

// Function to update flight expenses
function updateFlightExpenses(flight) {
  // Calculate expenses
  const flightPrice = flight.flight.price || 0;
  const baggagePrice = flight.flight.baggagePrice || 25.0;
  const menuPrice = flight.flight.menuPrice || 15.0;
  const otherAddOns = flight.flight.otherAddOns || 50.0;
  const total = flightPrice + baggagePrice + menuPrice + otherAddOns;

  // Update the expense values in the UI
  document.querySelector('.flight-expense').textContent = `$${flightPrice.toFixed(2)}`;
  document.querySelector('.baggage-expense').textContent = `$${baggagePrice.toFixed(2)}`;
  document.querySelector('.menu-expense').textContent = `$${menuPrice.toFixed(2)}`;
  document.querySelector('.addons-expense').textContent = `$${otherAddOns.toFixed(2)}`;
  document.querySelector('.total-expense').textContent = `$${total.toFixed(2)}`;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
  // Get flight ID from localStorage
  const flightId = localStorage.getItem('selectedFlightId');
  console.log('Flight ID from localStorage:', flightId);

  if (!flightId) {
    console.error('No flight ID provided');
    window.location.href = '/user-flight-info';
    return;
  }

  // Get flight data
  const flight = getFlightData(flightId);
  console.log(flight);
  if (!flight) {
    console.error('Flight not found:', flightId);
    window.location.href = '/user-flight-info';
    return;
  }

  // Update the UI with flight details
  updateFlightDetails(flight);

  // Handle concern buttons
  const concernBtns = document.querySelectorAll('.concern-btn');
  concernBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      concernBtns.forEach(b => b.classList.remove('concern-selected'));
      btn.classList.add('concern-selected');
    });
  });
});
