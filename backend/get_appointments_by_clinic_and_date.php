<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['date']) && isset($_GET['clinic_id'])) {
        $date = mysqli_real_escape_string($conn, $_GET['date']);
        $date = date('Y-m-d', strtotime($date));
        $clinicId = intval($_GET['clinic_id']); // Lấy clinic_id từ tham số GET
        
        // Truy vấn lấy tất cả các cuộc hẹn theo clinic_id và ngày cụ thể
        $query = "
            SELECT 
                a.time_slot_id
            FROM appointment a
            WHERE a.appointment_date = ?
            AND a.clinic_id = ?
        ";
        
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('si', $date, $clinicId);
            $stmt->execute();
            $result = $stmt->get_result();

            $bookedTimeSlots = [];
            while ($row = $result->fetch_assoc()) {
                $bookedTimeSlots[] = $row['time_slot_id']; // Lưu lại các time_slot_id đã được đặt
            }

            $response = ['success' => true, 'bookedTimeSlots' => $bookedTimeSlots];
            $stmt->close();
        } else {
            $response = ['success' => false, 'error' => 'Failed to prepare statement'];
        }
    } else {
        $response = ['success' => false, 'error' => 'Date or clinic_id parameter is missing'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method'];
}

echo json_encode($response);
$conn->close();
?>
