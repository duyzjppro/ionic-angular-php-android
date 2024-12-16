<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['date'])) {
        $date = mysqli_real_escape_string($conn, $_GET['date']);
        
        // Truy vấn lấy các cuộc hẹn theo ngày
        $query = "
            SELECT 
                a.id, 
                a.appointment_date, 
                a.created_at,
                p.name AS patient_name,
                c.name AS clinic_name,
                ts.time AS time_slot 
            FROM appointment a
            JOIN patients p ON a.patient_id = p.id
            JOIN clinics c ON a.clinic_id = c.id
            JOIN time_slots ts ON a.time_slot_id = ts.id
            WHERE a.appointment_date = ?
            ORDER BY ts.time ASC
        ";
        
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('s', $date);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $appointments = [];
            while ($row = $result->fetch_assoc()) {
                $appointments[] = $row;
            }
            
            $response = ['success' => true, 'appointments' => $appointments];
            $stmt->close();
        } else {
            $response = ['success' => false, 'error' => 'Error preparing query'];
        }
    } else {
        $response = ['success' => false, 'error' => 'Date parameter is missing'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method'];
}

echo json_encode($response);
$conn->close();
