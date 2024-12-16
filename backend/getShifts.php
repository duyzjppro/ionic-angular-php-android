<?php
require 'connect.php';

$response = array();

$sql = "SELECT shifts.id, shifts.shift_date, shifts.shift_period, doctors.name AS doctor_name FROM shifts JOIN doctors ON shifts.doctor_id = doctors.id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $response['success'] = true;
    $response['shifts'] = $result->fetch_all(MYSQLI_ASSOC);
} else {
    $response['success'] = false;
    $response['message'] = "No shifts found";
}

echo json_encode($response);
?>
