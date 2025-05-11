document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent default form submission

            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
            const countryCodeSelect = document.getElementById('countryCode'); // Get the select element
            const responseMessageDiv = document.getElementById('responseMessage');

            const name = nameInput.value.trim();
            const selectedCountryCode = countryCodeSelect.value; // Get selected country code
            const phone = phoneInput.value.trim();

            // Basic validation
            if (!name || !phone) {
                responseMessageDiv.textContent = 'Please fill in all fields.';
                responseMessageDiv.className = 'message error';
                responseMessageDiv.style.display = 'block';
                return;
            }

            // Updated phone validation (e.g., 7-15 digits for the number part)
            // You might want to adjust this regex based on typical lengths for the selected countries
            if (!/^\d{7,15}$/.test(phone.replace(/\s+/g, ''))) {
                responseMessageDiv.textContent = 'Please enter a valid phone number (7-15 digits).';
                responseMessageDiv.className = 'message error';
                responseMessageDiv.style.display = 'block';
                return;
            }

            const fullPhoneNumber = selectedCountryCode + phone.replace(/\s+/g, ''); // Prepend country code, remove spaces

            const formData = {
                name: name,
                phone: fullPhoneNumber // Send the combined number
            };

            // Replace with your actual Vercel backend URL
            const apiUrl = '/api/contact';

            responseMessageDiv.textContent = 'Sending...';
            responseMessageDiv.className = 'message'; // Reset to default
            responseMessageDiv.style.display = 'block';

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    const result = await response.json();
                    responseMessageDiv.textContent = result.message || 'Form submitted successfully!';
                    responseMessageDiv.className = 'message success';
                    nameInput.value = '';
                    phoneInput.value = '';
                    // Optionally reset countryCodeSelect.selectedIndex = 0;
                } else {
                    const errorResult = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
                    responseMessageDiv.textContent = `Error: ${response.status} - ${errorResult.message || 'Failed to submit form.'}`;
                    responseMessageDiv.className = 'message error';
                }
            } catch (error) {
                console.error('Submission error:', error);
                responseMessageDiv.textContent = 'An error occurred while submitting the form. Please try again.';
                responseMessageDiv.className = 'message error';
            } finally {
                responseMessageDiv.style.display = 'block';
            }
        });
    }
});
