<?php
require 'connect.php';
header('Content-Type: application/json');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['patient_id'])) {
    $patient_id = intval($_GET['patient_id']);

    $query = "SELECT id, patient_record_code, image_url, created_at 
              FROM medical_records 
              WHERE patient_id = ? 
              ORDER BY created_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $patient_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $records = [];
    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }

    $response = ['success' => true, 'records' => $records];
    $stmt->close();
} else {
    $response = ['success' => false, 'message' => 'Invalid request.'];
}

echo json_encode($response);
$conn->close();
