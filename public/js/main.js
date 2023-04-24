document
  .getElementById("user-input-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const userInput = document.getElementById("user-input").value;
    const responseContainer = document.getElementById("ai-response");
    responseContainer.textContent = "Loading...";

    try {
      const response = await fetch("/api/submit-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      const data = await response.json();
      responseContainer.textContent = data.response;
    } catch (err) {
      responseContainer.textContent = "Error: " + err.message;
    }
  });
