<?php


require 'connect.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['user_id'])) {
        $user_id = $_GET['user_id'];

        $stmt = $conn->prepare("SELECT id, name FROM patients WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $patient = $result->fetch_assoc();
            $response = array('patient_id' => $patient['id'], 'name' => $patient['name']);
        } else {
            $response = array('error' => 'Patient not found');
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
