function openTool(toolName) {
  if (toolName !== "AI Assistant") {
    alert(
      toolName +
      "\n\nИнструмент скоро будет доступен 🚀"
    );
    return;
  }

  createChat();
}

function createChat() {
  if (document.getElementById("ai-chat")) return;

  const chat = document.createElement("div");
  chat.id = "ai-chat";

  chat.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.75);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:9999;
      padding:20px;
    ">
      <div style="
        width:100%;
        max-width:500px;
        height:600px;
        background:#111;
        border:1px solid #333;
        border-radius:20px;
        display:flex;
        flex-direction:column;
        overflow:hidden;
        color:white;
      ">
        <div style="
          padding:18px;
          border-bottom:1px solid #333;
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">
          <strong>🤖 AI Assistant</strong>
          <button id="close-chat" style="
            background:none;
            border:none;
            color:white;
            font-size:24px;
            cursor:pointer;
          ">×</button>
        </div>

        <div id="chat-messages" style="
          flex:1;
          padding:15px;
          overflow-y:auto;
          font-size:15px;
        ">
          <div style="margin-bottom:15px;">
            🤖 Привет! Я AI Assistant. Чем могу помочь?
          </div>
        </div>

        <div style="
          display:flex;
          gap:8px;
          padding:12px;
          border-top:1px solid #333;
        ">
          <input
            id="chat-input"
            type="text"
            placeholder="Напиши сообщение..."
            style="
              flex:1;
              padding:12px;
              border-radius:10px;
              border:1px solid #444;
              background:#222;
              color:white;
              outline:none;
            "
          >

          <button id="send-message" style="
            padding:12px 16px;
            border:none;
            border-radius:10px;
            background:#fff;
            color:#000;
            cursor:pointer;
          ">➤</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(chat);

  document.getElementById("close-chat").onclick = () => {
    chat.remove();
  };

  const input = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-message");
  const messages = document.getElementById("chat-messages");

  async function sendMessage() {
    const message = input.value.trim();

    if (!message) return;

    messages.innerHTML += `
      <div style="
        text-align:right;
        margin-bottom:15px;
      ">
        🧑 ${escapeHtml(message)}
      </div>
    `;

    input.value = "";

    messages.innerHTML += `
      <div id="ai-loading" style="margin-bottom:15px;">
        🤖 Думаю...
      </div>
    `;

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

      const loading = document.getElementById("ai-loading");
      if (loading) loading.remove();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка сервера");
      }

      messages.innerHTML += `
        <div style="
          margin-bottom:15px;
          white-space:pre-wrap;
        ">
          🤖 ${escapeHtml(data.reply)}
        </div>
      `;

    } catch (error) {
      const loading = document.getElementById("ai-loading");
      if (loading) loading.remove();

      messages.innerHTML += `
        <div style="
          color:#ff6b6b;
          margin-bottom:15px;
        ">
          ❌ ${escapeHtml(error.message)}
        </div>
      `;
    }

    messages.scrollTop = messages.scrollHeight;
  }

  sendButton.onclick = sendMessage;

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  input.focus();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("AI Factory запущен!");
});
