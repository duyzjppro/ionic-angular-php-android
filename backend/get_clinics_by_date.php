<?php
header('Content-Type: application/json');
require 'connect.php'; // Kết nối đến cơ sở dữ liệu

// Kiểm tra phương thức POST và có tham số ngày
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['date'])) {
    $date = $_POST['date'];

    // Kiểm tra giá trị ngày trước khi thực hiện truy vấn
    if (empty($date)) {
        echo json_encode(['success' => false, 'message' => 'Ngày không hợp lệ.']);
        exit;
    }

    // Chuẩn bị câu truy vấn để lấy các phòng khám có creation_date <= date
    $stmt = $conn->prepare("SELECT id, name FROM clinics WHERE creation_date <= ?");
    $stmt->bind_param("s", $date);
    $stmt->execute();
    $result = $stmt->get_result();

    $clinics = [];
    while ($row = $result->fetch_assoc()) {
        $clinics[] = $row;
    }

    echo json_encode(['success' => true, 'clinics' => $clinics]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
