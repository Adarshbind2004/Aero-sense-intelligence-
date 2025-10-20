// frontend logic: loads local sample CSV (if served) or embedded fallback,
// draws a scatter + regression line using D3, and calls backend predict endpoint.
async function fetchCSV(){
  try {
    const resp = await fetch('/sample.csv');
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const text = await resp.text();
    return d3.csvParse(text);
  } catch(e){
    // fallback: load local copy packaged with frontend (same folder)
    const resp = await fetch('../ai_model/sample_data.csv');
    const text = await resp.text();
    return d3.csvParse(text);
  }
}

async function init(){
  const data = await fetchCSV();
  data.forEach(d => { d.pm25 = +d.pm25; d.aqi = +d.aqi; });
  draw(data);
  // load model params
  try {
    const mresp = await fetch('../ai_model/model_params.json');
    const params = await mresp.json();
    document.getElementById('modelParams').innerText = JSON.stringify(params, null, 2);
  } catch(e){
    document.getElementById('modelParams').innerText = 'Run ai_model/aqi_predict.py to create model_params.json';
  }

  document.getElementById('predictBtn').addEventListener('click', async () => {
    const pm = +document.getElementById('pmInput').value;
    try {
      const resp = await fetch('/predict?pm25=' + pm);
      const json = await resp.json();
      document.getElementById('predResult').innerText = 'Prediction: AQI ' + json.predicted_aqi;
    } catch(err){
      // fallback compute using local params if available
      try {
        const params = await (await fetch('../ai_model/model_params.json')).json();
        const p = Math.round((params.intercept + params.slope * pm) * 100)/100;
        document.getElementById('predResult').innerText = 'Prediction (local): AQI ' + p;
      } catch(e){
        document.getElementById('predResult').innerText = 'Prediction: Run backend and AI script first.';
      }
    }
  });
}

function draw(data){
  const svg = d3.select('#plot');
  svg.selectAll('*').remove();
  const width = +svg.attr('width') || svg.node().getBoundingClientRect().width;
  const height = +svg.attr('height') || svg.node().getBoundingClientRect().height;
  const margin = {top:20,right:20,bottom:40,left:50};
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain(d3.extent(data, d=>d.pm25)).nice().range([0,w]);
  const y = d3.scaleLinear().domain(d3.extent(data,d=>d.aqi)).nice().range([h,0]);

  g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(x));
  g.append('g').call(d3.axisLeft(y));

  g.selectAll('circle').data(data).join('circle')
    .attr('cx', d=>x(d.pm25)).attr('cy', d=>y(d.aqi)).attr('r',3).attr('opacity',0.8);

  // attempt to draw regression line if model_params.json available
  fetch('../ai_model/model_params.json').then(r=>r.json()).then(params=>{
    const xs = d3.extent(data, d=>d.pm25);
    const line = d3.line()([[xs[0], params.intercept + params.slope*xs[0]],[xs[1], params.intercept + params.slope*xs[1]]]);
    // convert to screen coords:
    const pts = [[x(xs[0]), y(params.intercept + params.slope*xs[0])],[x(xs[1]), y(params.intercept + params.slope*xs[1])]];
    g.append('line').attr('x1', pts[0][0]).attr('y1', pts[0][1]).attr('x2', pts[1][0]).attr('y2', pts[1][1]).attr('stroke','#0f172a').attr('stroke-width',1.5);
  }).catch(()=>{});
}

init();
