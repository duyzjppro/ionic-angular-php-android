<?php
require 'connect.php';

$data = json_decode(file_get_contents("php://input"));
$name = $data->name;
$creation_date = $data->creation_date;

$query = "INSERT INTO clinics (name, creation_date) VALUES (?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $name, $creation_date);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
?>
