<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Lấy ID trực tiếp từ query string
    $id = isset($_GET['id']) ? mysqli_real_escape_string($conn, $_GET['id']) : null;

    if ($id) {
        // Thực hiện truy vấn DELETE
        $query = "DELETE FROM clinics WHERE id = ?";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('i', $id);
            if ($stmt->execute()) {
                $response = ['success' => true, 'message' => 'Clinic deleted successfully.'];
            } else {
                $response = ['success' => false, 'message' => 'Failed to delete clinic.'];
            }
            $stmt->close();
        } else {
            $response = ['success' => false, 'error' => 'Failed to prepare statement.'];
        }
    } else {
        $response = ['success' => false, 'message' => 'Invalid clinic ID.'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method.'];
}

echo json_encode($response);
$conn->close();
?>
