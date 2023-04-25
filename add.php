<?php
// Get the form data
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

// Sanitize the data to prevent SQL injection attacks
$name = mysqli_real_escape_string($con, $name);
$email = mysqli_real_escape_string($con, $email);
$message = mysqli_real_escape_string($con, $message);

// Connect to the database
$con = mysqli_connect("hostname", "username", "password", "database_name");

// Check if the connection was successful
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit();
}

// Insert the data into the database
$sql = "INSERT INTO contacts (name, email, message) VALUES ('$name', '$email', '$message')";
if (mysqli_query($con, $sql)) {
    // Send a success message to the user and redirect them back to the homepage
    echo "Message sent successfully!";
    header("Location: index.html");
} else {
    // Send an error message to the user
    echo "Error: " . $sql . "<br>" . mysqli_error($con);
}

// Close the database connection
mysqli_close($con);
?>
