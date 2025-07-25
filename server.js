// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para permitir JSON y CORS (permite que el frontend acceda)
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente ✅');
});

// Ruta para recibir el formulario
app.post('/turno', (req, res) => {
  console.log('Datos recibidos:', req.body);
  res.status(200).send('Turno recibido correctamente.');
});

// Render necesita usar el puerto de process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});