"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = "https://8d69-91-246-41-65.ngrok-free.app";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    console.log("💡 useEffect стартанул");

    // 🟢 Регистрируем функцию ДО загрузки скрипта
    // @ts-ignore
    window.handleTelegramLogin = async (userData: any) => {
      console.log("💥 handleTelegramLogin вызван");
      console.log("👤 Telegram user data:", userData);
      try {
        const res = await fetch(`${BACKEND_URL}/auth/telegram`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        console.log("📨 /auth/telegram статус:", res.status, res.statusText);
        const data = await res.json();
        console.log("📥 Ответ от /auth/telegram:", data);

        if (data.token) {
          console.log("✅ JWT received:", data.token);
          localStorage.setItem("token", data.token);

          const meRes = await fetch(`${BACKEND_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          });

          const me = await meRes.json();
          console.log("🔁 Ответ от /auth/me:", me);

          if (!me.error) {
            localStorage.setItem("user", JSON.stringify(me));
            window.location.reload(); // или setUser(me)
          }
        } else {
          console.warn("❌ Токен не получен в ответе:", data);
        }
      } catch (err) {
        console.error("❌ Ошибка в handleTelegramLogin:", err);
      }
    };

    // 🟢 Загружаем токен из localStorage
    const token = localStorage.getItem("token");
    console.log("📦 token из localStorage:", token);

    if (token) {
      fetch(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("🔁 Ответ от /auth/me при старте:", data);
          if (!data.error) setUser(data);
        })
        .catch((err) => console.error("❌ Ошибка при fetch /auth/me:", err));
    } else {
      console.log("⚠️ Токен отсутствует, не делаем /auth/me");
    }

    // 🟢 Вставляем Telegram widget
    console.log("📦 Вставляю Telegram widget");
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    script.setAttribute("data-telegram-login", "BotverseAuth_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "handleTelegramLogin(user)");
    document.getElementById("telegram-button")?.appendChild(script);
  }, []);

  return (
    <div className="p-10">
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <div id="telegram-button" />
      )}
    </div>
  );
}
