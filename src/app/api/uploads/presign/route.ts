import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth/admin";
import { createPresignedUploadUrl } from "@/lib/storage/s3";

const presignSchema = z.object({
  key: z
    .string()
    .min(4)
    .max(240)
    .regex(/^(posts|documents|uploads|avatars)\/[a-zA-Z0-9._/-]+$/),
  contentType: z.string().min(3).max(120)
});

export async function POST(request: NextRequest) {
  const user = await getAdminUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const parsed = presignSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid upload request." },
      { status: 400 }
    );
  }

  try {
    const result = await createPresignedUploadUrl(parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unable to sign upload."
      },
      { status: 500 }
    );
  }
}
