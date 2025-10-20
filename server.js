// Minimal Node.js server to serve sample CSV and simple prediction endpoint
// Run: node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'ai_model');

function sendJSON(res, obj){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}

const server = http.createServer((req, res) => {
  if (req.url === '/sample.csv') {
    const file = path.join(root, 'sample_data.csv');
    fs.createReadStream(file).pipe(res);
  } else if (req.url.startsWith('/predict')) {
    // simple query: /predict?pm25=45.2
    const url = new URL(req.url, 'http://localhost');
    const pm25 = parseFloat(url.searchParams.get('pm25') || '0');
    try {
      const params = JSON.parse(fs.readFileSync(path.join(root, 'model_params.json')));
      const pred = params.intercept + params.slope * pm25;
      sendJSON(res, {pm25, predicted_aqi: Math.max(0, Math.round(pred*100)/100)});
    } catch (e) {
      res.statusCode = 500;
      sendJSON(res, {error: 'Model not available. Run ai_model/aqi_predict.py first.'});
    }
  } else if (req.url === '/') {
    res.setHeader('Content-Type', 'text/plain');
    res.end('AeroSense backend. Endpoints: /sample.csv  /predict?pm25=45');
  } else {
    res.statusCode = 404; res.end('Not found');
  }
});

const port = 3000;
server.listen(port, () => console.log('Server running on http://localhost:' + port));
