<?php
require 'connect.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $patient_id = $data->patient_id;
    $date = $data->date;

    $sql = "SELECT MAX(code) AS max_code FROM appointments WHERE date = '$date'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $code = $row['max_code'] ? $row['max_code'] + 1 : 1;

    $sql = "INSERT INTO appointments (patient_id, date, code, status) VALUES ('$patient_id', '$date', $code, 'active')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['code' => $code]);
    } else {
        echo json_encode(['error' => 'Error: ' . $conn->error]);
    }
}

$conn->close();
?>
