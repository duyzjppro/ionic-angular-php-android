<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['date'])) {
        $date = mysqli_real_escape_string($conn, $_GET['date']);
        $date = date('Y-m-d', strtotime($date));

        // Truy vấn để lấy tất cả time_slots cho ngày đó mà chưa được đặt cho phòng cụ thể
        $query = "
        SELECT ts.id, ts.time, ts.date 
        FROM time_slots ts
        WHERE ts.date = ?"; // Lấy toàn bộ time slots cho ngày đó
    
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('s', $date);
            $stmt->execute();
            $result = $stmt->get_result();

            $timeSlots = [];
            while ($row = $result->fetch_assoc()) {
                $timeSlots[] = $row; // Không cần loại bỏ time slot ở đây
            }

            $response = ['success' => true, 'timeSlots' => $timeSlots];
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
