
// đây là code phương hướng phát triển khác, nhưng vài điểm bất lợi chưa được giải quyết triệt để.

<?php
require 'connect.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $apiData = file_get_contents('php://input');
    $appointmentData = json_decode($apiData, true);

    if ($appointmentData) {
        $patientId = mysqli_real_escape_string($conn, $appointmentData['patient_id']);
        $appointmentDate = mysqli_real_escape_string($conn, $appointmentData['appointment_date']);

        $checkQuery = "SELECT COUNT(*) AS count FROM appointments WHERE patient_id = ? AND appointment_date = ?";
        if ($stmt = $conn->prepare($checkQuery)) {
            $stmt->bind_param("is", $patientId, $appointmentDate);
            $stmt->execute();
            $stmt->bind_result($appointmentCount);
            $stmt->fetch();
            $stmt->close();

            if ($appointmentCount > 0) {
                $response = array('error' => 'Bạn đã đặt lịch hẹn cho ngày này rồi.');
                echo json_encode($response);
                exit;
            }
        } else {
            $response = array('error' => 'Failed to prepare check query statement');
            echo json_encode($response);
            exit;
        }

        $query = "SELECT MAX(queue_number) AS max_queue_number FROM appointments WHERE appointment_date = ?";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param("s", $appointmentDate);
            $stmt->execute();
            $stmt->bind_result($maxQueueNumber);
            $stmt->fetch();
            $maxQueueNumber = $maxQueueNumber ? $maxQueueNumber : 0;
            $stmt->close();
        } else {
            $response = array('error' => 'Failed to prepare max queue number query statement');
            echo json_encode($response);
            exit;
        }

        $queueNumber = $maxQueueNumber + 1;

        if ($stmt = $conn->prepare("INSERT INTO appointments (patient_id, appointment_date, queue_number) VALUES (?, ?, ?)")) {
            $stmt->bind_param("isi", $patientId, $appointmentDate, $queueNumber);
            if ($stmt->execute()) {
                $response = array('success' => true, 'queue_number' => $queueNumber);
            } else {
                $response = array('error' => 'Failed to create appointment');
            }
            $stmt->close();
        } else {
            $response = array('error' => 'Failed to prepare insert statement');
        }
    } else {
        $response = array('error' => 'Invalid input data');
    }
} else {
    $response = array('error' => 'Invalid request method');
}

echo json_encode($response);
?>
