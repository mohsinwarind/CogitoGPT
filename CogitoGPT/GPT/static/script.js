document.getElementById("ask-form").addEventListener("submit", async function(event) {
  event.preventDefault(); // stop page reload

  const fileInput = document.getElementById("fileInput");
  const questionInput = document.getElementById("questionInput");
  const chatContainer = document.getElementById("chatContainer");
  const uploadBox = document.getElementById("uploadBox");
  
  const question = questionInput.value.trim();
  if (!fileInput.files[0] || !question) {
    alert("Please upload a file and ask a question!");
    return;
  }
  questionInput.value = "";
  header.classList.add("shrink");
  uploadBox.style.display = "none";


  // fileInput.addEventListener("change", () => {
  //   if (fileInput.files.length > 0) {
  //     uploadBox.style.width = "150px";   
  //     uploadBox.style.height = "40px";   
  //     uploadBox.style.fontSize = "12px"; 
  //     uploadBox.style.opacity = "0.8";   
  //   }
  // });

  // Append user message
  const userMessage = document.createElement("div");
  userMessage.className = "message user";
  userMessage.textContent = question;
  chatContainer.appendChild(userMessage);
  typingIndicator.classList.remove("hidden");

  // Scroll to the bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Prepare form data

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("question", question);

  try {
    const response = await fetch("upload/", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    // Append bot message
    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    botMessage.textContent = data.answer || "Sorry, no answer found.";
    chatContainer.appendChild(botMessage);

    typingIndicator.classList.add("hidden");

  } catch (error) {
    console.error("Error:", error);
    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    botMessage.textContent = "Something went wrong. Try again.";
    chatContainer.appendChild(botMessage);
  }

  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // ✅ Always clear input after sending
});
