import jwt from "jsonwebtoken";

// Función para decodificar un JWT sin librerías
function parseJwt(token) {
  try {
    // El JWT tiene 3 partes: header.payload.signature
    const base64Payload = token.split(".")[1]; // agarramos la parte del payload
    const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/")); // decodificamos Base64
    return JSON.parse(payload); // lo convertimos a objeto
  } catch (e) {
    return null;
  }
}

// Ejemplo: un JWT de prueba
const token = jwt.sign(
  { sub: "123456", name: "Johan" },
  "mi_secreto",
  { expiresIn: "0s" } // el token será válido solo 15 minutos
);

// Decodificamos el payload
const payload = parseJwt(token);

if (payload) {
  console.log("Payload:", payload);

  console.log(Date.now() / 1000);
  console.log(payload.exp);

  // Revisamos expiración
  const now = Math.floor(Date.now() / 1000); // fecha actual en segundos
  if (payload.exp && now >= payload.exp) {
    console.log("❌ Token expirado");
  } else {
    console.log("✅ Token válido");
  }
}
