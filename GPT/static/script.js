const fileInput = document.getElementById("fileInput");
const questionInput = document.getElementById("questionInput");
const chatContainer = document.getElementById("chatContainer");
const uploadBox = document.getElementById("uploadBox");
const typingIndicator = document.getElementById("typingIndicator");
const header = document.getElementById("header");

// ---- robust scroll to bottom ----
function scrollToBottom() {
  // wait for layout, then scroll; also scroll the last element for stubborn browsers
  requestAnimationFrame(() => {
    const last = chatContainer.lastElementChild;
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (last && last.scrollIntoView) {
      last.scrollIntoView({ block: "end" });
    }
  });
}

// auto-scroll whenever messages are added
const observer = new MutationObserver(() => scrollToBottom());
observer.observe(chatContainer, { childList: true });

// header shrink transition can change height; scroll again after transition
header.addEventListener("transitionend", (e) => {
  if (e.target === header) scrollToBottom();
});

// show chat after file upload
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    document.getElementById("chatSection").classList.remove("hidden");
    // small delay lets the section unhide and size itself
    setTimeout(scrollToBottom, 60);
  }
});

document.getElementById("ask-form").addEventListener("submit", async function (event) {
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

  // user message
  const userMessage = document.createElement("div");
  userMessage.className = "message user";
  userMessage.textContent = question;
  chatContainer.appendChild(userMessage);
  setTimeout(scrollToBottom, 80);
  typingIndicator.classList.remove("hidden");
  questionInput.value = "";
  setTimeout(scrollToBottom, 80);
  // form data
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("question", question);

  try {
    const res = await fetch("upload/", { method: "POST", body: formData });

    if (!res.ok) {
      const text = await res.text(); // backend may return HTML error page
      throw new Error(text);
    }

    let data;
    try {
      data = await res.json();
    } catch {
      const text = await res.text();
      data = { answer: text };
    }

    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    setTimeout(scrollToBottom, 80);
    botMessage.innerHTML = data.answer || "Sorry, no answer found.";
    chatContainer.appendChild(botMessage);
  } catch (error) {
    console.error("Error:", error);
    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    setTimeout(scrollToBottom, 80);
    botMessage.textContent = "Something went wrong. Try again later.";
    chatContainer.appendChild(botMessage);
  } finally {
    typingIndicator.classList.add("hidden");
    // extra scroll after everything settles (including fonts/markdown layout)
    setTimeout(scrollToBottom, 80);
  }
});
