<?php
$servername = "localhost"; // Hoặc địa chỉ IP của máy chủ MySQL
$username = "root"; // Tên người dùng MySQL
$password = ""; // Mật khẩu MySQL (để trống nếu không đặt mật khẩu)
$database = "project"; // Tên cơ sở dữ liệu

// Tạo kết nối
$conn = new mysqli($servername, $username, $password, $database);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
?>
