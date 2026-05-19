<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST method is allowed.']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON body.']);
    exit;
}

$fileName = $data['fileName'] ?? 'ie-graph-export';
$content = $data['content'] ?? '';

$fileName = trim($fileName);
$fileName = preg_replace('/\s+/', '-', $fileName);
$fileName = preg_replace('/[^a-zA-Z0-9-_]/', '', $fileName);
$fileName = strtolower($fileName);

if ($fileName === '') {
    $fileName = 'ie-graph-export';
}

$shareDir = __DIR__ . '/../share';

if (!is_dir($shareDir)) {
    mkdir($shareDir, 0755, true);
}

$filePath = $shareDir . '/' . $fileName . '.json';

$result = file_put_contents($filePath, $content);

if ($result === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not save file.']);
    exit;
}

$fileUrl = '/~21_zalubski/frame-system/share/' . $fileName . '.json';

echo json_encode([
    'success' => true,
    'message' => 'File saved successfully.',
    'fileName' => $fileName . '.json',
    'fileUrl' => $fileUrl
]);