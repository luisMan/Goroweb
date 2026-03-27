export interface AdminSessionResult {
  authenticated: boolean;
  username?: string;
  error?: string;
  retryAfterMs?: number;
}

const baseHeaders = {
  "Content-Type": "application/json"
};

export async function getAdminSession(): Promise<AdminSessionResult> {
  const response = await fetch("/api/admin/session", {
    credentials: "include"
  });

  const payload = (await response.json().catch(() => null)) as AdminSessionResult | null;

  if (!response.ok) {
    return {
      authenticated: false,
      error: payload?.error || "Admin session is not active."
    };
  }

  return payload ?? { authenticated: false };
}

export async function loginAdmin(username: string, password: string): Promise<AdminSessionResult> {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    credentials: "include",
    headers: baseHeaders,
    body: JSON.stringify({ username, password })
  });

  const payload = (await response.json().catch(() => null)) as AdminSessionResult | null;

  if (!response.ok) {
    return {
      authenticated: false,
      error: payload?.error || "Admin login failed.",
      retryAfterMs: payload?.retryAfterMs
    };
  }

  return payload ?? { authenticated: false };
}

export async function logoutAdmin(): Promise<void> {
  await fetch("/api/admin/logout", {
    method: "POST",
    credentials: "include"
  });
}
