"""A simple AQI predictor using ordinary least squares (no external ML libs).
Reads ai_model/sample_data.csv, trains linear regression predicting `aqi`
from `pm25` (simple single-feature model) and saves model_params.json and a plot.
Usage:
  python aqi_predict.py
"""
import json
import numpy as np
import pandas as pd
from pathlib import Path
import matplotlib.pyplot as plt

root = Path(__file__).parent
df = pd.read_csv(root / 'sample_data.csv')
X = df['pm25'].values.reshape(-1,1)
y = df['aqi'].values

# add bias column
Xb = np.hstack([np.ones((X.shape[0],1)), X])
# closed-form OLS solution: theta = (Xb^T Xb)^{-1} Xb^T y
theta = np.linalg.pinv(Xb.T.dot(Xb)).dot(Xb.T).dot(y)

intercept, slope = float(theta[0]), float(theta[1])
params = {'intercept': intercept, 'slope': slope}

# Save params
with open(root / 'model_params.json', 'w') as f:
    json.dump(params, f, indent=2)

# plot actual vs predicted
pm_range = np.linspace(df['pm25'].min(), df['pm25'].max(), 200)
pred = intercept + slope * pm_range

plt.figure(figsize=(6,3.5))
plt.scatter(df['pm25'], df['aqi'], s=12)
plt.plot(pm_range, pred)
plt.xlabel('PM2.5 (µg/m³)')
plt.ylabel('AQI (index)')
plt.title('PM2.5 → AQI (trained model)')
plt.tight_layout()
plt.savefig(root / 'prediction_plot.png', dpi=150)
print('Model trained. Params saved to model_params.json and prediction_plot.png created.')
