<?php
require 'connect.php';

// Get the current time and calculate the time 30 minutes later
$currentTime = new DateTime();
$timeStart = $currentTime->format('H:i:s');

$currentTime->modify('+30 minutes');
$timeEnd = $currentTime->format('H:i:s');
$formattedDate = $currentTime->format('Y-m-d');

// Query for appointments happening in the next 30 minutes
$query = "
    SELECT a.id, p.id as patient_id, c.name as clinic_name, ts.time as time_slot, a.appointment_date 
    FROM appointment a
    JOIN patients p ON a.patient_id = p.id
    JOIN clinics c ON a.clinic_id = c.id
    JOIN time_slots ts ON a.time_slot_id = ts.id
    WHERE a.appointment_date = ? AND ts.time BETWEEN ? AND ?
";
$stmt = $conn->prepare($query);
$stmt->bind_param('sss', $formattedDate, $timeStart, $timeEnd);
$stmt->execute();
$result = $stmt->get_result();

// Store notifications in the database
while ($row = $result->fetch_assoc()) {
    $patientId = $row['patient_id'];
    $message = "Bạn có cuộc hẹn tại phòng " . $row['clinic_name'] . " lúc " . $row['time_slot'] . " vào ngày " . $row['appointment_date'];

    // Insert notification into the database
    $insertNotification = "INSERT INTO notifications (patient_id, message) VALUES (?, ?)";
    $stmtInsert = $conn->prepare($insertNotification);
    $stmtInsert->bind_param('is', $patientId, $message);
    $stmtInsert->execute();
}

$conn->close();
?>
