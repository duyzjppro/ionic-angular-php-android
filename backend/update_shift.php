<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->shift_id) && isset($data->shift_date) && isset($data->shift_period) && isset($data->doctor_id) && isset($data->clinic_id)) {
        $shift_id = mysqli_real_escape_string($conn, $data->shift_id);
        $shift_date = mysqli_real_escape_string($conn, $data->shift_date);
        $shift_period = mysqli_real_escape_string($conn, $data->shift_period);
        $doctor_id = mysqli_real_escape_string($conn, $data->doctor_id);
        $clinic_id = mysqli_real_escape_string($conn, $data->clinic_id);

        $query = "UPDATE shifts SET shift_date = ?, shift_period = ?, doctor_id = ?, clinic_id = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssiii", $shift_date, $shift_period, $doctor_id, $clinic_id, $shift_id);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Shift updated successfully';
        } else {
            $response['success'] = false;
            $response['error'] = 'Failed to update shift';
        }

        $stmt->close();
    } else {
        $response['success'] = false;
        $response['error'] = 'Missing required fields';
    }
} else {
    $response['success'] = false;
    $response['error'] = 'Invalid request method';
}

echo json_encode($response);
$conn->close();
?>
