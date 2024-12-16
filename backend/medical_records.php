<?php
require 'connect.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['patient_id'], $_POST['patient_record_code'])) {
    $patient_id = intval($_POST['patient_id']);
    $patient_record_code = $_POST['patient_record_code'];
    $upload_dir = 'uploads/medical_records/';
    $image_url = null;

    // Kiểm tra và xử lý ảnh upload
    if (isset($_FILES['record_image']) && $_FILES['record_image']['error'] === UPLOAD_ERR_OK) {
        $file_type = mime_content_type($_FILES['record_image']['tmp_name']);
        if (in_array($file_type, ['image/jpeg', 'image/png', 'image/gif'])) {
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            $image_path = $upload_dir . basename($_FILES['record_image']['name']);
            if (move_uploaded_file($_FILES['record_image']['tmp_name'], $image_path)) {
                $image_url = $image_path;
            } else {
                $response = ['success' => false, 'message' => 'Không thể tải lên hình ảnh.'];
                echo json_encode($response);
                exit;
            }
        } else {
            $response = ['success' => false, 'message' => 'Định dạng ảnh không hợp lệ.'];
            echo json_encode($response);
            exit;
        }
    }

    // Thêm thông tin hồ sơ bệnh án vào CSDL
    $stmt = $conn->prepare("INSERT INTO medical_records (patient_id, patient_record_code, image_url) VALUES (?, ?, ?)");
    $stmt->bind_param('iss', $patient_id, $patient_record_code, $image_url);
    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => 'Tải lên hồ sơ bệnh án thành công.'];
    } else {
        error_log('Failed to insert record: ' . $stmt->error);
        $response = ['success' => false, 'message' => 'Không thể thêm hồ sơ bệnh án vào CSDL.'];
    }
    $stmt->close();
} else {
    $response = ['success' => false, 'message' => 'Phương thức hoặc dữ liệu không hợp lệ.'];
}

echo json_encode($response);
$conn->close();
?>
