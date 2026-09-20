function openTool(toolName) {
  if (toolName === "AI Assistant") {
    createChat();
    return;
  }

  alert(
    toolName +
    "\n\nЭтот инструмент пока находится в разработке 🚀"
  );
}

function createChat() {
  if (document.getElementById("ai-chat")) return;

  const chat = document.createElement("div");
  chat.id = "ai-chat";

  chat.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      z-index:99999;
      background:rgba(0,0,0,.8);
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
      box-sizing:border-box;
    ">

      <div style="
        width:100%;
        max-width:520px;
        height:650px;
        background:#111;
        color:white;
        border-radius:20px;
        overflow:hidden;
        display:flex;
        flex-direction:column;
        border:1px solid #333;
        box-shadow:0 20px 60px rgba(0,0,0,.5);
      ">

        <div style="
          padding:18px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          border-bottom:1px solid #333;
        ">
          <div>
            <strong style="font-size:18px;">
              🤖 AI Assistant
            </strong>
            <div style="
              color:#888;
              font-size:12px;
              margin-top:4px;
            ">
              AI Factory
            </div>
          </div>

          <button
            id="close-ai-chat"
            type="button"
            style="
              background:none;
              border:0;
              color:white;
              font-size:28px;
              cursor:pointer;
            "
          >
            ×
          </button>
        </div>

        <div
          id="ai-messages"
          style="
            flex:1;
            overflow-y:auto;
            padding:18px;
            box-sizing:border-box;
          "
        >
          <div style="
            background:#222;
            padding:12px;
            border-radius:12px;
            margin-bottom:12px;
          ">
            🤖 Привет! Я AI Assistant. Чем могу помочь?
          </div>
        </div>

        <div style="
          padding:12px;
          border-top:1px solid #333;
          display:flex;
          gap:8px;
        ">

          <input
            id="ai-input"
            type="text"
            placeholder="Напиши сообщение..."
            autocomplete="off"
            style="
              flex:1;
              min-width:0;
              padding:13px;
              border-radius:12px;
              border:1px solid #444;
              background:#222;
              color:white;
              outline:none;
              box-sizing:border-box;
            "
          >

          <button
            id="ai-send"
            type="button"
            style="
              width:50px;
              border:0;
              border-radius:12px;
              background:white;
              color:black;
              font-size:20px;
              cursor:pointer;
            "
          >
            ➤
          </button>

        </div>

      </div>
    </div>
  `;

  document.body.appendChild(chat);

  const closeButton = document.getElementById("close-ai-chat");
  const input = document.getElementById("ai-input");
  const sendButton = document.getElementById("ai-send");
  const messages = document.getElementById("ai-messages");

  closeButton.addEventListener("click", () => {
    chat.remove();
  });

  async function sendMessage() {
    const message = input.value.trim();

    if (!message) return;

    addMessage("🧑 " + escapeHtml(message), true);

    input.value = "";
    input.disabled = true;
    sendButton.disabled = true;

    const loading = document.createElement("div");

    loading.id = "ai-loading";
    loading.style.cssText = `
      background:#222;
      padding:12px;
      border-radius:12px;
      margin-bottom:12px;
    `;

    loading.textContent = "🤖 Думаю...";
    messages.appendChild(loading);
    messages.scrollTop = messages.scrollHeight;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message
        })
      });

      const data = await response.json();

      loading.remove();

      if (!response.ok) {
        throw new Error(
          data.error || "Ошибка сервера"
        );
      }

      addMessage(
        "🤖 " + escapeHtml(data.reply),
        false
      );

    } catch (error) {

      loading.remove();

      addMessage(
        "❌ Ошибка: " + escapeHtml(error.message),
        false
      );

    } finally {
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  }

  function addMessage(text, user) {
    const messageElement = document.createElement("div");

    messageElement.style.cssText = `
      padding:12px;
      border-radius:12px;
      margin-bottom:12px;
      white-space:pre-wrap;
      line-height:1.5;
      ${user
        ? "background:#333;text-align:right;"
        : "background:#222;"
      }
    `;

    messageElement.innerHTML = text;

    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
  }

  sendButton.addEventListener(
    "click",
    sendMessage
  );

  input.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    }
  );

  input.focus();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

console.log("AI Factory app.js загружен");
