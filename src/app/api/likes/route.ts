import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { likes } from "@/db/schema";
import { rateLimit } from "@/lib/security/rate-limit";

const likeSchema = z.object({
  postId: z.string().uuid(),
  fingerprint: z.string().min(16).max(128)
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const limited = rateLimit({
    key: `likes:${ip}`,
    limit: 30,
    windowMs: 60_000
  });

  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, message: "Too many requests." },
      { status: 429 }
    );
  }

  const parsed = likeSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid like payload." },
      { status: 400 }
    );
  }

  const db = getDb();

  if (!db) {
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    await db.insert(likes).values(parsed.data).onConflictDoNothing();
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to store like." },
      { status: 500 }
    );
  }
}
