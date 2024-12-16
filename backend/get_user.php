<?php
require 'connect.php';

header('Content-Type: application/json'); // Đảm bảo phản hồi là JSON

$response = [];

// Truy vấn lấy tất cả người dùng
$query = "SELECT id, username, email, role FROM users";
$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    $response['success'] = true;
    $response['data'] = $users;
} else {
    $response['success'] = false;
    $response['message'] = 'No users found or query error.';
}

// Đóng kết nối trước khi trả về phản hồi
$conn->close();

echo json_encode($response);
?>
