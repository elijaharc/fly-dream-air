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
});