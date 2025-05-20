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
                html += `<div class="font-bold">Check Baggage:</div>`;
                for (const [baggageType, baggageVal] of Object.entries(value)) {
                    let label = baggageType.toUpperCase();
                    let displayVal = baggageVal === true ? 'Yes' : baggageVal === false ? 'No' : baggageVal;
                    html += `<div class="ml-4"><span class="font-bold">${label}:</span> ${displayVal}</div>`;
                }
            } else {
                let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                let displayVal = value === true ? 'Yes' : value === false ? 'No' : value;
                html += `<div><span class="font-bold">${label}:</span> ${displayVal}</div>`;
            }
        }
        addonInfoDiv.innerHTML = html;
    } else if (addonInfoDiv) {
        addonInfoDiv.innerHTML = '<span class="text-gray-500">No add-ons selected.</span>';
    }
});