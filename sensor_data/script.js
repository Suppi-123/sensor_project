document.getElementById('generate-data').addEventListener('click', function () {
  var selectedSensors = Array.from(document.querySelectorAll('input[name="sensors"]:checked')).map(function (input) {
    return input.value;
  });

  // Send the selected sensors to the server and receive the processed data
  fetch('app.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // Change the Content-Type to 'application/json'
    },
    body: JSON.stringify({ sensors: selectedSensors }) // Use JSON.stringify to convert the data to JSON format
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      updateGauges(data.sensors);
      generateGraph(data.graph_data);
    })
    .catch(function (error) {
      console.error('Error:', error);
    });
});
function updateGauges(sensorData) {
  var gaugeContainer = document.getElementById('gauges');
  gaugeContainer.innerHTML = '';

  Object.entries(sensorData).forEach(function ([sensor, data]) {
    var sensorContainer = document.createElement('div');
    sensorContainer.classList.add('gauge-container');

    // var gaugeValueElement = document.createElement('div');
    // gaugeValueElement.setAttribute('class', 'gauge-value');
    // gaugeValueElement.setAttribute('id', sensor + '-gauge-value');
    // sensorContainer.appendChild(gaugeValueElement);

    var sensorTitle = document.createElement('h3');
    sensorTitle.innerText = sensor;

    var sensorValue = data[data.length - 1].value;

    var gaugeElement = document.createElement('canvas');
    gaugeElement.setAttribute('id', sensor + '-gauge');

    var gaugeValueElement = document.createElement('div');
    gaugeValueElement.classList.add('gauge-value');
    gaugeValueElement.setAttribute('id', sensor + '-gauge-value');
    gaugeValueElement.innerText = 'Gauge Value:' +sensorValue;
 
    sensorContainer.appendChild(sensorTitle);
    sensorContainer.appendChild(gaugeElement);
    sensorContainer.appendChild(gaugeValueElement);
    gaugeContainer.appendChild(sensorContainer);

    var gauge = new Gauge(document.getElementById(sensor + '-gauge')).setOptions({
      minValue: 0,
      maxValue:300,
      angle: 0,
      lineWidth: 0.44,
      radiusScale: 1,
      pointer: {
        length: 0.6,
        strokeWidth: 0.035,
        color: '#0000'
      },
      limitMax: true,
      limitMin: true,
      colorStart: '#00FF00',
      colorStop: '#FF0000',
      strokeColor: '#4169E1',
      generateGradient: true,
      highDpiSupport: true,
     
    });

    gauge.maxValue = 1000;
    gauge.set(sensorValue * 1000 / gauge.maxValue);
  });
}

function getMaxValue(data) {
  return Math.max(...data.map(function (item) {
    return item.value;
  }));
}

function generateGraph(graphData) {
  var graphContainer = document.getElementById('graph');
  graphContainer.innerHTML = '';

  var labels = graphData.map(function (item) {
    return item.timestamp;
  });

  var datasets = [];

  if (graphData.length > 0) {
    datasets = Object.entries(graphData[0].values).map(function ([sensor, _]) {
      return {
        label: sensor,
        data: graphData.map(function (item) {
          return item.values[sensor];
        }),
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderColor: 'red',
        borderWidth: 2,
      };
    });
  }

  var graphElement = document.createElement('canvas');
  graphElement.setAttribute('id', 'sensor-graph');

  graphContainer.appendChild(graphElement);

  new Chart(document.getElementById('sensor-graph'), {
    type: 'line',
  lineColor : 'blue',
 lineWidth : 3,
    
    data: {
      labels: labels,
      datasets: datasets
      
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            color: 'blue', 
            text: 'Timestamp'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            color: 'red',
            text: 'value'
          }
        }
      }
    }
  });
}


function getBackgroundColor() {
  return 'hsl(' + getRandomNumber(0, 360) + ', ' + getRandomNumber(0, 360) + ', ' + getRandomNumber(0, 360) + ', 0.5)';
}

function getBorderColor() {
  return 'hsl(' + getRandomNumber(0, 360) + ', ' + getRandomNumber(0, 360) + ', ' + getRandomNumber(0, 360) ;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}



// Rest of the code remains the same
//script.js
