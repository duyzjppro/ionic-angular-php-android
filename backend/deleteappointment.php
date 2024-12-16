<?php
require 'connect.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $appointmentId = isset($input['appointment_id']) ? intval($input['appointment_id']) : 0;

    if ($appointmentId > 0) {
        // Xóa cuộc hẹn dựa vào ID
        $deleteQuery = "DELETE FROM appointment WHERE id = ?";
        if ($stmt = $conn->prepare($deleteQuery)) {
            $stmt->bind_param('i', $appointmentId);
            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = 'Appointment deleted successfully.';
            } else {
                $response['success'] = false;
                $response['error'] = 'Failed to delete appointment.';
            }
            $stmt->close();
        } else {
            $response['success'] = false;
            $response['error'] = 'Failed to prepare delete query.';
        }
    } else {
        $response['success'] = false;
        $response['error'] = 'Invalid appointment ID.';
    }
} else {
    $response['success'] = false;
    $response['error'] = 'Invalid request method.';
}

echo json_encode($response);
$conn->close();
?>
