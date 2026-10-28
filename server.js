import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const usersFilePath = './src/data/users.json';
const stationsFilePath = './src/data/stations-server.json'; // Archivo en el servidor para los surtidores

// --- RUTAS DE USUARIOS ---

app.get('/api/users', (req, res) => {
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al leer el archivo users.json');
    }
    try {
      const users = JSON.parse(data);
      res.json(users);
    } catch (parseErr) {
      res.status(500).send('Error al parsear users.json');
    }
  });
});

app.post('/api/users', (req, res) => {
  const newUser = req.body;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al leer el archivo users.json');
    }

    try {
      const users = JSON.parse(data);
      newUser.id = String(Date.now());
      users.push(newUser);

      fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          return res.status(500).send('Error al escribir en users.json');
        }
        res.status(201).json(newUser);
      });
    } catch (parseErr) {
      res.status(500).send('Error al procesar users.json');
    }
  });
});


// --- RUTAS DE SURTIDORES (Sincronización en la nube) ---

app.get('/api/stations', (req, res) => {
  if (!fs.existsSync(stationsFilePath)) {
    return res.json([]); // Si no existe aún, devuelve array vacío
  }
  fs.readFile(stationsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo de surtidores');
    }
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).send('Error al parsear surtidores');
    }
  });
});

app.put('/api/stations/:id', (req, res) => {
  const stationId = req.params.id;
  const updatedStation = req.body;

  fs.readFile(stationsFilePath, 'utf8', (err, data) => {
    let stationsList = [];
    if (!err && data) {
      try {
        stationsList = JSON.parse(data);
      } catch (e) {
        stationsList = [];
      }
    }

    const index = stationsList.findIndex((s) => String(s.id) === String(stationId));
    if (index !== -1) {
      stationsList[index] = updatedStation;
    } else {
      stationsList.push(updatedStation);
    }

    fs.writeFile(stationsFilePath, JSON.stringify(stationsList, null, 2), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).send('Error al guardar el surtidor');
      }
      res.json(updatedStation);
    });
  });
});

// Puerto dinámico compatible con Render y entorno local
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en el puerto ${PORT}`);
});