// Access check - runs immediately on page load
(function() {
    const hasAccess = sessionStorage.getItem("access");
    
    if (hasAccess !== "granted") {
        // Block access immediately
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
        
        // Prevent any scripts from running
        throw new Error('Access denied');
    }
<<<<<<< HEAD
})();
=======
})();
>>>>>>> 75293ec847d31ab02c9c83a320025f55d178e36e
