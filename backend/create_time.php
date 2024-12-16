<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from request
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validate the input
    $time = isset($data['time']) ? mysqli_real_escape_string($conn, $data['time']) : null;
    $date = isset($data['date']) ? mysqli_real_escape_string($conn, $data['date']) : null;

    if ($time && $date) {
        if (strlen($time) === 5) {
            $time .= ':00';  
        }

        $date = date('Y-m-d', strtotime($date));

        $query = "INSERT INTO time_slots (time, date) VALUES (?, ?)";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('ss', $time, $date);
            if ($stmt->execute()) {
                $response = ['success' => true, 'message' => 'Time slot created successfully.'];
            } else {
                $response = ['success' => false, 'message' => 'Failed to create time slot.'];
            }
            $stmt->close();
        } else {
            $response = ['success' => false, 'error' => 'Failed to prepare statement.'];
        }
    } else {
        $response = ['success' => false, 'message' => 'Invalid time or date input.'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method.'];
}

echo json_encode($response);
$conn->close();
?>
