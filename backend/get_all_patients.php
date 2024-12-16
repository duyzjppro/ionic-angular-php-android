<?php
require 'connect.php';


$response = [];

$query = "SELECT id, name, age, gender, phone, city, image_url FROM patients";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $patients = [];
    while ($row = $result->fetch_assoc()) {
        $patients[] = $row;
    }
    $response['success'] = true;
    $response['data'] = $patients;
} else {
    $response['success'] = false;
    $response['message'] = 'No patients found.';
}

ob_end_clean();
echo json_encode($response);

$conn->close();
?>
