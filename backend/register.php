<?php
require 'connect.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $apiData = file_get_contents('php://input');
    $registerData = json_decode($apiData, true);

    if ($registerData) {
        $username = mysqli_real_escape_string($conn, $registerData['username']);
        $password = mysqli_real_escape_string($conn, $registerData['password']);
        $email = mysqli_real_escape_string($conn, $registerData['email']);
        $role = 'patient';

        $queryCheckUser = "SELECT * FROM users WHERE username = '".$username."'";
        $resultCheckUser = mysqli_query($conn, $queryCheckUser);

        if (mysqli_num_rows($resultCheckUser) > 0) {
            $response = array('error' => 'User already exists');
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $queryAddUser = "INSERT INTO users (username, password, email, role) VALUES ('$username', '$hashedPassword', '$email', '$role')";
            
            if (mysqli_query($conn, $queryAddUser)) {
                $response = array('success' => 'User registered successfully');
            } else {
                $response = array('error' => 'Failed to register user');
            }
        }
    } else {
        $response = array('error' => 'Invalid input data');
    }
} else {
    $response = array('error' => 'Invalid request method');
}

echo json_encode($response);
?>
