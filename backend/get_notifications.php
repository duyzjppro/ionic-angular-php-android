<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['patient_id'])) {
        $patient_id = $_GET['patient_id'];

        // Lấy cả `id` của mỗi thông báo
        $stmt = $conn->prepare("SELECT id, message, created_at FROM notifications WHERE patient_id = ? ORDER BY created_at DESC");
        $stmt->bind_param("i", $patient_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $notifications = [];
            while ($row = $result->fetch_assoc()) {
                $notifications[] = $row;
            }
            $response = ['success' => true, 'notifications' => $notifications];
        } else {
            $response = ['success' => false, 'error' => 'No notifications found'];
        }

        $stmt->close();
    } else {
        $response = ['success' => false, 'error' => 'patient_id parameter is missing'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method'];
}

echo json_encode($response);
$conn->close();
?>
