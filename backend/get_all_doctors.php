<?php
require 'connect.php';

$response = [];

$query = "SELECT id, name, specialty, phone, image_url FROM doctors";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $doctors = [];
    while ($row = $result->fetch_assoc()) {
        $doctors[] = $row;
    }
    $response['success'] = true;
    $response['data'] = $doctors;
} else {
    $response['success'] = false;
    $response['message'] = 'No doctors found.';
}

echo json_encode($response);
$conn->close();
?>
