<?php
require 'connect.php'; // Assuming you have this file that sets up your database connection

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow access from any origin
header('Access-Control-Allow-Methods: GET'); // Allow only GET requests
header('Access-Control-Allow-Headers: Content-Type');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Validate and sanitize input
    $date = isset($_GET['date']) ? mysqli_real_escape_string($conn, $_GET['date']) : null;
    $clinicName = isset($_GET['clinic_name']) ? mysqli_real_escape_string($conn, $_GET['clinic_name']) : null;

    if ($date && $clinicName) {
        // Convert date to correct format (ensure correct date formatting)
        $formattedDate = date('Y-m-d', strtotime($date));

        // Query to retrieve appointments based on the date and partial clinic name match
        $query = "
        SELECT 
            a.id AS appointment_id,
            p.name AS patient_name,
            c.name AS clinic_name,
            ts.time AS time_slot,
            a.appointment_date
        FROM appointment a
        JOIN patients p ON a.patient_id = p.id
        JOIN clinics c ON a.clinic_id = c.id
        JOIN time_slots ts ON a.time_slot_id = ts.id
        WHERE a.appointment_date = ? AND c.name LIKE ? 
        ORDER BY ts.time ASC"; // Sort appointments by time slot

        if ($stmt = $conn->prepare($query)) {
            $searchTerm = "%$clinicName%"; // Using wildcard for partial match
            $stmt->bind_param('ss', $formattedDate, $searchTerm); // Bind parameters
            $stmt->execute();
            $result = $stmt->get_result();

            // Fetch appointments
            $appointments = [];
            while ($row = $result->fetch_assoc()) {
                $appointments[] = $row;
            }

            if (count($appointments) > 0) {
                // Return success response with appointments
                $response = [
                    'success' => true,
                    'appointments' => $appointments
                ];
            } else {
                // No appointments found for the given date and clinic name
                $response = [
                    'success' => false,
                    'error' => 'No appointments found for the selected date and clinic name.'
                ];
            }

            $stmt->close();
        } else {
            // Error preparing the statement
            $response = [
                'success' => false,
                'error' => 'Failed to prepare the query.'
            ];
        }
    } else {
        // Missing date or clinic name parameters
        $response = [
            'success' => false,
            'error' => 'Missing date or clinic name parameter.'
        ];
    }
} else {
    // Invalid request method
    $response = [
        'success' => false,
        'error' => 'Invalid request method.'
    ];
}

// Return JSON response
echo json_encode($response);

// Close database connection
$conn->close();
?>
