<?php
require 'connect.php';
$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['doctor_id']) && isset($_GET['selected_date'])) {
        $doctor_id = $_GET['doctor_id'];
        $selected_date = $_GET['selected_date'];

        // Thực hiện truy vấn lấy shifts theo doctor_id và selected_date
        $stmt = $conn->prepare("SELECT shift_date, shift_period, clinics.name as clinic_name
                                FROM shifts 
                                JOIN clinics ON shifts.clinic_id = clinics.id
                                WHERE doctor_id = ? AND shift_date = ?");
        $stmt->bind_param("is", $doctor_id, $selected_date);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $shifts = [];
            while ($row = $result->fetch_assoc()) {
                $shifts[] = $row;
            }
            $response = array('shifts' => $shifts);
        } else {
            $response = array('shifts' => []);  // Không có lịch làm việc nào
        }

        $stmt->close();
    } else {
        $response = array('error' => 'Missing doctor_id or selected_date');
    }
} else {
    $response = array('error' => 'Invalid request method');
}

echo json_encode($response);
$conn->close();
?>
