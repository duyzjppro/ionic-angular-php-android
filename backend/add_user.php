<?php
require 'connect.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $role = $input['role'] ?? '';

    if (!empty($username) && !empty($email) && !empty($password) && in_array($role, ['patient', 'doctor', 'admin'])) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->bind_param('ssss', $username, $email, $hashedPassword, $role);
        if ($stmt->execute()) {
            $response = ['success' => true, 'message' => 'User added successfully.'];
        } else {
            $response = ['success' => false, 'error' => 'Failed to add user.'];
        }
        $stmt->close();
    } else {
        $response = ['success' => false, 'error' => 'Invalid input.'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method.'];
}

echo json_encode($response);
$conn->close();
?>
