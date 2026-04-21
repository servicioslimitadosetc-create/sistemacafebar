const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'scb26';
const KEY = 'state';

exports.handler = async (event) => {
  const store = getStore(STORE_NAME);

  // GET: cargar datos
  if (event.httpMethod === 'GET') {
    try {
      const raw = await store.get(KEY);
      if (!raw) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employees: [], shifts: {}, nextId: 9 }),
        };
      }
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: raw,
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  // POST: guardar datos
  if (event.httpMethod === 'POST') {
    try {
      await store.set(KEY, event.body);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
