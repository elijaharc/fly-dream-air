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
      },
      booking: {
        date: new Date(booking.bookingInfo.bookingDate).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        id: booking.flight.id,
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

// Function to create flight card HTML
function createFlightCard(flight) {
  return `
        <div class="flight-card p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-xl font-semibold text-gray-800">Flight #${flight.id}</h2>
                    <p class="text-gray-600">${flight.route}</p>
                </div>
                <span class="status-badge status-${flight.status.toLowerCase()}">${flight.status}</span>
            </div>

            <div class="grid grid-cols-3 gap-8">
                <div class="text-center">
                    <p class="text-2xl font-bold text-gray-800">${flight.departure.time}</p>
                    <p class="text-gray-600">${flight.departure.airport}</p>
                    <p class="text-sm text-gray-500">${flight.departure.terminal}</p>
                </div>

                <div class="flight-info px-8 flex flex-col items-center justify-center">
                    <p class="text-gray-600">${flight.duration}</p>
                    <div class="w-full h-0.5 bg-gray-300 my-2"></div>
                    <p class="text-sm text-gray-500">${flight.type}</p>
                </div>

                <div class="text-center">
                    <p class="text-2xl font-bold text-gray-800">${flight.arrival.time}</p>
                    <p class="text-gray-600">${flight.arrival.airport}</p>
                    <p class="text-sm text-gray-500">${flight.arrival.terminal}</p>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-3 gap-6">
                <div>
                    <h3 class="font-semibold text-gray-800 mb-2">Passenger Information</h3>
                    <p class="text-gray-600">${flight.passenger.name}</p>
                    <p class="text-gray-600">Seat: ${flight.passenger.seat}</p>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800 mb-2">Flight Details</h3>
                    <p class="text-gray-600">Aircraft: ${flight.flightDetails.aircraft}</p>

                </div>
                <div>
                    <h3 class="font-semibold text-gray-800 mb-2">Booking Information</h3>
                    <p class="text-gray-600">Booking Date: ${flight.booking.date}</p>
                    <p class="text-gray-600">Booking ID: ${flight.booking.id}</p>
                    <p class="text-gray-600">Price: ${flight.booking.price}</p>
                </div>
            </div>

            <div class="mt-8 flex gap-4">
                <button onclick="localStorage.setItem('selectedFlightId', '${flight.id}'); window.location.href='/manage-flight'"
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Manage Flight
                </button>
            </div>
        </div>
    `;
}

// Function to render flights
function renderFlights() {
  const flights = getFlights();
  // Render upcoming flights
  const upcomingContainer = document.querySelector('#upcoming .max-w-4xl');
  if (flights.upcoming.length === 0) {
    upcomingContainer.innerHTML = `
      <div class="text-center py-12">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No Upcoming Flights</h3>
        <p class="text-gray-600">You don't have any upcoming flights booked.</p>
      </div>
    `;
  } else {
    upcomingContainer.innerHTML = flights.upcoming.map(flight => createFlightCard(flight)).join('');
  }

  // Render past flights
  const pastContainer = document.querySelector('#past .max-w-4xl');
  if (flights.past.length === 0) {
    pastContainer.innerHTML = `
      <div class="text-center py-12">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No Past Flights</h3>
        <p class="text-gray-600">You haven't taken any flights with us yet.</p>
      </div>
    `;
  } else {
    pastContainer.innerHTML = flights.past.map(flight => createFlightCard(flight)).join('');
  }
}

// Function to switch tabs
function switchTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  // Remove active class from all tabs
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('tab-active');
    button.classList.add('text-gray-500');
  });

  // Show selected tab content
  document.getElementById(tabId).classList.add('active');

  // Add active class to selected tab
  event.target.classList.add('tab-active');
  event.target.classList.remove('text-gray-500');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  renderFlights();
});
