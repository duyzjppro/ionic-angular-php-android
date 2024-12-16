<?php
require 'connect.php';

$response = [];

// Ensure the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect POST parameters
    $id = $_POST['id'];
    $name = $_POST['name'];
    $age = $_POST['age'];
    $gender = $_POST['gender'];
    $phone = $_POST['phone'];
    $city = $_POST['city'];
    $image_url = null;

    // Check if an image file is uploaded
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'assets/';
        $upload_file = $upload_dir . basename($_FILES['image']['name']);
        
        // Create the directory if it doesn't exist
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        // Move the uploaded file to the assets directory
        if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_file)) {
            $image_url = $upload_file; // Save the path of the uploaded image
        } else {
            // If the file couldn't be uploaded, return an error response
            $response['success'] = false;
            $response['message'] = 'Failed to upload image.';
            echo json_encode($response);
            exit;
        }
    }

    // Prepare the SQL query
    $query = "UPDATE patients SET name = ?, age = ?, gender = ?, phone = ?, city = ?" . ($image_url ? ", image_url = ?" : "") . " WHERE id = ?";
    $stmt = $conn->prepare($query);

    // Bind the parameters based on whether an image was uploaded
    if ($image_url) {
        // If an image was uploaded, include it in the query
        $stmt->bind_param("sissssi", $name, $age, $gender, $phone, $city, $image_url, $id);
    } else {
        // If no image was uploaded, omit the image field
        $stmt->bind_param("sisssi", $name, $age, $gender, $phone, $city, $id);
    }

    // Execute the query and check if it was successful
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Patient updated successfully.';
    } else {
        $response['success'] = false;
        $response['message'] = 'Failed to update patient.';
    }

    $stmt->close();
} else {
    // If the request method is not POST, return an error response
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
}

// Return the response as JSON
echo json_encode($response);
$conn->close();
?>
