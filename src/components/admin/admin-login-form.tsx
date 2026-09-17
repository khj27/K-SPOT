"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

import { getFirebaseClientAuth } from "@/lib/firebase/client";

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const credential = await signInWithEmailAndPassword(getFirebaseClientAuth(), String(form.get("email")), String(form.get("password")));
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken: await credential.user.getIdToken() }) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "관리자 세션을 만들지 못했습니다.");
      router.replace("/admin");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "로그인하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <label><span>관리자 이메일</span><input autoComplete="username" name="email" type="email" required /></label>
      <label><span>비밀번호</span><input autoComplete="current-password" name="password" type="password" minLength={6} required /></label>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      {!configured && <p className="admin-setup-message">Firebase 환경 변수를 설정하면 로그인을 사용할 수 있습니다.</p>}
      <button className="kspot-primary-button" disabled={!configured || submitting} type="submit">{submitting ? "확인 중…" : "관리자 로그인"}</button>
    </form>
  );
}
