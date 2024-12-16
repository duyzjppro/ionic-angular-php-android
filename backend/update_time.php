<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Content-Type');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $id = isset($data['id']) ? mysqli_real_escape_string($conn, $data['id']) : null;
    $time = isset($data['time']) ? mysqli_real_escape_string($conn, $data['time']) : null;
    $date = isset($data['date']) ? mysqli_real_escape_string($conn, $data['date']) : null;

    if ($id && $time && $date) {
        $query = "UPDATE time_slots SET time = ?, date = ? WHERE id = ?";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('ssi', $time, $date, $id);
            if ($stmt->execute()) {
                $response = ['success' => true, 'message' => 'Time slot updated successfully.'];
            } else {
                $response = ['success' => false, 'message' => 'Failed to update time slot.'];
            }
            $stmt->close();
        } else {
            $response = ['success' => false, 'error' => 'Failed to prepare statement.'];
        }
    } else {
        $response = ['success' => false, 'message' => 'Invalid input data.'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method.'];
}

echo json_encode($response);
$conn->close();
