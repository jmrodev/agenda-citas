const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
}); 