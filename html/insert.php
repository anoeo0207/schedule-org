<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Kết nối database
$conn = new mysqli('localhost', 'root', '', 'project');

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}

// Lấy dữ liệu từ form
$TenSuKien = $_POST['eventName'] ?? '';
$Ngay = $_POST['eventDate'] ?? '';
$ThoiGian = $_POST['eventTime'] ?? '';
$DiaDiem = $_POST['eventLocation'] ?? '';

// Tạo UUID trong PHP
$UUID = uniqid('', true); // hoặc sử dụng ramsey/uuid nếu cần

// Chuẩn bị câu lệnh SQL
$stmt = $conn->prepare("INSERT INTO events (id, TenSuKien, Ngay, ThoiGian, DiaDiem) VALUES (?, ?, ?, ?, ?)");

if (!$stmt) {
    die("Lỗi SQL: " . $conn->error);
}

// Gán giá trị và thực thi
$stmt->bind_param("sssss", $UUID, $TenSuKien, $Ngay, $ThoiGian, $DiaDiem);
if ($stmt->execute()) {
    if (file_exists("dashboard.html")) {
        header("Location: dashboard.html");
        exit();
    } else {
        echo "Lỗi: Không tìm thấy trang dashboard.html";
    }
} else {
    echo "Lỗi: " . $stmt->error;
}

// Đóng kết nối
$stmt->close();
$conn->close();
?>
