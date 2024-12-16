<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Lấy ID trực tiếp từ query string
    $id = isset($_GET['id']) ? mysqli_real_escape_string($conn, $_GET['id']) : null;

    if ($id) {
        $query = "DELETE FROM time_slots WHERE id = ?";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('i', $id);
            if ($stmt->execute()) {
                $response = ['success' => true, 'message' => 'Time slot deleted successfully.'];
            } else {
                $response = ['success' => false, 'message' => 'Failed to delete time slot.'];
            }
            $stmt->close();
        } else {
            $response = ['success' => false, 'error' => 'Failed to prepare statement.'];
        }
    } else {
        $response = ['success' => false, 'message' => 'Invalid time slot ID.'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method.'];
}

echo json_encode($response);
$conn->close();
