<?php
require 'connect.php';
header('Content-Type: application/json');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['date'])) {
        $date = mysqli_real_escape_string($conn, $_GET['date']); 
        $date = date('Y-m-d', strtotime($date));
        
        $query = "
            SELECT DISTINCT d.id, d.name 
            FROM doctors d
            JOIN shifts s ON d.id = s.doctor_id
            WHERE s.shift_date = ?
        ";

        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('s', $date);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $doctors = [];
            while ($row = $result->fetch_assoc()) {
                $doctors[] = $row;
            }
            
            if (!empty($doctors)) {
                $response = ['success' => true, 'doctors' => $doctors];
            } else {
                $response = ['success' => false, 'error' => 'No doctors available'];
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
