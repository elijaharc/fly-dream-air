document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('bookingSuccessModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const viewBookingBtn = document.getElementById('viewBookingBtn');

  // Function to show the modal
  window.openBookingSuccessModal = function (flightId) {
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
  };

  // Function to hide the modal
  function hideModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    window.location.href = '/';
  }

  // Close modal when clicking the close button
  closeModalBtn.addEventListener('click', hideModal);

  // Close modal when clicking outside the modal content
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      hideModal();
    }
  });

  // Handle view booking button click
  viewBookingBtn.addEventListener('click', function () {
    localStorage.setItem('selectedFlightId', 'F102');
    window.location.href = '/user-flight-info';
  });

  // Function to update booking details
  window.updateBookingDetails = function (details) {
    if (details.bookingReference) {
      document.getElementById('bookingReference').textContent = details.bookingReference;
    }
    if (details.flightNumber) {
      document.getElementById('flightNumber').textContent = details.flightNumber;
    }
    if (details.flightDate) {
      document.getElementById('flightDate').textContent = details.flightDate;
    }
  };

  // Example of how to update booking details
  // In a real application, you would pass the actual booking details
  const bookingDetails = {
    bookingReference: 'FD123456',
    flightNumber: 'F102',
    flightDate: 'May 28, 2025',
  };
  updateBookingDetails(bookingDetails);
});
