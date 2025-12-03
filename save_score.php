<?php
require_once 'playerstorage.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$score = isset($_POST['score']) ? (int)$_POST['score'] : 0;

if (empty($name) || $score < 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid name or score']);
    exit;
}

try {
    $playerstorage = new PlayerStorage();
    $player = $playerstorage->findOne(['name' => $name]);
    
    if (!$player) {
        http_response_code(404);
        echo json_encode(['error' => 'Player not found']);
        exit;
    }
    
    if (!isset($player['scores'])) {
        $player['scores'] = [];
    }
    $player['scores'][] = $score;
    
    $playerstorage->update($player['id'], $player);
    
    echo json_encode(['ok' => true, 'score' => $score, 'name' => $name]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
