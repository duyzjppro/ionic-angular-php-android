
// đây là code phương hướng phát triển khác, nhưng vài điểm bất lợi chưa được giải quyết triệt để.
<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        $response['success'] = false;
        $response['error'] = 'No input data';
        echo json_encode($response);
        exit();
    }

    $clinic_id = $data['clinic_id'];
    $doctor_id = $data['doctor_id'];
    $appointments = $data['appointments'];

    if (empty($clinic_id) || empty($doctor_id) || empty($appointments)) {
        $response['success'] = false;
        $response['error'] = 'Invalid input data';
        echo json_encode($response);
        exit();
    }

    $conn->begin_transaction();

    try {
        $stmt = $conn->prepare("INSERT INTO clinic_management (clinic_id, doctor_id, appointment_id) VALUES (?, ?, ?)");
        if (!$stmt) {
            throw new Exception('Failed to prepare statement: ' . $conn->error);
        }

        $startTime = new DateTime('07:30:00');
        $interval = new DateInterval('PT15M'); 

        foreach ($appointments as $appointment) {
            $appointmentId = $appointment['id'];
            
            $stmt->bind_param("iii", $clinic_id, $doctor_id, $appointmentId);
            if (!$stmt->execute()) {
                throw new Exception('Failed to insert data for appointment ID ' . $appointmentId . ': ' . $stmt->error);
            }
             // Calculate the appointment time based on queue number
            $stmtQueue = $conn->prepare("SELECT queue_number FROM appointments WHERE id = ?");
            $stmtQueue->bind_param("i", $appointmentId);
            $stmtQueue->execute();
            $result = $stmtQueue->get_result();
            $queue_number = $result->fetch_assoc()['queue_number'];
            $stmtQueue->close();
                    // Calculate the time for this appointment
            $appointmentTime = clone $startTime;
            $appointmentTime->add(new DateInterval('PT' . (($queue_number - 1) * 15) . 'M'));
                // Create a notification for the patient
            $notificationStmt = $conn->prepare("
                INSERT INTO notifications (patient_id, message, created_at)
                SELECT a.patient_id, CONCAT('Lịch khám của bạn ở clinic ', c.name, ' với bác sĩ ', d.name, ' bắt đầu từ ', ?), NOW()
                FROM appointments a
                JOIN clinics c ON c.id = ?
                JOIN doctors d ON d.id = ?
                WHERE a.id = ?
            ");
            if (!$notificationStmt) {
                throw new Exception('Failed to prepare notification statement: ' . $conn->error);
            }
            $formattedTime = $appointmentTime->format('h:i A');
            $notificationStmt->bind_param("siii", $formattedTime, $clinic_id, $doctor_id, $appointmentId);
            if (!$notificationStmt->execute()) {
                throw new Exception('Failed to create notification for appointment ID ' . $appointmentId . ': ' . $notificationStmt->error);
            }
            $notificationStmt->close();
        }

        $stmt->close();
        $conn->commit();
        $response['success'] = true;
        $response['message'] = 'Doctor and appointments assigned successfully. Notifications sent.';
    } catch (Exception $e) {
        $conn->rollback();
        $response['success'] = false;
        $response['error'] = $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['error'] = 'Invalid request method';
}

echo json_encode($response);
$conn->close();
?>
