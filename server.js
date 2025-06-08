import express from 'express';
import si from 'systeminformation';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());

app.get('/system-info', async (req, res) => {
  try {
    const [memory, processes] = await Promise.all([
      si.mem(),
      si.processes()
    ]);

    // Sort processes by memory usage
    const sortedProcesses = processes.list
      .sort((a, b) => b.mem - a.mem)
      .slice(0, 10);

    res.json({
      memory,
      processes: sortedProcesses
    });
  } catch (error) {
    console.error('Error fetching system info:', error);
    res.status(500).json({ error: 'Failed to fetch system information' });
  }
});

app.listen(port, () => {
  console.log(`System info server running at http://localhost:${port}`);
}); 