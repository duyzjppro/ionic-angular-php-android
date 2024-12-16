<?php
require 'connect.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['date'])) {
        $date = mysqli_real_escape_string($conn, $_GET['date']); 

        error_reporting(E_ALL);
        ini_set('display_errors', 1);

        $date = date('Y-m-d', strtotime($date));

        $sql = "SELECT a.id, a.queue_number, p.name as patient_name 
                FROM appointments a 
                JOIN patients p ON a.patient_id = p.id 
                WHERE a.appointment_date = ? 
                ORDER BY a.queue_number ASC";

        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param('s', $date);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $response['appointments'][] = $row;
                }
            } else {
                $response['appointments'] = [];
            }
            $stmt->close();
        } else {
            $response = array('error' => 'Failed to prepare statement: ' . $conn->error);
        }
    } else {
        $response = array('error' => 'Date parameter is missing');
    }
} else {
    $response = array('error' => 'Invalid request method');
}

echo json_encode($response);
$conn->close();
?>
