
# CogitoGPT – Research-oriented ChatBot

##  Introduction

CogitoGPT is an AI-powered chatbot app specifically built for **research purposes**.
Being in academia for a while, I always found research articles overly complex and time-consuming to parse. So I built **CogitoGPT** to make interacting with papers easier.

**How it works in short:** you **upload** a research paper , then **ask questions** according to your need and CogitoGPT uses the extract the text content out of the file as context and gives intelligent, relevant, concise, context-aware answers in real-time. It **renders Markdown**, so responses look clean and dynamic (headings, lists, code blocks, etc.).

*Update Guys, I shifted on Open AI model instead of Mistral because it was not working fine*
---

## Features

*  **Upload & Ask** — Upload a paper or paste the text, then ask questions according to your needs.
*  **Context-aware Q\&A** — Answers are generated using the uploaded content as context (not blind guessing).
*  **Markdown Rendering** — Outputs render in Markdown for clear, dynamic display (headings, bullet lists, code blocks, tables when available).
*  **Custom Frontend & Backend** — Everything built by me to match the workflow I wanted.
*  **Mobile Responsive** — Works smoothly on phones, tablets, and desktops.
*  **Real-time Interaction** — Fast replies so you can iterate quickly while reading a paper.

---

##  Tech Stack

* **Model**: ~~Mistral-7B-Instruct-v0.3~~  OpenAI gpt-oss-120b (via Hugging Face)
* **Frontend**: Custom-built (mobile-first layout)
* **Backend**: Custom API integrated with Hugging Face model calls
* **Hosting**: (Add your hosting details here — e.g., Vercel, Hugging Face Spaces, or your server)

---

##  How It Works (step-by-step)

1. **Upload or paste** the research paper text into the app.
2. The app uses that uploaded content as **context** for the model.
3. **Ask any question** about the paper (methodology, results, why they did X, etc.).
4. CogitoGPT returns an answer based on the uploaded text — rendered in Markdown so it’s clean and easy to read.

---

## Usage Example

* **User**: Uploads a 10-page research article.
* **User**: Asks — “What methodology did they use for the experiments?”
* **CogitoGPT**: Replies with a clear explanation derived from the uploaded content, formatted with headings and bullet points.
* **User**: Asks — “Show me the model architecture as a short list.”
* **CogitoGPT**: Outputs a concise, markdown-rendered list outlining the architecture.

#### You can test it here - [CogitoGPT](https://cogitogpt.vercel.app/)
---

##  Why CogitoGPT?

* Cuts the friction of reading dense academic text.
* Lets you interact with the paper instead of skimming for answers.
* Clean, shareable outputs thanks to Markdown rendering.
* Designed by someone who actually needed this while working in research (me 😅).

---


##  Credits

* Built with ❤️ by Mohsin

---
