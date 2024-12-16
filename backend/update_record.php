<?php
require 'connect.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);

// Kiểm tra dữ liệu đầu vào
if (isset($input['recordId'], $input['patientName'], $input['diagnosis'], $input['date'])) {
    $recordId = $input['recordId'];
    $patientName = $input['patientName'];
    $diagnosis = $input['diagnosis'];
    $date = $input['date'];

    // Câu lệnh cập nhật hồ sơ bệnh án
    $query = "UPDATE medical_records SET patient_name = ?, diagnosis = ?, date = ? WHERE record_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssi", $patientName, $diagnosis, $date, $recordId);

    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => 'Medical record updated successfully.'];
    } else {
        $response = ['success' => false, 'message' => 'Failed to update medical record.'];
    }
    $stmt->close();
} else {
    $response = ['success' => false, 'message' => 'Invalid input data.'];
}

// Trả về JSON phản hồi
echo json_encode($response);
$conn->close();
