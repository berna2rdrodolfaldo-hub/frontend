import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const filePath = './src/data/users.json';

// Ruta GET para obtener los usuarios
app.get('/api/users', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
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

// Ruta POST para agregar un nuevo usuario
app.post('/api/users', (req, res) => {
  const newUser = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al leer el archivo users.json');
    }

    const users = JSON.parse(data);
    newUser.id = String(Date.now());
    users.push(newUser);

    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al escribir en users.json');
      }
      res.status(201).json(newUser);
    });
  });
});

app.listen(3001, () => {
  console.log('🚀 Servidor de usuarios ejecutándose en http://localhost:3001');
});