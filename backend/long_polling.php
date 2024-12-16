
// dùng IPv4 để có thể dễ dàng chuyển đổi sang android

<?php
require 'connect.php';

$patientId = isset($_GET['patient_id']) ? $_GET['patient_id'] : null;

if (!$patientId) {
    echo json_encode(['error' => 'Patient ID is required']);
    exit;
}

$currentDate = date('Y-m-d');
$currentTime = new DateTime();
$currentTimeFormatted = $currentTime->format('H:i:s');

//  (next 30 minutes)
$endTime = $currentTime->modify('+30 minutes')->format('H:i:s');

$query = "
    SELECT a.id, c.name as clinic_name, ts.time as time_slot, a.appointment_date 
    FROM appointment a
    JOIN clinics c ON a.clinic_id = c.id
    JOIN time_slots ts ON a.time_slot_id = ts.id
    WHERE a.patient_id = ? 
    AND a.appointment_date = ?
    AND ts.time BETWEEN ? AND ?
";
$stmt = $conn->prepare($query);
$stmt->bind_param('ssss', $patientId, $currentDate, $currentTimeFormatted, $endTime);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = [
        'clinic_name' => $row['clinic_name'],
        'time_slot' => $row['time_slot'],
        'appointment_date' => $row['appointment_date'],
        'message' => "Bạn có cuộc hẹn tại phòng " . $row['clinic_name'] . " lúc " . $row['time_slot']
    ];
}

if (!empty($notifications)) {
    echo json_encode(['notifications' => $notifications]);
} else {
    sleep(30);
    echo json_encode(['notifications' => []]);
}

$conn->close();
?>
