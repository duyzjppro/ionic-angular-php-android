<?php
require 'connect.php';
header('Content-Type: application/json');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $id = intval($_GET['id']);

    if ($id <= 0) {
        $response = ['success' => false, 'message' => 'Invalid user ID.'];
    } else {
        // Bắt đầu transaction
        $conn->begin_transaction();

        try {
            // Xóa bản ghi liên quan trong bảng doctor
            $deleteDoctorQuery = "DELETE FROM doctors WHERE user_id = ?";
            $stmtDoctor = $conn->prepare($deleteDoctorQuery);
            $stmtDoctor->bind_param("i", $id);
            $stmtDoctor->execute();

            // Xóa bản ghi liên quan trong bảng patient
            $deletePatientQuery = "DELETE FROM patients WHERE user_id = ?";
            $stmtPatient = $conn->prepare($deletePatientQuery);
            $stmtPatient->bind_param("i", $id);
            $stmtPatient->execute();

            // Xóa bản ghi trong bảng user
            $deleteUserQuery = "DELETE FROM users WHERE id = ?";
            $stmtUser = $conn->prepare($deleteUserQuery);
            $stmtUser->bind_param("i", $id);
            $stmtUser->execute();

            // Commit transaction
            $conn->commit();
            $response = ['success' => true, 'message' => 'User and related records deleted successfully.'];
        } catch (Exception $e) {
            $conn->rollback(); // Rollback nếu có lỗi
            $response = ['success' => false, 'message' => 'Failed to delete user and related records.', 'error' => $e->getMessage()];
        }
    }
} else {
    $response = ['success' => false, 'message' => 'Invalid request method or missing user ID.'];
}

echo json_encode($response);
$conn->close();
