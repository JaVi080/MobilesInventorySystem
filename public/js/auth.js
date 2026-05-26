
const token = new URLSearchParams(window.location.search).get('token');
async function submitPassword() {
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch('api/SetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, password })
        });

        const result = await response.json();
        if (result.success) {
            alert("Password set successfully.");
            window.location.href = "/login";
        } else {
            alert("Failed to set password.");
        }
    } catch (error) {
        console.error("Error setting password:", error);
        alert("An error occurred while setting the password.");
    }
}