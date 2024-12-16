<?php
require 'connect.php';

$data = json_decode(file_get_contents("php://input"));

if ($data) {
    // kiểm tra dữ liệu
    error_log(print_r($data, true)); 

    $shift_date = $data->shift_date ?? null;
    $shift_period = $data->shift_period ?? null;
    $doctor_id = $data->doctor_id ?? null;
    $clinic_id = $data->clinic_id ?? null;

    if ($shift_date && $shift_period && $doctor_id && $clinic_id) {
        $query = "INSERT INTO shifts (shift_date, shift_period, doctor_id, clinic_id) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssii", $shift_date, $shift_period, $doctor_id, $clinic_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
}
?>
