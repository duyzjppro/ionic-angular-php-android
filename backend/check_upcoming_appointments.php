// dùng polling để check những cuộc hẹn chuẩn bị xảy ra trong khoảng 30p 


<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

date_default_timezone_set('Asia/Ho_Chi_Minh');
$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['patient_id']) || !is_numeric($_GET['patient_id'])) {
        $response['success'] = false;
        $response['error'] = 'Invalid or missing patient_id';
        echo json_encode($response);
        exit();
    }

    $patient_id = $_GET['patient_id'];
    $currentTime = date('Y-m-d H:i:s');
    $upcomingTime = date('Y-m-d H:i:s', strtotime('+30 minutes', strtotime($currentTime)));

    // Debug thông tin thời gian hiện tại và thời gian tương lai
    $response['debug'] = [
        'currentTime' => $currentTime,
        'upcomingTime' => $upcomingTime
    ];

    // Query để tìm các cuộc hẹn trong 30 phút tới và chưa được thông báo
    $stmt = $conn->prepare("
        SELECT a.id, a.appointment_date, t.time 
        FROM appointment a 
        JOIN time_slots t ON a.time_slot_id = t.id
        WHERE a.patient_id = ? 
        AND CONCAT(a.appointment_date, ' ', t.time) >= ? 
        AND CONCAT(a.appointment_date, ' ', t.time) < ?
        AND a.notified = 0
    ");

    if (!$stmt) {
        $response['success'] = false;
        $response['error'] = 'Failed to prepare statement: ' . $conn->error;
        echo json_encode($response);
        exit();
    }

    $stmt->bind_param("iss", $patient_id, $currentTime, $upcomingTime);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $notifications = [];

        $stmtInsert = $conn->prepare("
            INSERT INTO notifications (patient_id, message, created_at)
            VALUES (?, ?, NOW())
        ");

        if (!$stmtInsert) {
            $response['success'] = false;
            $response['error'] = 'Failed to prepare insert statement: ' . $conn->error;
            echo json_encode($response);
            exit();
        }

        while ($row = $result->fetch_assoc()) {
            $message = "Bạn có lịch hẹn vào ngày " . $row['appointment_date'] . " lúc " . $row['time'];
            $stmtInsert->bind_param("is", $patient_id, $message);
            if ($stmtInsert->execute()) {
                // Cập nhật trạng thái notified thành 1 sau khi gửi thông báo thành công
                $updateStmt = $conn->prepare("
                    UPDATE appointment SET notified = 1 WHERE id = ?
                ");
                $updateStmt->bind_param("i", $row['id']);
                $updateStmt->execute();
                $updateStmt->close();

                $notifications[] = [
                    'message' => $message,
                    'created_at' => date('Y-m-d H:i:s')
                ];
            } else {
                $response['error'] = 'Failed to insert notification: ' . $stmtInsert->error;
            }
        }

        $stmtInsert->close();

        $response['success'] = true;
        $response['notifications'] = $notifications;
    } else {
        $response['success'] = true;
        $response['notifications'] = [];
    }

    $stmt->close();
} else {
    $response['success'] = false;
    $response['error'] = 'Invalid request method';
}

echo json_encode($response);
$conn->close();
?>
