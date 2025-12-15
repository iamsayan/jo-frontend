import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = request.headers.get("x-webhook-secret");
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Invalid webhook secret" }, { status: 401 });
    }

    const body = await request.json();
    const { model } = body;

    if (!model) {
      return NextResponse.json({ message: "Missing required fields: model" }, { status: 400 });
    }

    revalidateTag(model, "max");

    return NextResponse.json({
      revalidated: true,
      tag: model,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ message: "Error revalidating", error: (err as Error).message }, { status: 500 });
  }
}
