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
        blueText: '#3D52A2',
      },
    },
  },
};

//  Utility: Format a date string to yyyy-mm-dd
function formatDateInput(dateStr) {
  const currentYear = new Date().getFullYear();
  const fullDateStr = `${dateStr}, ${currentYear}`;
  const date = new Date(fullDateStr);
  if (isNaN(date)) return '';
  return date.toISOString().split('T')[0];
}

function validatePayment() {
  const name = document.getElementById('cardName').value.trim();
  const number = document.getElementById('cardNumber').value.replace(/\s+/g, '');
  const exp = document.getElementById('expDate').value;
  const cvv = document.getElementById('cvv').value;

  if (!name || !number || !exp || !cvv) {
    alert('Please fill in all payment fields.');
    return;
  }

  if (!/^\d{16}$/.test(number)) {
    alert('Card number must be 16 digits (no spaces).');
    return;
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    alert('CVV must be 3 or 4 digits.');
    return;
  }

  const today = new Date();
  const [year, month] = exp.split('-');
  const expDate = new Date(year, month);
  if (expDate <= today) {
    alert('Card is expired.');
    return;
  }

  alert('Payment successful! Redirecting...');
  window.location.href = '/booking-success/index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const bookingInfo = JSON.parse(localStorage.getItem('bookingInfo')) || {};
  const flight = JSON.parse(localStorage.getItem('selectedFlight')) || {};
  const addons = JSON.parse(localStorage.getItem('addOnInfo')) || {};
  const seatUpgrade = parseFloat(localStorage.getItem('seatUpgrade')) || 0;

  document.getElementById('tripType').value = bookingInfo.tripType || 'round-trip';
  document.getElementById('adultCount').value = bookingInfo.adults || '1';
  document.getElementById('childCount').value = bookingInfo.children || '0';
  document.getElementById('classType').value = bookingInfo.classType || 'Economy';

  document.getElementById('departure').value = flight.from || bookingInfo.departure || '';
  document.getElementById('arrival').value = flight.to || bookingInfo.arrival || '';
  document.getElementById('departureDate').value = bookingInfo.departureDate || '';
  document.getElementById('arrivalDate').value = bookingInfo.arrivalDate || '';

  const container = document.getElementById('selectedFlightCard');
  if (!flight) {
    container.innerHTML = "<p class='text-center text-gray-500'>No flight selected.</p>";
  } else {
    container.innerHTML = `
      <div class="border border-[#B8C4EB] rounded-xl p-4 flex flex-col md:flex-row justify-between items-center bg-white shadow w-full">
        <div class="flex flex-col space-y-4 w-full md:w-4/5">
          <!-- Outbound Flight -->
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
    
          <!-- Return Flight -->
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
        </div>
      </div>
    `;
  }

  const addonsSummaryEl = document.querySelector('.addons-summary');
  const grandTotalEl = document.getElementById('grandTotal');

  const adults = parseInt(bookingInfo.adults) || 0;
  const children = parseInt(bookingInfo.children) || 0;
  const totalPassengers = adults + children;

  const ticketPrice = parseFloat(flight.price) || 0;
  const totalTicketCost = ticketPrice * totalPassengers;
  const checkedBaggage = parseFloat(addons.checkBaggage) || 0;
  const meal = parseFloat(addons.meal) || 0;
  const insurance = parseFloat(addons.insurance) || 0;
  const entertainment = parseFloat(addons.entertainment) || 0;
  const priority = parseFloat(addons.priority) || 0;
  const seatUpgrade = pasreFloat(addons.seatUpgrade) || 0;

  const total =
    totalTicketCost + checkedBaggage + meal + insurance + entertainment + priority + seatUpgrade;

  addonsSummaryEl.innerHTML = `
    <li class="flex justify-between"><span>Ticket Price (${totalPassengers} Pax)</span><span>$${totalTicketCost.toFixed(2)}</span></li>
    <li class="flex justify-between"><span>Checked-in Baggage</span><span>$${checkedBaggage.toFixed(2)}</span></li>
    <li class="flex justify-between"><span>Meal Menu</span><span>$${meal.toFixed(2)}</span></li>
    <li class="flex justify-between"><span>Late Flight Insurance</span><span>$${insurance.toFixed(2)}</span></li>
    <li class="flex justify-between"><span>In-flight Entertainment</span><span>$${entertainment.toFixed(2)}</span></li>
    <li class="flex justify-between"><span>Priority Boarding</span><span>$${priority.toFixed(2)}</span></li>
    <li class="flex justify-between"><span>Seat Upgrade</span><span>$${seatUpgrade.toFixed(2)}</span></li>
  `;

  grandTotalEl.textContent = `Grand Total: $${total.toFixed(2)}`;
});
