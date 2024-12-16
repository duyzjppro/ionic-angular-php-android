<?php
require 'connect.php';

header('Content-Type: application/json');
$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents('php://input'), $data);
    $doctorId = $data['id'] ?? null;

    if ($doctorId) {
        // Lấy thông tin bác sĩ hiện tại để xóa ảnh nếu có
        $query = "SELECT image_url FROM doctors WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $doctorId);
        $stmt->execute();
        $result = $stmt->get_result();
        $doctor = $result->fetch_assoc();
        $stmt->close();

        // Xóa ảnh cũ nếu tồn tại
        if ($doctor && !empty($doctor['image_url']) && file_exists($doctor['image_url'])) {
            unlink($doctor['image_url']);
        }

        // Xóa bác sĩ
        $deleteQuery = "DELETE FROM doctors WHERE id = ?";
        $stmt = $conn->prepare($deleteQuery);
        $stmt->bind_param("i", $doctorId);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Doctor deleted successfully.';
        } else {
            $response['success'] = false;
            $response['message'] = 'Failed to delete doctor.';
        }

        $stmt->close();
    } else {
        $response['success'] = false;
        $response['message'] = 'Invalid doctor ID.';
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
$conn->close();
?>
