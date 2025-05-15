import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithTelegram } from "../api/client";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Объявляем callback ДО загрузки скрипта
    // @ts-ignore
    window.onTelegramAuth = async (user) => {
      const res = await loginWithTelegram(user);
      if (res.token) {
        localStorage.setItem("token", res.token);
        navigate("/dashboard");
      } else {
        alert("Ошибка авторизации");
      }
    };

    // 2. Загружаем виджет
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "BotverseAuth_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-lang", "ru");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    const container = document.getElementById("telegram-login-btn");
    container?.appendChild(script);

    return () => {
      container?.replaceChildren(); // безопасная очистка
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div id="telegram-login-btn"></div>
    </div>
  );
}
