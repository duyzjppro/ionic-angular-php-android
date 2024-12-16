<?php
require 'connect.php';
header('Content-Type: application/json');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['date'])) {
        $date = mysqli_real_escape_string($conn, $_GET['date']); 
        $date = date('Y-m-d', strtotime($date));
        
        $query = "
            SELECT a.id, p.name as patient_name, a.queue_number 
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            WHERE a.appointment_date = ?
        ";

        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('s', $date);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $appointments = [];
            while ($row = $result->fetch_assoc()) {
                $appointments[] = $row;
            }
            
            if (!empty($appointments)) {
                $response = ['success' => true, 'appointments' => $appointments];
            } else {
                $response = ['success' => false, 'error' => 'No appointments available'];
            }
            
            $stmt->close();
        } else {
            $response = ['success' => false, 'error' => 'Failed to prepare statement'];
        }
    } else {
        $response = ['success' => false, 'error' => 'Date parameter is missing'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method'];
}

echo json_encode($response);
$conn->close();
?>
