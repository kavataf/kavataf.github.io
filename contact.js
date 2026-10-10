const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const sendBtn = document.getElementById("sendBtn");

console.log("Contact script loaded:", !!contactForm);

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log("Form submitted!");

    const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    formStatus.textContent = "Sending your message...";
    sendBtn.disabled = true;

    try {
        const response = await fetch("https://kavataf-github-io.onrender.com/api/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        subject: formData.subject,
                        message: formData.message
                    })
                });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to send message.");
        }

        formStatus.textContent = result.message;
        formStatus.style.color = "green";
        contactForm.reset();

    } catch (error) {
        console.error("Contact form error:", error);
        formStatus.textContent =
            "Unable to send your message. Please try again.";
        formStatus.style.color = "red";

    } finally {
        sendBtn.disabled = false;
    }
});