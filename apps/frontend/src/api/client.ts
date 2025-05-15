// api/index.ts
const BASE_URL = "https://18ee-91-246-41-65.ngrok-free.app";

const request = async (
    path: string,
    options: RequestInit = {}
): Promise<any> => {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            "ngrok-skip-browser-warning": "true", // 🧠 ключевая строка
        },
    });

    return res.json();
};

export const loginWithTelegram = (user: any) =>
    request("/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

export const getMe = () =>
    request("/me", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
