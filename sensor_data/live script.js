function getSensorData(onclick) {
  var sensorColumn = document.getElementById("sensor-column").value;
if (sensorColumn == "temperature" || sensorColumn == "humidity" || sensorColumn == "distance" || sensorColumn == "ldrValue" || sensorColumn == "flameValue" || sensorColumn == "pirValue" || sensorColumn == "soilMoistureValue" || sensorColumn == "rainValue" || sensorColumn == "heartbeatValue") {
  // The sensor column is valid.
} else {
  // The sensor column is invalid.
  throw new Error("Invalid sensor column.");
}
  var timestamp = document.getElementById("timestamp").value;

  var request = new XMLHttpRequest();
  request.open("GET", "/api/sensors/" + sensorColumn + "&timestamp=" + timestamp, true);
  request.send();
  request.onload = function() {
      if (request.status == 200) {
          var data = JSON.parse(request.responseText);
          var html = "";
          for (var i = 0; i < data.length; i++) {
              html += "<p>" + data[i].id + ": " + data[i][sensorColumn] + "</p>";
          }
          document.getElementById("sensor_data").innerHTML = data.sensorData;
          var gauge = new Gauge(document.getElementById("gauge"));
    gauge.setValue(data.value);

    // Create the graph.
    var graph = new Graph(document.getElementById("graph"));
    graph.setData(data.data);
      }
    };
  }