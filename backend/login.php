<?php
require 'connect.php';

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$response = [];


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $apiData = file_get_contents('php://input');
    $loginData = json_decode($apiData, true);

    if (json_last_error() === JSON_ERROR_NONE) {
        if (!empty($loginData['userName']) && !empty($loginData['password'])) {
            $userName = mysqli_real_escape_string($conn, $loginData['userName']);
            $password = mysqli_real_escape_string($conn, $loginData['password']);
            if ($stmt = $conn->prepare("SELECT id, username, password, role FROM users WHERE username = ?")) {
                $stmt->bind_param("s", $userName);
                $stmt->execute();
                $result = $stmt->get_result();
                if ($result->num_rows > 0) {
                    $user = $result->fetch_assoc();
                    if (password_verify($password, $user['password'])) {
                        $response[] = array(
                            'id' => $user['id'], 
                            'userName' => $user['username'],
                            'role' => $user['role']
                        );
                    } else {
                        $response = array('error' => 'Invalid credentials');
                    }
                } else {
                    $response = array('error' => 'Invalid credentials');
                }
                $stmt->close();
            } else {
                $response = array('error' => 'Failed to prepare statement');
            }
        } else {
            $response = array('error' => 'Username or password cannot be empty');
        }
    } else {
        $response = array('error' => 'Invalid JSON input');
    }
} else {
    $response = array('error' => 'Invalid request method');
}

echo json_encode($response);
$conn->close();
?>
