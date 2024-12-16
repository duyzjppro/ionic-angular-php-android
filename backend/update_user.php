<?php
require 'connect.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);

// Kiểm tra xem có ID của người dùng và dữ liệu cần cập nhật không
if (isset($input['id'], $input['username'], $input['email'], $input['role'])) {
    $id = $input['id'];
    $username = $input['username'];
    $email = $input['email'];
    $role = $input['role'];

    // Cập nhật thông tin người dùng
    $query = "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssi", $username, $email, $role, $id);

    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => 'User updated successfully.'];
    } else {
        $response = ['success' => false, 'message' => 'Failed to update user.'];
    }
    $stmt->close();
} else {
    $response = ['success' => false, 'message' => 'Invalid input data.'];
}

echo json_encode($response);
$conn->close();
