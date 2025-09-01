import dotenv from "dotenv";
dotenv.config({ path: "../../../../.env" });

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ message: "Invalid password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    
    return new Response(JSON.stringify({ message: "Password correct" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
