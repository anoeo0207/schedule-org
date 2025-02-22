<?php
// Kết nối đến MySQL
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project"; // Đảm bảo database 'test' tồn tại

$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}

// Truy vấn lấy tất cả sự kiện
$sql = "SELECT id, Ngay, TenSuKien, ThoiGian, DiaDiem FROM events ORDER BY Ngay ASC";
$result = $conn->query($sql);

// Xuất dữ liệu dưới dạng JSON
$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
$conn->close();
?>
