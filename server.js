const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, 'turnos.json');

// Leer turnos guardados o crear archivo vacío si no existe
function leerTurnos() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, '[]', 'utf-8');
  }
  const data = fs.readFileSync(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

// Guardar turnos en archivo
function guardarTurnos(turnos) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(turnos, null, 2), 'utf-8');
}

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente ✅');
});

app.post('/turno', (req, res) => {
  const { nombre, telefono, barrio, mensaje, fecha, hora } = req.body;

  // Validar campos obligatorios
  if (
    !nombre?.trim() ||
    !telefono?.trim() ||
    !barrio?.trim() ||
    !fecha?.trim() ||
    !hora?.trim()
  ) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }

  // Validar que la fecha no sea domingo
  const dia = new Date(fecha + 'T00:00').getDay(); // 0 = domingo
  if (dia === 0) {
    return res.status(400).json({ error: 'No se pueden tomar turnos los domingos.' });
  }

  // (Opcional) Validar formato del teléfono: solo números, 8 a 15 dígitos
  const soloNumeros = /^[0-9]{8,15}$/;
  if (!soloNumeros.test(telefono)) {
    return res.status(400).json({ error: 'El teléfono debe contener solo números (entre 8 y 15 dígitos).' });
  }

  const nuevoTurno = { nombre, telefono, barrio, mensaje, fecha, hora };

  const turnos = leerTurnos();

  // Validar turno duplicado (fecha y hora)
  const existe = turnos.find(t => t.fecha === fecha && t.hora === hora);
  if (existe) {
    return res.status(409).json({ error: 'El turno ya está reservado.' });
  }

  // Guardar el nuevo turno
  turnos.push(nuevoTurno);
  guardarTurnos(turnos);

  console.log('✅ Turno guardado:', nuevoTurno);
  res.status(200).json({ message: 'Turno recibido y guardado correctamente.' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});