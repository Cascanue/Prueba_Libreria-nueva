require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Configuración exacta con tus credenciales de Aiven
const db = mysql.createConnection({
    host: 'mysql-955eb71-bookcenter27.b.aivencloud.com',
    user: 'avnadmin',
    password: process.env.AIVEN_PASSWORD, // <--- ¡AQUÍ ESTÁ LA MAGIA!
    port: 22639,
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false }
});

// 2. Probar la conexión
db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
    } else {
        console.log('✅ Conectado exitosamente a la base de datos en la nube.');
    }
});

// 3. Ruta para registrar al cliente (CU-02)
app.post('/api/registrar-cliente', (req, res) => {
    const { documento, nombre, telefono, correo } = req.body;
    const query = 'INSERT INTO Cliente (documento, nombre, telefono, correo) VALUES (?, ?, ?, ?)';
    
    db.query(query, [documento, nombre, telefono, correo], (err, results) => {
        if (err) {
            console.error('Error insertando datos:', err);
            return res.status(500).json({ mensaje: 'Error al registrar el cliente' });
        }
        res.status(200).json({ mensaje: 'Cliente registrado exitosamente' });
    });
});

// 4. Encender el servidor
app.listen(3000, () => {
    console.log('🚀 Servidor Backend de Book Center corriendo en el puerto 3000');
});