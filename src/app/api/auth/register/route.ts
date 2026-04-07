import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role, storeName } = body;

    // Validate required fields
    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (email, password, firstName)" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de correo electronico invalido" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contrasena debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["CUSTOMER", "SELLER"];
    const userRole = validRoles.includes(role) ? role : "CUSTOMER";

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo electronico" },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName: lastName || "",
        role: userRole,
      },
    });

    // If the user is a seller, create a store
    if (userRole === "SELLER" && storeName) {
      const slug = storeName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      await db.store.create({
        data: {
          ownerId: user.id,
          name: storeName,
          slug: slug || `store-${user.id.substring(0, 8)}`,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
