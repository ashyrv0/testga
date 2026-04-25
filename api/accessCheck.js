// Access check - runs immediately on page load
(function() {
  // Read the accessToken from cookies
  const cookies = document.cookie.split(';');
  let hasValidToken = false;

  for (let cookie of cookies) {
    if (cookie.trim().startsWith('accessToken=')) {
      hasValidToken = true;
      break;
    }
  }

  // Optional: Verify token with backend (more secure)
  if (hasValidToken) {
    fetch('/api/verifyToken', {
      method: 'POST',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (!data.valid) {
          blockAccess();
        }
      })
      .catch(() => blockAccess());
  } else {
    blockAccess();
  }

  function blockAccess() {
    // Clear the page
    document.documentElement.innerHTML = '';
    document.body.innerHTML = '';

    document.body.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: #0f1115;
      color: #e6e6eb;
      font-family: Arial, sans-serif;
    `;

    document.body.innerHTML = `
      <div style="text-align: center;">
        <h1>Access Denied</h1>
        <p>You must enter the correct access code first.</p>
        <button onclick="window.location.href = '/';" style="
          padding: 10px 20px;
          background: #e6e6eb;
          color: #0f1115;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        ">Go Back to Home</button>
      </div>
    `;

    throw new Error('Access denied');
  }
})();