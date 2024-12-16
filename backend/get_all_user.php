<?php
require 'connect.php';

$response = [];

$query = "SELECT id, username FROM users WHERE role = 'doctor'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    $response['success'] = true;
    $response['data'] = $users; // Ensure that 'id' is part of the response
} else {
    $response['success'] = false;
    $response['message'] = 'No users found.';
}

echo json_encode($response);
$conn->close();
?>
