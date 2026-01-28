import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer, WebSocket } from 'ws';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  // Create WebSocket server
  const wss = new WebSocketServer({ server, path: '/' });

  console.log('WebSocket server initialized');

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    ws.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message from client:', data);

        // Echo back or handle client messages if needed
        // For now, we mainly broadcast from API routes
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connection',
      status: 'connected',
      timestamp: new Date().toISOString(),
    }));
  });

  // Export broadcast function for use in API routes
  global.wsBroadcast = (data: any) => {
    const message = JSON.stringify(data);
    let sentCount = 0;

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        sentCount++;
      }
    });

    if (sentCount > 0) {
      console.log(`Broadcast to ${sentCount} client(s):`, data.type);
    }
  };

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket ready on ws://${hostname}:${port}`);
  });
});
