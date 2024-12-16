<?php
require('connect.php');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];
    $name = $_POST['name'];
    $specialty = $_POST['specialty'];
    $phone = $_POST['phone'];

    // Kiểm tra xem user_id đã tồn tại trong bảng doctors chưa
    $check_query = "SELECT id FROM doctors WHERE user_id = ?";
    $stmt = $conn->prepare($check_query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $response['success'] = false;
        $response['message'] = 'User ID đã tồn tại. Không thể thêm bác sĩ mới.';
        echo json_encode($response);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $stmt->close(); // Đóng truy vấn kiểm tra để tiếp tục với truy vấn chèn dữ liệu

    $image_url = null;

    // Xử lý upload hình ảnh
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/';
        $upload_file = $upload_dir . basename($_FILES['image']['name']);
    
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
    
        if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_file)) {
            $image_url = $upload_file;
        } else {
            $response['success'] = false;
            $response['message'] = 'Không thể tải lên hình ảnh.';
            echo json_encode($response);
            exit;
        }
    }

    // Thực hiện truy vấn thêm bác sĩ
    $query = "INSERT INTO doctors (user_id, name, specialty, phone, image_url) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("issss", $user_id, $name, $specialty, $phone, $image_url);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Bác sĩ đã được thêm thành công.';
    } else {
        error_log('Failed to execute statement: ' . $stmt->error);
        $response['success'] = false;
        $response['message'] = 'Không thể thêm bác sĩ.';
    }

    $stmt->close();
} else {
    $response['success'] = false;
    $response['message'] = 'Phương thức yêu cầu không hợp lệ.';
}

echo json_encode($response);
$conn->close();
?>
