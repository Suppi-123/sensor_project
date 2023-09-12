<?php

// Connect to the database
function connectToDatabase($host, $username, $password, $database) {
    $connection = mysqli_connect($host, $username, $password, $database);
    if (mysqli_connect_errno()) {
        die("Failed to connect to MySQL: " . mysqli_connect_error());
    }
    return $connection;
}

$connection = connectToDatabase('185.214.124.4', 'u759114105_task1', '1234@Abcd', 'u759114105_task1');
// Check if the connection was successful
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}
$sensor_column = $_GET['sensor_column'];
if (!isset($sensor_column)) {
    die("Invalid sensor column.");
}

// Get the sensor column and timestamp from the query string
$sensor_column = $_GET['sensor_column'];
$timestamp = $_GET['timestamp'];

// Check if the sensor column is valid
$valid_columns = array(' temperature, humidity, distance, ldrValue, flameValue, pirValue, soilMoistureValue, rainValue, heartbeatValue');
if (!in_array($sensor_column, $valid_columns)) {
    die("Invalid sensor column.");
}

// Check if the timestamp is valid
if (!preg_match("/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/", $timestamp)) {
    die("Invalid timestamp.");
}

// Get the sensor data from the database
$query = "SELECT id, $sensor_column FROM Sensors_table WHERE timestamp_column >= '$timestamp' ";
$result = mysqli_query($connection, $query);

// Convert the sensor data to JSON
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = array(
        'id' => $row['id'],
        $sensor_column => $row[$sensor_column]
    );
}

// Echo the JSON data
echo json_encode($data);

?>