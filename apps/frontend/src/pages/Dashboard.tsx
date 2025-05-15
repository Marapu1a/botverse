import { useEffect, useState } from "react";
import { getMe } from "../api/client";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  if (!user) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="p-8 space-y-2">
      <h1 className="text-2xl font-bold">Привет, {user.firstName}!</h1>
      <p>Баланс: {user.balance} ₽</p>
    </div>
  );
}
