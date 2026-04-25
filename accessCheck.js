// Access check - runs immediately on page load
(function() {
  const cookies = document.cookie;
  const localToken = localStorage.getItem('accessToken');
  
  let hasValidToken = cookies.includes('accessToken=') || localToken;

  if (hasValidToken) {
    fetch('/api/verifyToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token: localToken })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.valid) {
          blockAccess();
        } else {
          // Token is valid, allow access
          document.dispatchEvent(new Event('accessGranted'));
        }
      })
      .catch(() => blockAccess());
  } else {
    blockAccess();
  }

  function blockAccess() {
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
