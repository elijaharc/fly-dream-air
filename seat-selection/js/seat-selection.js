document.addEventListener('DOMContentLoaded', function() {
    // Populate ticket-box with booking info (same as add-on page, minus ticket count)
    const bookingInfo = JSON.parse(localStorage.getItem('bookingInfo')) || {};
    const { departure, arrival, departureDate, arrivalDate } = bookingInfo;
    if (departure && arrival && departureDate && arrivalDate) {
        document.getElementById('from-location').textContent = departure;
        document.getElementById('departure-date').textContent = departureDate;
        document.getElementById('to-location').textContent = arrival;
        document.getElementById('return-date').textContent = arrivalDate;
    }
    
    // Populate add-on info in Add-On & Ticket Info box
    const addonInfoDiv = document.getElementById('addon-info');
    const addOnInfo = JSON.parse(localStorage.getItem('addOnInfo')) || {};
    if (addonInfoDiv && Object.keys(addOnInfo).length > 0) {
        let html = '';
        for (const [key, value] of Object.entries(addOnInfo)) {
            if (key === 'checkBaggage' && typeof value === 'object' && value !== null) {
                html += `<div class="font-bold">Baggage Weights:</div>`;
                for (const [baggageType, baggageVal] of Object.entries(value)) {
                    let label = baggageType.toUpperCase();
                    let displayVal = baggageVal === true ? 'Yes' : baggageVal === false ? 'No' : baggageVal;
                    html += `<div class="ml-4"><span class="font-bold">${label}:</span> ${displayVal}</div>`;
                }
            } else {
                // Custom label replacements
                let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                if (label === 'Meal') label = 'Meals per Ticketholder';
                if (label === 'Insurance') label = 'Flight Insurance';
                if (label === 'Entertainment') label = 'In-Flight Entertainment';
                if (label === 'Priority') label = 'Check-In Priority';
                // Add $ sign for numeric values
                let displayVal = value;
                if (typeof value === 'number' && !isNaN(value)) {
                    displayVal = `$${value}`;
                } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
                    displayVal = `$${value}`;
                } else if (value === true) {
                    displayVal = 'Yes';
                } else if (value === false) {
                    displayVal = 'No';
                }
                html += `<div><span class="font-bold">${label}:</span> ${displayVal}</div>`;
            }
        }
        addonInfoDiv.innerHTML = html;
    } else if (addonInfoDiv) {
        addonInfoDiv.innerHTML = '<span class="text-gray-500">No add-ons selected.</span>';
    }

    // Seating info logic
    // Get ticket count
    let ticketCount = 1;
    if (bookingInfo && (bookingInfo.adults || bookingInfo.children)) {
        ticketCount = (parseInt(bookingInfo.adults) || 0) + (parseInt(bookingInfo.children) || 0);
        if (ticketCount === 0) ticketCount = 1;
    }
    const seatingTotalTickets = document.getElementById('seating-total-tickets');
    if (seatingTotalTickets) seatingTotalTickets.textContent = ticketCount;

    // Selected seats display
    const seatingSelectedSeats = document.getElementById('seating-selected-seats');
    const saveProceedBtn = document.getElementById('seating-save-proceed');
    // Add error message element under the button
    const errorMsg = document.getElementById('seating-error-msg');
    if (errorMsg) {
        errorMsg.style.display = 'none';
    }

    function updateSelectedSeatsDisplay() {
        const selectedBtns = document.querySelectorAll('.seat-btn.selected');
        const seats = Array.from(selectedBtns).map(btn => btn.getAttribute('data-seat'));
        seatingSelectedSeats.textContent = seats.length > 0 ? seats.join(', ') : 'None';
        // Enable/disable button and show error if needed
        if (saveProceedBtn) {
            if (seats.length === ticketCount) {
                saveProceedBtn.disabled = false;
                saveProceedBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
                saveProceedBtn.classList.add('bg-[#6AABDD]', 'hover:bg-[#5a9ac7]');
                if (errorMsg) errorMsg.style.display = 'none';
            } else {
                saveProceedBtn.disabled = true;
                saveProceedBtn.classList.remove('bg-[#6AABDD]', 'hover:bg-[#5a9ac7]');
                saveProceedBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
                // Show error message
                const diff = Math.abs(ticketCount - seats.length);
                if (errorMsg) {
                    if (seats.length < ticketCount) {
                        errorMsg.textContent = `Please select ${diff} more seat${diff > 1 ? 's' : ''} to continue.`;
                    } else {
                        errorMsg.textContent = `Please deselect ${diff} seat${diff > 1 ? 's' : ''} to continue.`;
                    }
                    errorMsg.style.display = 'block';
                }
            }
        }
    }
    // Update on seat selection
    document.addEventListener('click', function(e) {
        if (e.target.classList && e.target.classList.contains('seat-btn')) {
            setTimeout(updateSelectedSeatsDisplay, 0);
        }
    });
    // Initial update
    updateSelectedSeatsDisplay();

    // Save and proceed button
    if (saveProceedBtn) {
        saveProceedBtn.addEventListener('click', function() {
            if (saveProceedBtn.disabled) return;
            // Save selected seats to localStorage
            const selectedBtns = document.querySelectorAll('.seat-btn.selected');
            const seats = Array.from(selectedBtns).map(btn => btn.getAttribute('data-seat'));
            localStorage.setItem('selectedSeats', JSON.stringify(seats));
            // Optionally, navigate to payment or next step
            window.location.href = '../passenger-payment/';
        });
    }
});