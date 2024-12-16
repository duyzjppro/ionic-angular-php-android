<?php
require 'connect.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $selectedDate = mysqli_real_escape_string($conn, $_GET['selectedDate']);

    $query = "
        SELECT s.id, s.shift_date, s.shift_period, d.name AS doctor_name, c.name AS clinic_name
        FROM shifts s
        JOIN doctors d ON s.doctor_id = d.id
        JOIN clinics c ON s.clinic_id = c.id
        WHERE s.shift_date = ?
        ORDER BY s.shift_period ASC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $selectedDate);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $shifts = [];
        while ($row = $result->fetch_assoc()) {
            $shifts[] = $row;
        }
        $response['success'] = true;
        $response['shifts'] = $shifts;
    } else {
        $response['error'] = 'No shifts found for the selected date';
    }

    $stmt->close();
} else {
    $response['error'] = 'Invalid request method';
}

echo json_encode($response);
$conn->close();
?>
