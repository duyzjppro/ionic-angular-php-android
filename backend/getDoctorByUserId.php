<?php

require 'connect.php';  // Kết nối tới cơ sở dữ liệu

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['user_id'])) {
        $user_id = $_GET['user_id'];

        // Truy vấn bảng doctors dựa trên user_id
        $stmt = $conn->prepare("SELECT id, name, specialty, phone, image_url FROM doctors WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $doctor = $result->fetch_assoc();
            // Trả về thông tin bác sĩ
            $response = array(
                'doctor_id' => $doctor['id'],
                'name' => $doctor['name'],
                'specialty' => $doctor['specialty'],
                'phone' => $doctor['phone'],
                'image_url' => $doctor['image_url']
            );
        } else {
            $response = array('error' => 'Doctor not found');
        }

        $stmt->close();
    } else {
        $response = array('error' => 'user_id parameter is missing');
    }
} else {
    $response = array('error' => 'Invalid request method');
}

echo json_encode($response);

$conn->close();
?>
