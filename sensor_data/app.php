<?php
function process_sensor_data($selected_sensors) {
    // Call the function with some example sensor data
$selected_sensors = ['temperature', 'humidity']; // Replace with actual sensor names
process_sensor_data($selected_sensors);

    $processed_data = [
        "sensors" => [],
        "graph_data" => []
    ];
$host = "185.214.124.4";
$user = "u759114105_task1";
$password = "1234@Abcd";
$database = "u759114105_task1";

$connection = mysqli_connect($host, $user, $password, $database);
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the raw JSON data from the request body
    $json_data = file_get_contents('php://input');

    // Convert the JSON data to a PHP associative array
    $data = json_decode($json_data, true);

    // Check if the required fields exist
    if (isset($data['sensors'])) {
        $selected_sensors = $data['sensors'];

        // Process the data and generate sample data for the selected sensors
        $processed_data = [
            "sensors" => [],
            "graph_data" => []
        ];

        // Loop through selected sensors
        foreach ($selected_sensors as $sensor) {
            // Fetch data from database for the sensor
            $query = "SELECT * FROM sensor_data WHERE sensor_name = '$sensor'";
            $result = mysqli_query($connection, $query);

            if ($result) {
                $sensor_data = [];
                while ($row = mysqli_fetch_assoc($result)) {
                    $timestamp = $row['timestamp'];
                    $value = $row['value'];
                    $sensor_data[] = [
                        "timestamp" => $timestamp,
                        "value" => $value
                    ];
                }
                $processed_data["sensors"][$sensor] = $sensor_data;

                // Generate graph data
                $graph_data = [
                    "timestamp" => end($sensor_data)["timestamp"],
                    "values" => []
                ];
                foreach ($sensor_data as $data_point) {
                    $graph_data["values"][$data_point["timestamp"]] = $data_point["value"];
                }
                $processed_data["graph_data"][] = $graph_data;
            } 
        }

        // Send the processed data as JSON response
        header('Content-Type: application/json');
        echo json_encode($processed_data);
    } else {
        // Handle invalid or missing data
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Invalid request data"]);
    }
}


mysqli_close($connection);
}
?>
