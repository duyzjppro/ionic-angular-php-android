<?php
require 'connect.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $specialty = $_POST['specialty'];
    $phone = $_POST['phone'];
    $image_url = null;

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'assets/';
        $upload_file = $upload_dir . basename($_FILES['image']['name']);
    
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
    
        if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_file)) {
            $image_url = $upload_file;
        } else {
            $response['success'] = false;
            $response['message'] = 'Failed to upload image.';
            echo json_encode($response);
            exit;
        }
    }

    $query = "UPDATE doctors SET name = ?, specialty = ?, phone = ?" . ($image_url ? ", image_url = ?" : "") . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    
    if ($image_url) {
        $stmt->bind_param("ssssi", $name, $specialty, $phone, $image_url, $id);
    } else {
        $stmt->bind_param("sssi", $name, $specialty, $phone, $id);
    }

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Doctor updated successfully.';
    } else {
        $response['success'] = false;
        $response['message'] = 'Failed to update doctor.';
    }

    $stmt->close();
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
$conn->close();
?>
