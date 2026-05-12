

// html_Code/utils/api.js
async function secureFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    // Automatically add the Authorization header if we have a token
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers // Keep any other headers you already had
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, { ...options, headers });
    // 🧠 Pro Tip: If the token is expired (403), redirect to login automatically!
    if (response.status === 401 || response.status === 403) {
        alert("Session expired. Please login again.");
        window.location.href = "../auth/login.html";
        return response;
    }
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return response;
}


//an internal wok flow e.g 
// internally fetch receives:
// {
//     method: 'POST',           // from ...options
//     body: '{"name":"Ali"}',   // from ...options
//     headers: {                // your built headers
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer eyJ...'
//     }
// }