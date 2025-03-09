const express = require('express');
const promClient = require('prom-client');
const app = express();
const PORT = 4000; // put this as variable later maybe

// Create Prometheus metrics
const httpRequestDurationMicroseconds = new promClient.Counter({
    name: 'http_request_duration_seconds_total',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'status'],
  });
  
  // Expose metrics endpoint for Prometheus
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  });

// Simple hello world endpoint
app.get("/", (req, res, next) => {
    httpRequestDurationMicroseconds.inc({ method: 'GET', status: '200' }); // Increment counter for successful GET request
    res.sendFile(__dirname + '/public/index.html');
});

// Error route for testing error cases (500 errors)
app.get('/error', (req, res) => {
    httpRequestDurationMicroseconds.inc({ method: 'GET', status: '500' }); // Increment counter for error
    res.status(500).send('Server Error');
  });
  
  // Middleware to track errors
  app.use((err, req, res, next) => {
    if (err) {
      httpRequestDurationMicroseconds.inc({
        method: req.method,
        status: '500',
      });
    }
    next(err);
  });

app.listen(PORT, () => {
    console.log(`Web app is running on http://localhost:${PORT}`);
});