tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#262A3F',
        secondary: '#ADBBDA',
        highlight: '#BCC8FF',
        darkblue: '#1D2346',
        bgLight: '#F2F2F7',
        accentGray: '#D1D5DB',
      },
    },
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const searchData = JSON.parse(localStorage.getItem('flightSearch')) || {};

  // Populate input values
  document.getElementById('tripType').value = searchData.tripType || 'round-trip';
  document.getElementById('adultCount').value = searchData.adults || '1';
  document.getElementById('childCount').value = searchData.children || '0';
  document.getElementById('classType').value = searchData.classType || 'Economy';
  document.getElementById('departure').value = searchData.departure || '';
  document.getElementById('arrival').value = searchData.arrival || '';

  if (searchData.departureDate) {
    document.getElementById('departureDate').value = searchData.departureDate;
  }
  if (searchData.arrivalDate) {
    document.getElementById('arrivalDate').value = searchData.arrivalDate;
  }

  renderFlightCards(searchData);

  // Form submit with Enter key
  document.getElementById('flightSearchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const departureDate = document.getElementById('departureDate').value;
    const arrivalDate = document.getElementById('arrivalDate').value;

    // Validate dates
    if (departureDate && arrivalDate) {
      const departDate = new Date(departureDate);
      const arriveDate = new Date(arrivalDate);

      // Set time to midnight for accurate date comparison
      departDate.setHours(0, 0, 0, 0);
      arriveDate.setHours(0, 0, 0, 0);

      if (departDate > arriveDate) {
        alert('Departure date cannot be later than return date');
        return;
      }
    }

    const updatedSearch = {
      tripType: document.getElementById('tripType').value,
      adults: document.getElementById('adultCount').value,
      children: document.getElementById('childCount').value,
      classType: document.getElementById('classType').value,
      departure: document.getElementById('departure').value.trim(),
      arrival: document.getElementById('arrival').value.trim(),
      departureDate: departureDate,
      arrivalDate: arrivalDate,
    };

    localStorage.setItem('flightSearch', JSON.stringify(updatedSearch));
    renderFlightCards(updatedSearch);
  });
});

// Mock flight data
const flights = [
  {
    id: 'F101',
    from: 'SYD',
    to: 'MNL',
    date: '2025-05-27',
    departTime: '10:10',
    arriveTime: '17:00',
    returnDepartTime: '13:15',
    returnArriveTime: '22:00',
    departDate: 'Tue, May 27',
    returnDate: 'Sun, June 1',
    returnISODate: '2025-06-01',
    duration: '8h 50m',
    returnDuration: '8h 45m',
    returnFrom: 'MNL',
    returnTo: 'SYD',
    price: 697,
    class: 'Economy',
  },
  {
    id: 'F102',
    from: 'SYD',
    to: 'MNL',
    date: '2025-05-27',
    departTime: '06:00',
    arriveTime: '13:00',
    returnDepartTime: '12:00',
    returnArriveTime: '21:00',
    departDate: 'Tue, May 27',
    returnDate: 'Sun, June 1',
    returnISODate: '2025-06-01',
    duration: '7h',
    returnDuration: '9h',
    returnFrom: 'MNL',
    returnTo: 'SYD',
    price: 750,
    class: 'Economy',
  },
  // Add more flights as needed
];

function renderFlightCards(searchData) {
  const flightContainer = document.getElementById('flightResults');
  flightContainer.innerHTML = '';

  const matchedFlights = flights
    .filter(
      f =>
        f.from.toLowerCase() === searchData.departure?.toLowerCase() &&
        f.to.toLowerCase() === searchData.arrival?.toLowerCase() &&
        f.date === searchData.departureDate &&
        f.returnISODate === searchData.arrivalDate &&
        f.class === searchData.classType
    )
    .sort((a, b) => a.departTime.localeCompare(b.departTime));

  if (matchedFlights.length === 0) {
    flightContainer.innerHTML =
      "<p class='text-center text-gray-500'>No matching flights found.</p>";
    return;
  }

  matchedFlights.forEach(flight => {
    const card = document.createElement('div');
    card.className =
      'border border-[#B8C4EB] rounded-xl p-4 flex flex-col md:flex-row justify-between items-center bg-white shadow w-full';

    card.innerHTML = `
          <div class="flex flex-col space-y-4 w-full md:w-4/5">
            <div class="flex items-center justify-between w-full">
              <div class="text-left">
                <div class="font-bold text-lg">${flight.departTime}</div>
                <div class="text-sm font-semibold text-gray-800">${flight.from}</div>
                <div class="text-sm text-gray-500">${flight.departDate}</div>
              </div>
              <div class="flex flex-col items-center text-xs text-gray-700">
                <div class="flex items-center space-x-2">
                  <span>🛫</span><span>${flight.duration}</span><span>🛬</span>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-lg">${flight.arriveTime}</div>
                <div class="text-sm font-semibold text-gray-800">${flight.to}</div>
                <div class="text-sm text-gray-500">${flight.departDate}</div>
              </div>
            </div>
            <div class="flex items-center justify-between w-full">
              <div class="text-left">
                <div class="font-bold text-lg">${flight.returnDepartTime}</div>
                <div class="text-sm font-semibold text-gray-800">${flight.returnFrom}</div>
                <div class="text-sm text-gray-500">${flight.returnDate}</div>
              </div>
              <div class="flex flex-col items-center text-xs text-gray-700">
                <div class="flex items-center space-x-2">
                  <span>🛫</span><span>${flight.returnDuration}</span><span>🛬</span>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-lg">${flight.returnArriveTime}</div>
                <div class="text-sm font-semibold text-gray-800">${flight.returnTo}</div>
                <div class="text-sm text-gray-500">${flight.returnDate}</div>
              </div>
            </div>
          </div>
          <div class="hidden md:block h-[120px] border-l-2 border-[#8697C4] mx-8"></div>
          <div class="text-center w-full md:w-auto mt-4 md:mt-0">
            <div class="text-2xl font-extrabold text-[#262A3F]">$${flight.price.toFixed(2)}</div>
            <button onclick='bookFlight(${JSON.stringify(flight)})' class="mt-2 px-6 py-2 bg-[#C9D3EE] text-[#262A3F] rounded-lg font-semibold hover:bg-[#B5C0E0] transition">
              Book
            </button>
          </div>
        `;
    flightContainer.appendChild(card);
  });
}

function bookFlight(flight) {
  localStorage.setItem('selectedFlight', JSON.stringify(flight));
  const bookingDetails = {
    tripType: document.getElementById('tripType').value,
    adults: document.getElementById('adultCount').value,
    children: document.getElementById('childCount').value,
    classType: document.getElementById('classType').value,
    departure: document.getElementById('departure').value,
    arrival: document.getElementById('arrival').value,
    departureDate: document.getElementById('departureDate').value,
    arrivalDate: document.getElementById('arrivalDate').value,
  };
  localStorage.setItem('bookingInfo', JSON.stringify(bookingDetails));
  window.location.href = '/add-on-purchase';
}
