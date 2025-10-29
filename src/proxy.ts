import { NextResponse, type NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirige al login si no hay token
  }

  try {
    // ✅ Solo decodifica, no verifica la firma
    const decodedToken = jwt.decode(token) as JwtPayload | null;

    if (decodedToken && decodedToken.role) {
      const userRole = decodedToken.role;
      const path = req.nextUrl.pathname;

      // Protege rutas según el rol
      if (path.startsWith("/dashboard")) {
        if (path.includes("/supervisor") && userRole !== "supervisor") {
          return NextResponse.redirect(new URL("/access-denied", req.url));
        }
        if (path.includes("/asesor") && userRole !== "asesor") {
          return NextResponse.redirect(new URL("/access-denied", req.url));
        }
        if (path.includes("/estudiante") && userRole !== "estudiante") {
          return NextResponse.redirect(new URL("/access-denied", req.url));
        }
      }
    } else {
      return NextResponse.redirect(new URL("/access-denied", req.url)); // Token inválido
    }
  } catch (error) {
    console.error("Error decodificando token:", error);
    return NextResponse.redirect(new URL("/access-denied", req.url));
  }

  return NextResponse.next(); // Todo OK, continúa
}

export const config = {
  matcher: ["/dashboard/:path*"], // Rutas protegidas
};
