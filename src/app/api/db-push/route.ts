import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  const { secret } = await request.json().catch(() => ({ secret: "" }));
  if (secret !== "nexo-seed-2026") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const { stdout, stderr } = await execAsync("npx prisma db push --accept-data-loss", {
      env: { ...process.env, PATH: process.env.PATH },
      timeout: 30000,
    });
    return NextResponse.json({ success: true, stdout, stderr });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stdout: error.stdout, stderr: error.stderr }, { status: 500 });
  }
}
