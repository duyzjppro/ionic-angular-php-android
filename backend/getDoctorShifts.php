<?php
require 'connect.php';
$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['doctor_id'])) {
        $doctor_id = $_GET['doctor_id'];

        $stmt = $conn->prepare("SELECT shift_date, shift_period, clinics.name as clinic_name
                                FROM shifts 
                                JOIN clinics ON shifts.clinic_id = clinics.id
                                WHERE doctor_id = ?");
        $stmt->bind_param("i", $doctor_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $shifts = [];
            while ($row = $result->fetch_assoc()) {
                $shifts[] = $row;  // Collect shifts data
            }
            $response = array('shifts' => $shifts);  // Send as a shifts array
        } else {
            $response = array('shifts' => []);  // No shifts found
        }

        $stmt->close();
    } else {
        $response = array('error' => 'doctor_id parameter is missing');
    }
} else {
    $response = array('error' => 'Invalid request method');
}

echo json_encode($response);

$conn->close();
?>
