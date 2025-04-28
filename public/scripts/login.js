document.getElementById("login").addEventListener("click", function () {
    const username = document.getElementById("username").value;
    if(username === "") {
        alert("Inserire username");
        return;
    }
    const password = document.getElementById("password").value;
    if(password === "") {
        alert("Inserire password");
        return;
    }

    console.log("Dati inviati:", { username, password });

    fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        console.log("Login response status:", response.status);
        if (!response.ok) {
            throw new Error("Login failed");
        }
        return response.json();
    })
    .then(data => {
        if (data.role === "admin") {
            window.location.href = "/homeAdmin";
        } else if (data.role === "cliente") {
            window.location.href = "/homeCliente";
        } 
        else if (data.role === "agente") {
            window.location.href = "/homeAgente";
        }
        else if (data.role === "gestore") {
            window.location.href = "/homeGestore";
        }
        else {
            alert("Username o password errati");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Login failed");
    });

});