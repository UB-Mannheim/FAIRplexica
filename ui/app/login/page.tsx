"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (result?.ok) {
      router.push("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <main className="max-w-sm mx-auto mt-20">
      <div className="flex items-center pt-4 mb-2">
        <LogIn />
        <h1 className="text-2xl ml-2">Login</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded-lg"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border p-2 rounded-lg"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-light-200 text-white py-2 rounded-lg">
          Sign In
        </button>
      </form>
    </main>
  );
}
