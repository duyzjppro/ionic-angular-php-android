<?php
require 'connect.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => '', 'image_url' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Kiểm tra các trường bắt buộc
    $required_fields = ['name', 'age', 'gender', 'phone', 'city', 'user_id'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty($_POST[$field])) {
            $response['message'] = "Thiếu trường bắt buộc: $field";
            echo json_encode($response);
            exit;
        }
    }

    $name = $_POST['name'];
    $age = $_POST['age'];
    $gender = $_POST['gender'];
    $phone = $_POST['phone'];
    $city = $_POST['city'];
    $user_id = $_POST['user_id'];

    $image_url = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = __DIR__ . '/uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        $file_name = uniqid() . '_' . basename($_FILES['image']['name']);
        $upload_file = $upload_dir . $file_name;

        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($_FILES['image']['type'], $allowed_types)) {
            $response['message'] = 'Chỉ chấp nhận file JPEG, PNG hoặc GIF.';
            echo json_encode($response);
            exit;
        }

        if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_file)) {
            // Lưu đường dẫn tương đối cho DB và đường dẫn đầy đủ cho client
            $image_url = 'uploads/' . $file_name;
            $response['image_url'] = 'http://192.168.1.18/medic1/backend/' . $image_url;
        } else {
            $response['message'] = 'Không thể upload hình ảnh.';
            echo json_encode($response);
            exit;
        }
    }

    // Thêm dữ liệu vào DB
    $stmt = $conn->prepare("INSERT INTO patients (user_id, name, age, gender, phone, city, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssss", $user_id, $name, $age, $gender, $phone, $city, $image_url);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Hồ sơ bệnh nhân đã được tạo thành công.';
    } else {
        $response['message'] = 'Không thể tạo hồ sơ bệnh nhân: ' . $stmt->error;
    }

    $stmt->close();
} else {
    $response['message'] = 'Phương thức yêu cầu không hợp lệ.';
}

echo json_encode($response);
$conn->close();
?>
