import { get, url } from "./api";

export const isAuth = async () => {
  try {
    // let response = await get("auth/protected");
    const response = await (
      await fetch(url + "auth/protected", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
    ).json();

    console.log(response);

    // Verifica si fue exitoso
    if (response.success) return true;

    if (response.authError === "TOKEN_EXPIRED") {
      const refresh = await refreshToken();
      if (!refresh) return false;

      const response = await (
        await fetch(url + "auth/protected", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
      ).json();

      console.log(response);

      return response.success;
    }

    if (response.authError === "TOKEN_INVALID") {
      console.warn("Token inválido.");
      return false;
    }

    if (response.authError === "TOKEN_MISSING") {
      console.warn("Token no proporcionado.");
      return false;
    }

    console.warn("Error de autenticación no manejado:", response);
    return false;
  } catch (error) {
    console.error("Error al verificar autenticación:", error.message);
    return false;
  }
};

const refreshToken = async () => {
  const response = await (
    await fetch(url + "auth/refresh", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
  ).json();
  console.log(response);

  if (!response.success) console.error("Error al renovar token:", error);
  return response.success;
};
