# AeroSense — Intelligent Air Quality & Climate Analyzer



**Short goal:** Collect air/gas sensor data or API feeds, train a lightweight regression model to predict AQI from PM2.5, and visualize results on a clean dashboard. This repo contains minimal main files so you can run it quickly.

PM2.5AQI (Trained model)
![PM2.5AQI (Trained model)
![Visualization of PM2.5-to-AQI regression model predictions](image.jpeg)
](imagehttps://github.com/Adarshbind2004/Aero-sense-intelligence-/blob/0a1a309ef7fb7ed5ce441de5db7d925dd74630f4/IMG_3086.png)


---

## What is included (main files)
- `frontend/` — lightweight D3.js dashboard (index.html, style.css, dashboard.js)
- `backend/` — minimal Node.js server (`server.js`) serving sample CSV and prediction endpoint
- `ai_model/` — sample CSV (`sample_data.csv`), trainer script (`aqi_predict.py`), saved `model_params.json`, and `prediction_plot.png`
- `mobile_app/` — placeholder `AirAlert.java` showing how mobile alerting would call the model

---

## Advanced Analysis (short)
- **Hypothesis:** PM2.5 is the strongest single predictor for AQI in local urban scenarios.
- **Model:** Ordinary Least Squares (single-variable linear regression) trained on the provided sample CSV (~120 hourly points). This keeps the pipeline transparent and reproducible for beginners moving toward research.
- **Metrics:** Visual inspection of scatter + fit; for production add RMSE, MAE, and cross-validation.

### Key insight
> A simple linear regressor explains the bulk of AQI variability when PM2.5 dominates. Add meteorological features (temp, humidity, wind) for better accuracy.

---

## How it works (very short)
1. `ai_model/aqi_predict.py` reads `sample_data.csv`, computes OLS parameters and writes `model_params.json` + `prediction_plot.png`.
2. `backend/server.js` serves `sample.csv` and exposes `/predict?pm25=VALUE` returning model output.
3. `frontend/index.html` loads CSV, draws D3 graph and calls `/predict` to show live predictions.
4. `mobile_app/AirAlert.java` is a minimal concept for Android alert logic.

---

## Quick start (Linux / macOS)
1. Open a terminal.
2. Run the AI trainer:
   ```bash
   cd ai_model
   python3 aqi_predict.py
   ```
3. Start backend:
   ```bash
   cd ../backend
   node server.js
   ```
4. Open frontend:
   - Open `frontend/index.html` in a browser (or serve it with a static server). The dashboard will read `ai_model/sample_data.csv` and `ai_model/model_params.json` (if present).

---

## Visuals & Notes
- `ai_model/prediction_plot.png` is included — it shows the training scatter and fitted line.
- Quick sketch (handwritten-style ASCII):
  ```
  Sensors/API -> Node.js -> Python(OLS) -> model_params.json
             \-> Dashboard(D3) <-> Android alerts
  ```

---

## Next steps (research directions)
- Replace OLS with regularized models (Ridge, Lasso).
- Add time-series models (ARIMA/LSTM) for trend forecasting.
- Calibrate with labeled local sensor networks and compute uncertainty intervals.

---

_This repo is crafted to be a research-friendly, beginner-ready demo with only main files so you can quickly run experiments and extend._  
