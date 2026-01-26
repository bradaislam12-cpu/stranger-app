/* 🎨 المتغيرات الأساسية ونظام الألوان */
:root {
  /* الوضع النهاري (Default) */
  --bg: #f0f2f5;
  --card: #ffffff;
  --text: #1c1e21;
  --text-muted: #65676b;
  --p: #075e54;
  --p-light: #128c7e;
  --p-dark: #05413a;
  --accent: #25d366;
  --danger: #d9534f;
  --header-h: 60px;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --radius: 12px;
}

/* 🌙 الوضع الليلي (Dark Mode) */
body.dark-mode {
  --bg: #121212;
  --card: #1e1e1e;
  --text: #e4e6eb;
  --text-muted: #b0b3b8;
  --p: #05413a;
  --p-light: #075e54;
  --shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

/* 🧱 الإعدادات العامة */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  transition: background 0.3s, color 0.3s;
  overflow-x: hidden;
}

/* 🟩 الهيدر (Navigation) */
.header {
  height: var(--header-h);
  background: var(--p);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 🔘 الأزرار (Buttons) */
button, .start-btn, .friend-btn {
  cursor: pointer;
  border: none;
  outline: none;
  border-radius: var(--radius);
  transition: all 0.2s ease;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.start-btn {
  background: var(--accent);
  color: white;
  padding: 14px 25px;
  width: 100%;
  font-size: 1.1rem;
}

.start-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.friend-btn {
  background: var(--p-light);
  color: white;
  padding: 8px 16px;
}

.icon-btn {
  background: transparent;
  color: inherit;
  font-size: 1.4rem;
  padding: 5px;
}

/* 🗂️ الصناديق والنماذج (Forms & Cards) */
.auth-box, .profile-form, .register-form {
  max-width: 450px;
  width: 90%;
  margin: 40px auto;
  padding: 30px;
  background: var(--card);
  border-radius: 20px;
  box-shadow: var(--shadow);
}

input, select, textarea {
  width: 100%;
  padding: 12px 15px;
  margin: 8px 0 20px 0;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
}

input:focus {
  border-color: var(--p);
}

/* 💬 نظام الدردشة (Chat UI) */
.msg-container {
  height: calc(100vh - 120px);
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.msg {
  max-width: 75%;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 18px;
  font-size: 0.95rem;
  position: relative;
}

.msg.me {
  align-self: flex-end;
  background: #dcf8c6; /* لون واتساب الشهير */
  color: #000;
  border-bottom-right-radius: 4px;
}

body.dark-mode .msg.me {
  background: #05413a;
  color: #fff;
}

.msg.them {
  align-self: flex-start;
  background: var(--card);
  border: 1px solid #eee;
  border-bottom-left-radius: 4px;
}

/* 🎥 الفيديو (Video Call) */
video {
  border-radius: var(--radius);
  background: #000;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

/* 📱 الشاشات الصغيرة */
@media (max-width: 600px) {
  .header h2 { font-size: 1rem; }
  .auth-box { padding: 20px; }
  .msg { max-width: 85%; }
}
