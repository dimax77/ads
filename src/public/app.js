// app.js
document.getElementById('adForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Perform client-side validation

    const formData = new FormData(event.target);
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    console.log(formData)
    const response = await fetch('/api/addAd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData),
    });

    if (response.ok) {
        console.log('Ad submitted successfully');
    } else {
        console.error('Failed to submit ad');
    }
});
