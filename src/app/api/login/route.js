import { NextResponse } from "next/server";

// Simple local login endpoint (for the offline version).
// Change these credentials before using in production.
const DEMO_USER = {
  username: "admin",
  password: "1234",
  name: "MCS Admin",
  role: "admin",
};

export async function POST(req) {
  try {
    const body = await req.json();
    const username = String(body?.username || "").trim();
    const password = String(body?.password || "");

    if (username === DEMO_USER.username && password === DEMO_USER.password) {
      return NextResponse.json({
        ok: true,
        user: { username: DEMO_USER.username, name: DEMO_USER.name, role: DEMO_USER.role },
      });
    }

    return NextResponse.json({ ok: false, error: "Invalid username/password" }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
