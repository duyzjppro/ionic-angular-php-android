<?php
require 'connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['creation_date'])) {
        $date = mysqli_real_escape_string($conn, $_GET['creation_date']);
        $date = date('Y-m-d', strtotime($date));

        // Query to fetch clinics by date
        $query = "SELECT id, name, creation_date FROM clinics WHERE creation_date = ?";
        
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('s', $date);
            $stmt->execute();
            $result = $stmt->get_result();

            $clinics = [];
            while ($row = $result->fetch_assoc()) {
                $clinics[] = $row;
            }

            $response = ['success' => true, 'clinics' => $clinics];
            $stmt->close();
        } else {
            $response = ['success' => false, 'error' => 'Failed to prepare statement'];
        }
    } else {
        $response = ['success' => false, 'error' => 'Date parameter is missing'];
    }
} else {
    $response = ['success' => false, 'error' => 'Invalid request method'];
}

echo json_encode($response);
$conn->close();
?>
