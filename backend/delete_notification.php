<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lấy dữ liệu JSON từ client
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['notification_id'])) {
        $notification_id = $data['notification_id'];

        // Chuẩn bị câu lệnh xóa
        $stmt = $conn->prepare("DELETE FROM notifications WHERE id = ?");
        $stmt->bind_param("i", $notification_id);
        
        if ($stmt->execute()) {
            $response = ['success' => true, 'message' => 'Notification deleted successfully'];
        } else {
            $response = ['success' => false, 'error' => 'Failed to delete notification'];
        }

        $stmt->close();
    } else {
        $response = ['success' => false, 'error' => 'notification_id parameter is missing'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method'];
}

echo json_encode($response);
$conn->close();
?>
