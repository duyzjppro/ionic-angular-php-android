<?php
require 'connect.php';

$response = [];

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $query = "SELECT id, name, age, gender, phone, city FROM patients WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $doctor = $result->fetch_assoc();
        $response['success'] = true;
        $response['data'] = $doctor;
    } else {
        $response['success'] = false;
        $response['message'] = 'Không tìm thấy bệnh nhân.';
    }

    $stmt->close();
} else {
    $response['success'] = false;
    $response['message'] = 'Thiếu tham số ID.';
}

echo json_encode($response);
$conn->close();
?>
