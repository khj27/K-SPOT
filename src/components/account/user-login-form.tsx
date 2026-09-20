"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, signOut } from "firebase/auth";
import { getFirebaseUserAuth } from "@/lib/firebase/client";

export function UserLoginForm({ configured }: { configured: boolean }) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password") ?? "");
    let created = false;
    try {
      const auth = getFirebaseUserAuth();
      if (mode === "reset") {
        try { await sendPasswordResetEmail(auth, email); }
        catch (error) { if ((error as { code?: string }).code !== "auth/user-not-found") throw error; }
        setMessage("가입된 이메일이라면 비밀번호 재설정 안내가 전송됩니다. 받은편지함과 스팸함을 확인해 주세요."); return;
      }
      if (mode === "signup" && password !== form.get("confirm")) { setMessage("비밀번호 확인이 일치하지 않습니다."); return; }
      const credential = mode === "signup" ? await createUserWithEmailAndPassword(auth, email, password) : await signInWithEmailAndPassword(auth, email, password);
      created = mode === "signup";
      if (created) await updateProfile(credential.user, { displayName: String(form.get("name")).trim() });
      const response = await fetch("/api/account/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken: await credential.user.getIdToken(true) }) });
      if (!response.ok) throw Object.assign(new Error("SESSION_FAILED"), { code: "session/failed" });
      await signOut(auth);
      // A full navigation resets the document's per-account local-storage scope.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/mypage");
    } catch (error) {
      const code = (error as { code?: string }).code;
      const details: Record<string, string> = {
        "auth/network-request-failed": "인증 서버에 연결하지 못했습니다. 네트워크 또는 브라우저의 연결 차단 설정을 확인해 주세요.",
        "auth/invalid-credential": "이메일 또는 비밀번호가 일치하지 않습니다.",
        "auth/unauthorized-domain": "현재 사이트의 Firebase 인증 도메인 설정이 필요합니다.",
        "session/failed": "계정 인증은 성공했으나 로그인 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      };
      setMessage(created ? "계정은 생성되었으나 로그인 연결에 실패했습니다. 로그인 탭에서 다시 시도해 주세요." : details[code ?? ""] ?? (code === "auth/too-many-requests" ? "요청이 많습니다. 잠시 후 다시 시도해 주세요." : code === "auth/weak-password" ? "더 긴 비밀번호를 사용해 주세요." : code === "auth/email-already-in-use" ? "가입할 수 없는 이메일입니다. 기존 계정이라면 로그인 또는 비밀번호 재설정을 이용해 주세요." : `처리하지 못했습니다. 다시 시도해 주세요.${code && /^(auth|app)\/[a-z-]+$/.test(code) ? ` (${code})` : ""}`));
      try { await signOut(getFirebaseUserAuth()); } catch { /* Keep the original user-facing error. */ }
    } finally { setBusy(false); }
  }
  return <section className="travel-backup auth-card"><div className="auth-mode-switch" role="group" aria-label="계정 메뉴">{(["login", "signup", "reset"] as const).map((value) => <button type="button" key={value} disabled={busy} aria-pressed={mode === value} onClick={() => { setMode(value); setMessage(""); }}>{value === "login" ? "로그인" : value === "signup" ? "회원가입" : "비밀번호 재설정"}</button>)}</div><div className="auth-mode-heading"><h2>{mode === "login" ? "다시 만나서 반가워요" : mode === "signup" ? "나의 여행을 모아보세요" : "비밀번호를 잊으셨나요?"}</h2><p>{mode === "login" ? "이메일과 비밀번호로 로그인하세요." : mode === "signup" ? "간단한 가입 후 장소와 일정을 저장할 수 있어요." : "가입한 이메일로 재설정 안내를 보내드립니다."}</p></div><form key={mode} className="admin-login-form" onSubmit={submit}>
    {mode === "signup" && <label>이름 또는 닉네임<input name="name" autoComplete="nickname" required maxLength={60} /></label>}
    <label>이메일<input name="email" type="email" autoComplete="username" required maxLength={254} /></label>
    {mode !== "reset" && <label>비밀번호<input name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={mode === "signup" ? 8 : 6} required maxLength={128} /></label>}
    {mode === "signup" && <><label>비밀번호 확인<input name="confirm" type="password" autoComplete="new-password" minLength={8} required maxLength={128} /></label><p>저장한 장소와 일정은 같은 계정으로 다른 기기에서도 확인할 수 있습니다.</p></>}
    <button className="kspot-primary-button" disabled={busy || !configured} type="submit">{busy ? "처리 중…" : mode === "login" ? "로그인하기" : mode === "signup" ? "계정 만들기" : "재설정 메일 보내기"}</button>
    <p className="form-feedback" role="status">{!configured ? "Firebase 설정이 필요합니다." : message}</p></form></section>;
}
