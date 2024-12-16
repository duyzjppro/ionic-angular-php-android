<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Content-Type');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Lấy ID từ query string
    $id = isset($_GET['id']) ? mysqli_real_escape_string($conn, $_GET['id']) : null;

    // Lấy dữ liệu JSON từ client
    $data = json_decode(file_get_contents("php://input"));
    $name = $data->name;
    $creation_date = $data->creation_date;

    if ($id && $name && $creation_date) {
        // Câu lệnh SQL để cập nhật phòng khám
        $query = "UPDATE clinics SET name = ?, creation_date = ? WHERE id = ?";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param("ssi", $name, $creation_date, $id);

            if ($stmt->execute()) {
                $response = ['success' => true, 'message' => 'Clinic updated successfully.'];
            } else {
                $response = ['success' => false, 'message' => 'Failed to update clinic.'];
            }

            $stmt->close();
        } else {
            $response = ['success' => false, 'error' => 'Failed to prepare statement.'];
        }
    } else {
        $response = ['success' => false, 'message' => 'Invalid input data or clinic ID.'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method'];
}

echo json_encode($response);
$conn->close();
