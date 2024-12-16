<?php
header('Content-Type: application/json');
require_once 'connect.php';

// Accept both POST and GET requests for flexibility
$patient_id = 0;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $patient_id = isset($_POST['patient_id']) ? intval($_POST['patient_id']) : 0;
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $patient_id = isset($_GET['patient_id']) ? intval($_GET['patient_id']) : 0;
}

if ($patient_id > 0) {
    // Your SQL query and processing logic here...
    $sql = "SELECT 
                a.id AS appointment_id, 
                a.appointment_date, 
                ts.time AS time_slot, 
                c.name AS clinic_name
            FROM appointment a
            INNER JOIN time_slots ts ON a.time_slot_id = ts.id
            INNER JOIN clinics c ON a.clinic_id = c.id
            WHERE a.patient_id = ?";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param('i', $patient_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $appointments = [];
        while ($row = $result->fetch_assoc()) {
            $appointments[] = [
                'appointment_id' => $row['appointment_id'],
                'appointment_date' => $row['appointment_date'],
                'time' => $row['time_slot'],
                'clinic_name' => $row['clinic_name']
            ];
        }

        if (count($appointments) > 0) {
            echo json_encode([
                'success' => true,
                'appointments' => $appointments
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'No appointments found for this patient.'
            ]);
        }

        $stmt->close();
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to prepare the SQL statement.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid patient ID.',
        'received_id' => $patient_id // Log the received ID for debugging
    ]);
}

$conn->close();
?>
