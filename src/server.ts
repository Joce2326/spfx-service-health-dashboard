import express from 'express';
import cors from 'cors';
import serviceHealthRoutes from './routes/serviceHealthRoutes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('M365 Service Health API is running');
});

app.use('/api/service-health', serviceHealthRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});