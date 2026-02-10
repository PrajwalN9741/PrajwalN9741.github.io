document.addEventListener("DOMContentLoaded", () => {
  new PortfolioChatBot();
});

class PortfolioChatBot {
  constructor() {
    this.el = {
      btn: document.getElementById("prajwal-ai-btn"),
      box: document.getElementById("prajwal-ai-chat"),
      close: document.getElementById("prajwal-ai-close"),
      send: document.getElementById("prajwal-ai-send"),
      input: document.getElementById("prajwal-ai-text"),
      msgs: document.getElementById("prajwal-ai-messages")
    };

    this.data = {};
    this.isTyping = false;

    this.init();
    this.loadData();

    console.log("✅ Prajwal AI ChatBot Initialized");
  }

  /* ---------------- INIT ---------------- */
  init() {
    this.el.btn.addEventListener("click", () => {
      this.el.box.style.display = "flex";
      this.el.box.setAttribute("aria-hidden", "false");
      this.el.input.focus();
    });

    this.el.close.addEventListener("click", () => {
      this.el.box.style.display = "none";
      this.el.box.setAttribute("aria-hidden", "true");
    });

    this.el.send.addEventListener("click", () => this.handle());

    this.el.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.handle();
    });
  }

  /* ---------------- LOAD DATA ---------------- */
  async loadData() {
    try {
      const res = await fetch("assets/chatbot_qa.json");
      if (!res.ok) throw new Error("Fetch failed");
      this.data = await res.json();
    } catch (e) {
      console.error("⚠️ Chat data load error:", e);
      this.data = {
        fallback: {
          answer:
            "⚠️ I couldn't load my knowledge base.<br>Please run this site using <b>Live Server</b> or a local server."
        }
      };
    }
  }

  /* ---------------- HANDLE MESSAGE ---------------- */
  handle() {
    const text = this.el.input.value.trim();
    if (!text || this.isTyping) return;

    this.user(text);
    this.el.input.value = "";

    this.showTyping();

    setTimeout(() => {
      this.hideTyping();
      const reply = this.getReply(text.toLowerCase());
      this.bot(reply);
    }, 600);
  }

  /* ---------------- REPLY LOGIC ---------------- */
  getReply(msg) {
    if (!this.data || Object.keys(this.data).length === 0) {
      return "⏳ Still loading my brain… try again!";
    }

    for (const key in this.data) {
      if (key === "fallback") continue;

      const block = this.data[key];
      if (
        block.questions &&
        block.questions.some((q) => msg.includes(q))
      ) {
        return block.answer;
      }
    }

    return this.data.fallback?.answer || "🤖 I didn’t understand that.";
  }

  /* ---------------- MESSAGE UI ---------------- */
  user(text) {
    this.add(text, "user");
  }

  bot(text) {
    this.add(text, "bot");
  }

  add(text, type) {
    const div = document.createElement("div");
    div.className = `pmsg ${type}`;
    div.innerHTML = text.replace(/\n/g, "<br>");
    this.el.msgs.appendChild(div);
    this.el.msgs.scrollTop = this.el.msgs.scrollHeight;
  }

  /* ---------------- TYPING INDICATOR ---------------- */
  showTyping() {
    this.isTyping = true;

    const t = document.createElement("div");
    t.id = "typing";
    t.className = "typing-indicator";
    t.innerHTML = "<span></span><span></span><span></span>";

    this.el.msgs.appendChild(t);
    this.el.msgs.scrollTop = this.el.msgs.scrollHeight;
  }

  hideTyping() {
    const t = document.getElementById("typing");
    if (t) t.remove();
    this.isTyping = false;
  }
}
