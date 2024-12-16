// đây là code phương hướng phát triển khác, nhưng vài điểm bất lợi chưa được giải quyết triệt để.

<?php
require 'connect.php';
header('Content-Type: application/json');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['appointment_id'])) {
        $appointmentId = mysqli_real_escape_string($conn, $data['appointment_id']);

        // Bắt đầu một transaction
        $conn->begin_transaction();

        try {
            // Lấy thông tin clinic_id của appointment bị xóa
            $query = "
                SELECT cm.clinic_id
                FROM clinic_management cm
                WHERE cm.appointment_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('i', $appointmentId);
            $stmt->execute();
            $result = $stmt->get_result();
            $appointmentInfo = $result->fetch_assoc();

            if (!$appointmentInfo) {
                throw new Exception('Appointment not found');
            }

            $clinicId = $appointmentInfo['clinic_id'];
            $stmt->close();

            // Xóa đơn đăng ký khỏi bảng clinic_management
            $deleteQuery = "DELETE FROM clinic_management WHERE appointment_id = ?";
            $stmtDelete = $conn->prepare($deleteQuery);
            $stmtDelete->bind_param('i', $appointmentId);
            if (!$stmtDelete->execute()) {
                throw new Exception('Failed to delete appointment');
            }
            $stmtDelete->close();

            // Lấy danh sách các cuộc hẹn còn lại trong phòng khám và cập nhật thời gian thông báo
            $startTime = new DateTime('07:30:00'); // Thời gian bắt đầu
            $interval = new DateInterval('PT15M'); // Khoảng cách 15 phút

            $selectQuery = "
                SELECT cm.appointment_id, a.patient_id
                FROM clinic_management cm
                JOIN appointments a ON cm.appointment_id = a.id
                WHERE cm.clinic_id = ?
                ORDER BY a.queue_number ASC";  // Sắp xếp dựa trên queue_number nhưng không thay đổi nó
            $stmtSelect = $conn->prepare($selectQuery);
            $stmtSelect->bind_param('i', $clinicId);
            $stmtSelect->execute();
            $result = $stmtSelect->get_result();

            $position = 0; // Dùng để đếm vị trí thực sự trong danh sách

            while ($row = $result->fetch_assoc()) {
                $appointmentId = $row['appointment_id'];
                $patientId = $row['patient_id'];

                // Tính toán thời gian cuộc hẹn mới dựa trên vị trí trong danh sách
                $appointmentTime = clone $startTime;
                $appointmentTime->add(new DateInterval('PT' . ($position * 15) . 'M'));
                $formattedTime = $appointmentTime->format('h:i A');

                // Gửi thông báo với thời gian mới
                $notificationQuery = "
                    INSERT INTO notifications (patient_id, message, created_at)
                    VALUES (?, CONCAT('Thời gian đã được cập nhật, ca khám sẽ bắt đầu từ: ', ?), NOW())";
                $stmtNotification = $conn->prepare($notificationQuery);
                $stmtNotification->bind_param('is', $patientId, $formattedTime);
                if (!$stmtNotification->execute()) {
                    throw new Exception('Failed to update notification');
                }
                $stmtNotification->close();

                $position++; // Tăng vị trí cho cuộc hẹn tiếp theo
            }

            $stmtSelect->close();

            // Commit transaction
            $conn->commit();
            $response['success'] = true;
            $response['message'] = 'Appointment deleted and notifications sent successfully';
        } catch (Exception $e) {
            // Rollback transaction nếu có lỗi
            $conn->rollback();
            $response['success'] = false;
            $response['error'] = $e->getMessage();
        }
    } else {
        $response['success'] = false;
        $response['error'] = 'Invalid input data';
    }
} else {
    $response['success'] = false;
    $response['error'] = 'Invalid request method';
}

echo json_encode($response);
$conn->close();
