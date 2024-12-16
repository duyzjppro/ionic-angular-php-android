<?php
require 'connect.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $patientId = $input['patient_id'];
    $clinicId = $input['clinic_id'];
    $timeSlotId = $input['time_slot_id'];
    $appointmentDate = $input['appointment_date'];

    $formattedDate = date('Y-m-d', strtotime($appointmentDate));

    // Kiểm tra xem time slot đã được đặt chưa
    $query = "SELECT COUNT(*) AS count 
              FROM appointment 
              WHERE clinic_id = ? 
              AND time_slot_id = ? 
              AND appointment_date = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('iis', $clinicId, $timeSlotId, $formattedDate);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if ($result['count'] == 0) {
        // nếu có time_slots trống thì đặt phòng
        $insertQuery = "INSERT INTO appointment (patient_id, clinic_id, time_slot_id, appointment_date) 
                        VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param('iiis', $patientId, $clinicId, $timeSlotId, $formattedDate);

        if ($stmt->execute()) {
            // Truy vấn để lấy tên phòng từ clinic_id
            $clinicQuery = "SELECT name FROM clinics WHERE id = ?";
            $stmt = $conn->prepare($clinicQuery);
            $stmt->bind_param('i', $clinicId);
            $stmt->execute();
            $clinicResult = $stmt->get_result()->fetch_assoc();
            $clinicName = $clinicResult['name'];

            // Truy vấn để lấy thời gian từ time_slots
            $timeSlotQuery = "SELECT time FROM time_slots WHERE id = ?";
            $stmt = $conn->prepare($timeSlotQuery);
            $stmt->bind_param('i', $timeSlotId);
            $stmt->execute();
            $timeSlotResult = $stmt->get_result()->fetch_assoc();
            $timeSlot = $timeSlotResult['time'];

            // Tạo thông báo xác nhận đặt phòng
            $message = "Lịch khám của bạn vào ngày " . $formattedDate . " lúc " . $timeSlot . " ở phòng " . $clinicName;

            // thêm vào bảng dữ liệu thông báo
            $notificationQuery = "INSERT INTO notifications (patient_id, message) VALUES (?, ?)";
            $stmt = $conn->prepare($notificationQuery);
            $stmt->bind_param('is', $patientId, $message);

            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = 'Appointment and notification created successfully.';
            } else {
                $response['success'] = false;
                $response['error'] = 'Could not create notification.';
            }
        } else {
            $response['success'] = false;
            $response['error'] = 'Could not create appointment.';
        }
    } else {
        $response['success'] = false;
        $response['error'] = 'Time slot already booked for this clinic and date.';
    }

    $stmt->close();
} else {
    $response['success'] = false;
    $response['error'] = 'Invalid request method.';
}

echo json_encode($response);
$conn->close();
?>
