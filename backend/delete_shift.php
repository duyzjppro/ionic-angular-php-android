<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->shift_id)) {
        $shift_id = mysqli_real_escape_string($conn, $data->shift_id);

        $query = "DELETE FROM shifts WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $shift_id);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Shift deleted successfully';
        } else {
            $response['success'] = false;
            $response['error'] = 'Failed to delete shift';
        }

        $stmt->close();
    } else {
        $response['success'] = false;
        $response['error'] = 'Shift ID is required';
    }
} else {
    $response['success'] = false;
    $response['error'] = 'Invalid request method';
}

echo json_encode($response);
$conn->close();
?>
