import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

function anonClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );
}

function phoneToEmail(digits: string): string {
  const clean = digits.replace(/\D/g, "");
  return `${clean}@vault-auth.app`;
}

async function getUserFromToken(token: string) {
  const { data: { user }, error } = await serviceClient().auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// ── Sign Up ──────────────────────────────────────────────────────────────────
app.post("/make-server-e14daf12/auth/signup", async (c) => {
  const body = await c.req.json();
  const rawSignupPhone: string = body.phone ?? "";
  const signupPassword: string = body.password ?? "";
  const fullName: string = body.fullName ?? "";

  // Always store digits-only so displayed phone always matches the login email
  const signupPhone = rawSignupPhone.replace(/\D/g, "");

  if (!signupPhone || !signupPassword || !fullName) {
    return c.json({ error: "All fields are required" }, 400);
  }

  const email = phoneToEmail(signupPhone);

  const { data, error } = await serviceClient().auth.admin.createUser({
    email,
    password: signupPassword,
    user_metadata: { fullName, phone: signupPhone },
    email_confirm: true,
  });

  if (error) {
    console.log("Signup error:", error.message);
    if (error.message.includes("already") || error.message.includes("registered")) {
      return c.json({ error: "Phone number already registered" }, 409);
    }
    return c.json({ error: error.message }, 400);
  }

  const userId = data.user.id;
  await kv.set(`vault_user_${userId}_name`, fullName);

  const { data: session, error: signInErr } = await anonClient().auth.signInWithPassword({
    email,
    password: signupPassword,
  });
  if (signInErr) {
    return c.json({ error: "Account created but sign-in failed: " + signInErr.message }, 500);
  }

  return c.json({
    token: session.session!.access_token,
    refreshToken: session.session!.refresh_token,
    userId,
    fullName,
    phone: (session.user?.email ?? "").replace(/@vault-auth\.app$/, ""),
  });
});

// ── Sign In ──────────────────────────────────────────────────────────────────
app.post("/make-server-e14daf12/auth/signin", async (c) => {
  const body = await c.req.json();
  const rawSigninPhone: string = body.phone ?? "";
  const signinPassword: string = body.password ?? "";

  // Normalize to digits-only — same transformation used when building the email
  const signinPhone = rawSigninPhone.replace(/\D/g, "");

  if (!signinPhone || !signinPassword) {
    return c.json({ error: "Phone and password are required" }, 400);
  }

  const email = phoneToEmail(signinPhone);
  const { data, error } = await anonClient().auth.signInWithPassword({
    email,
    password: signinPassword,
  });

  if (error) {
    console.log("Signin error:", error.message);
    return c.json({ error: "Incorrect phone number or password" }, 401);
  }

  const userId = data.user.id;
  const fullName = await kv.get(`vault_user_${userId}_name`) ?? "";
  // Derive phone from the email (most reliable — email is always "digits@vault-auth.app")
  const returnedPhone: string = (data.user.email ?? "").replace(/@vault-auth\.app$/, "");

  return c.json({
    token: data.session!.access_token,
    refreshToken: data.session!.refresh_token,
    userId,
    fullName,
    phone: returnedPhone,
  });
});

// Parses a raw KV value into a user item object.
function parseKvItem(v: any): any | null {
  try {
    const item = typeof v === "string" ? JSON.parse(v) : v;
    if (item && !Array.isArray(item) && typeof item.id === "string") return item;
    return null;
  } catch { return null; }
}

// ── Get user data ─────────────────────────────────────────────────────────────
app.get("/make-server-e14daf12/user/data", async (c) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  const user = await getUserFromToken(token ?? "");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const uid = user.id;

  const [linkValues, colValues, name] = await Promise.all([
    kv.getByPrefix(`vault_user_${uid}_link_`),
    kv.getByPrefix(`vault_user_${uid}_col_`),
    kv.get(`vault_user_${uid}_name`),
  ]);

  // Email is always "digits@vault-auth.app" — extract digits as the authoritative phone
  const storedPhone: string = (user.email ?? "").replace(/@vault-auth\.app$/, "");

  let links: any[] = linkValues.map(parseKvItem).filter(Boolean);
  let collections: any[] = colValues.map(parseKvItem).filter(Boolean);

  if (links.length === 0) {
    const old = await kv.get(`vault_user_${uid}_links`);
    if (old && Array.isArray(old) && old.length > 0) {
      links = old;
      Promise.all(old.map((l: any) => kv.set(`vault_user_${uid}_link_${l.id}`, JSON.stringify(l))))
        .catch(console.error);
    }
  }
  if (collections.length === 0) {
    const old = await kv.get(`vault_user_${uid}_collections`);
    if (old && Array.isArray(old) && old.length > 0) {
      collections = old;
      Promise.all(old.map((col: any) => kv.set(`vault_user_${uid}_col_${col.id}`, JSON.stringify(col))))
        .catch(console.error);
    }
  }

  links.sort((a: any, b: any) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  collections.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return c.json({ links, collections, name: name ?? "", phone: storedPhone });
});

// ── Save user data ────────────────────────────────────────────────────────────
app.post("/make-server-e14daf12/user/data", async (c) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  const user = await getUserFromToken(token ?? "");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const uid = user.id;
  const body = await c.req.json();

  if (body.links !== undefined) {
    const newLinks: any[] = body.links;
    const newIdSet = new Set(newLinks.map((l: any) => l.id));
    const existingValues = await kv.getByPrefix(`vault_user_${uid}_link_`);
    const existingIds = existingValues.map(parseKvItem).filter(Boolean).map((l: any) => l.id);
    const deletedIds = existingIds.filter((id: string) => !newIdSet.has(id));
    await Promise.all([
      ...deletedIds.map((id: string) => kv.del(`vault_user_${uid}_link_${id}`)),
      ...newLinks.map((l: any) => kv.set(`vault_user_${uid}_link_${l.id}`, JSON.stringify(l))),
    ]);
  }

  if (body.collections !== undefined) {
    const newCols: any[] = body.collections;
    const newIdSet = new Set(newCols.map((col: any) => col.id));
    const existingValues = await kv.getByPrefix(`vault_user_${uid}_col_`);
    const existingIds = existingValues.map(parseKvItem).filter(Boolean).map((col: any) => col.id);
    const deletedIds = existingIds.filter((id: string) => !newIdSet.has(id));
    await Promise.all([
      ...deletedIds.map((id: string) => kv.del(`vault_user_${uid}_col_${id}`)),
      ...newCols.map((col: any) => kv.set(`vault_user_${uid}_col_${col.id}`, JSON.stringify(col))),
    ]);
  }

  if (body.name !== undefined) {
    await kv.set(`vault_user_${uid}_name`, body.name);
  }

  return c.json({ ok: true });
});

// ── Delete Account ────────────────────────────────────────────────────────────
app.delete("/make-server-e14daf12/auth/account", async (c) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  const user = await getUserFromToken(token ?? "");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const uid = user.id;

  const [linkValues, colValues] = await Promise.all([
    kv.getByPrefix(`vault_user_${uid}_link_`),
    kv.getByPrefix(`vault_user_${uid}_col_`),
  ]);
  const linkIds = linkValues.map(parseKvItem).filter(Boolean).map((l: any) => l.id);
  const colIds  = colValues.map(parseKvItem).filter(Boolean).map((col: any) => col.id);

  await Promise.all([
    ...linkIds.map((id: string) => kv.del(`vault_user_${uid}_link_${id}`)),
    ...colIds.map((id: string)  => kv.del(`vault_user_${uid}_col_${id}`)),
    kv.del(`vault_user_${uid}_name`),
    kv.del(`vault_user_${uid}_links`),
    kv.del(`vault_user_${uid}_collections`),
    kv.del(`vault_user_${uid}_link_ids`),
    kv.del(`vault_user_${uid}_col_ids`),
  ]);

  const { error } = await serviceClient().auth.admin.deleteUser(uid);
  if (error) {
    console.log("Delete user error:", error.message);
    return c.json({ error: error.message }, 500);
  }

  return c.json({ ok: true });
});

// ── Forgot Password ───────────────────────────────────────────────────────────
app.post("/make-server-e14daf12/auth/forgot-password", async (c) => {
  const body = await c.req.json();
  const fpPhone: string = body.phone ?? "";
  if (!fpPhone) return c.json({ error: "Phone number required" }, 400);

  const digits = fpPhone.replace(/\D/g, "");
  if (!digits) return c.json({ error: "Invalid phone number" }, 400);

  const email = phoneToEmail(digits);
  const { data: users } = await serviceClient().auth.admin.listUsers();
  const exists = users?.users?.some((u) => u.email === email);
  if (!exists) return c.json({ error: "No account found with this phone number" }, 404);

  const code = String(Math.floor(1000 + Math.random() * 9000));
  const expiresAt = Date.now() + 10 * 60 * 1000;

  await kv.set(`vault_otp_${digits}`, JSON.stringify({ code, expiresAt }));
  console.log(`OTP for ${digits}: ${code}`);

  return c.json({ ok: true, code });
});

// ── Verify OTP ────────────────────────────────────────────────────────────────
app.post("/make-server-e14daf12/auth/verify-otp", async (c) => {
  const body = await c.req.json();
  const otpPhone: string = body.phone ?? "";
  const otpCode: string = body.code ?? "";
  if (!otpPhone || !otpCode) return c.json({ error: "Phone and code required" }, 400);

  const digits = otpPhone.replace(/\D/g, "");
  const raw = await kv.get(`vault_otp_${digits}`);
  if (!raw) return c.json({ error: "No code found. Please request a new one." }, 400);

  const stored = JSON.parse(raw as string) as { code: string; expiresAt: number };

  if (Date.now() > stored.expiresAt) {
    await kv.del(`vault_otp_${digits}`);
    return c.json({ error: "Code expired. Please request a new one." }, 400);
  }
  if (otpCode !== stored.code) {
    return c.json({ error: "Incorrect code. Please try again." }, 400);
  }

  const resetToken = `${digits}_${Date.now()}`;
  await kv.set(`vault_reset_${resetToken}`, JSON.stringify({ phone: digits, expiresAt: Date.now() + 15 * 60 * 1000 }));
  await kv.del(`vault_otp_${digits}`);

  return c.json({ ok: true, resetToken });
});

// ── Reset Password ────────────────────────────────────────────────────────────
app.post("/make-server-e14daf12/auth/reset-password", async (c) => {
  const body = await c.req.json();
  const resetToken: string = body.resetToken ?? "";
  const newPassword: string = body.newPassword ?? "";
  if (!resetToken || !newPassword) return c.json({ error: "Missing fields" }, 400);

  const raw = await kv.get(`vault_reset_${resetToken}`);
  if (!raw) return c.json({ error: "Invalid or expired reset token" }, 400);

  const stored = JSON.parse(raw as string) as { phone: string; expiresAt: number };
  if (Date.now() > stored.expiresAt) {
    await kv.del(`vault_reset_${resetToken}`);
    return c.json({ error: "Reset link expired. Please start again." }, 400);
  }

  const email = phoneToEmail(stored.phone);
  const { data: users } = await serviceClient().auth.admin.listUsers();
  const acct = users?.users?.find((u) => u.email === email);
  if (!acct) return c.json({ error: "Account not found" }, 404);

  const { error } = await serviceClient().auth.admin.updateUserById(acct.id, { password: newPassword });
  if (error) return c.json({ error: error.message }, 500);

  await kv.del(`vault_reset_${resetToken}`);
  return c.json({ ok: true });
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/make-server-e14daf12/health", (c) => c.json({ status: "ok" }));

Deno.serve(app.fetch);
