const fileInput = document.getElementById("fileInput");
const questionInput = document.getElementById("questionInput");
const chatContainer = document.getElementById("chatContainer");
const uploadBox = document.getElementById("uploadBox");
const typingIndicator = document.getElementById("typingIndicator");
const header = document.getElementById("header");

function scrollToBottom() {
  setTimeout(() => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 50); // small delay ensures DOM update
}

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    document.getElementById("chatSection").classList.remove("hidden");
    scrollToBottom();
  }
});

document.getElementById("ask-form").addEventListener("submit", async function(event) {
  event.preventDefault();
  const question = questionInput.value.trim();

  if (!fileInput.files[0]) {
    alert("Please upload a file first.");
    return;
  }
  if (!question) {
    alert("Please enter a question.");
    return;
  }

  header.classList.add("shrink");
  uploadBox.style.display = "none"; 

  // append user message
  const userMessage = document.createElement("div");
  userMessage.className = "message user";
  userMessage.textContent = question;
  chatContainer.appendChild(userMessage);
  scrollToBottom();

  typingIndicator.classList.remove("hidden");
  scrollToBottom();

  questionInput.value = "";

  // prepare form data
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("question", question);

  try {
    const res = await fetch("upload/", {
      method: "POST",
      body: formData
    });

    let data;
    if (!res.ok) {
      // ❌ server returned error page
      const text = await res.text();
      throw new Error(text);
    }

    try {
      data = await res.json();
    } catch {
      // fallback if response is not JSON
      const text = await res.text();
      data = { answer: text };
    }

    // bot message
    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    botMessage.innerHTML = data.answer || "Sorry, no answer found.";
    chatContainer.appendChild(botMessage);

  } catch (error) {
    console.error("Error:", error);
    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    botMessage.textContent = "Something went wrong. Try again. ",+error.message;
    chatContainer.appendChild(botMessage);
  }

  typingIndicator.classList.add("hidden");
  scrollToBottom();
  questionInput.value = ""; // clear input
});
