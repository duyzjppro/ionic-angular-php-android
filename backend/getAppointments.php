<?php
require 'connect.php';

$sql = "SELECT a.id, a.patient_id, a.date, a.code, p.name AS patient_name 
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        ORDER BY a.date, a.code";

$result = $conn->query($sql);

$appointments = [];
while($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode(['appointments' => $appointments]);

$conn->close();
?>
