<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require 'config.php';

if (!$conn) {
    echo json_encode(["success" => false, "error" => "Lỗi kết nối CSDL"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "error" => "Phương thức không hợp lệ"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"]) || !is_string($data["id"])) { // Kiểm tra id là chuỗi
    echo json_encode(["success" => false, "error" => "ID không hợp lệ"]);
    exit;
}

$id = $data["id"]; // Giữ nguyên id dạng chuỗi
error_log("ID cần xóa: " . $id);

// Kiểm tra xem ID có tồn tại không
$checkStmt = $conn->prepare("SELECT id FROM events WHERE id = ?");
if (!$checkStmt) {
    echo json_encode(["success" => false, "error" => "Lỗi chuẩn bị truy vấn kiểm tra"]);
    exit;
}

$checkStmt->bind_param("s", $id); // Sử dụng "s" cho kiểu dữ liệu chuỗi
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "Sự kiện không tồn tại"]);
    $checkStmt->close();
    exit;
}
$checkStmt->close();

// Xóa sự kiện với ID cụ thể
$stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Lỗi chuẩn bị truy vấn xóa"]);
    exit;
}

$stmt->bind_param("s", $id); // Sử dụng "s" cho kiểu dữ liệu chuỗi
if ($stmt->execute()) {
    error_log("Xóa thành công: " . $stmt->affected_rows . " hàng");
    echo json_encode(["success" => true, "message" => "Xóa thành công"]);
} else {
    error_log("Lỗi khi xóa: " . $stmt->error);
    echo json_encode(["success" => false, "error" => "Lỗi khi xóa"]);
}

$stmt->close();
$conn->close();
?>