import { getStore } from "@netlify/blobs";

const STORE_NAME = "scb26";
const STATE_KEY  = "state";

// Datos semilla por si el store está vacío (primera vez)
const DEFAULT_STATE = {
  employees: [
    {id:1,name:'Ana Martínez',role:'Camarera',contract:'40h'},
    {id:2,name:'Carlos López',role:'Barista',contract:'40h'},
    {id:3,name:'María García',role:'Camarera',contract:'30h'},
    {id:4,name:'Javier Ruiz',role:'Cocinero',contract:'40h'},
    {id:5,name:'Laura Sanz',role:'Ayudante',contract:'20h'},
    {id:6,name:'Pedro Moreno',role:'Camarero',contract:'40h'},
    {id:7,name:'Sofía Castro',role:'Barista',contract:'30h'},
    {id:8,name:'Rubén Torres',role:'Ayudante',contract:'20h'},
  ],
  shifts: {},
  nextId: 9,
};

export default async (req, context) => {
  const store = getStore(STORE_NAME);

  // GET — devuelve el estado completo
  if (req.method === "GET") {
    try {
      const data = await store.get(STATE_KEY, { type: "json" });
      return Response.json(data ?? DEFAULT_STATE);
    } catch (err) {
      console.error("GET error:", err);
      return Response.json(DEFAULT_STATE);
    }
  }

  // POST — guarda el estado completo
  if (req.method === "POST") {
    try {
      const body = await req.json();
      // Validación mínima: que tenga las claves esperadas
      if (!body || typeof body !== "object" || !Array.isArray(body.employees)) {
        return Response.json({ ok: false, error: "Payload inválido" }, { status: 400 });
      }
      await store.set(STATE_KEY, JSON.stringify(body));
      return Response.json({ ok: true });
    } catch (err) {
      console.error("POST error:", err);
      return Response.json({ ok: false, error: String(err) }, { status: 500 });
    }
  }

  return Response.json({ error: "Método no permitido" }, { status: 405 });
};

export const config = {
  path: "/api/data",
};
