<?php
require 'connect.php';
header('Content-Type: application/json');

$response = ['success' => false];

if (isset($_POST['patient_id'], $_POST['record_id']) && isset($_FILES['image'])) {
    $patient_id = $_POST['patient_id'];
    $record_id = $_POST['record_id'];
    
    // Lưu file hình ảnh
    $target_dir = "uploads/";
    $file_name = basename($_FILES["image"]["name"]);
    $target_file = $target_dir . uniqid() . "_" . $file_name;
    
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
        // Cập nhật URL hình ảnh trong cơ sở dữ liệu
        $query = "UPDATE medical_records SET image_url = ? WHERE id = ? AND patient_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sii", $target_file, $record_id, $patient_id);

        if ($stmt->execute()) {
            $response = ['success' => true, 'message' => 'Image uploaded and record updated.'];
        } else {
            $response['message'] = 'Database update failed.';
        }
        $stmt->close();
    } else {
        $response['message'] = 'Failed to upload image file.';
    }
} else {
    $response['message'] = 'Invalid input data.';
}

echo json_encode($response);
$conn->close();
