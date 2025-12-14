<?php
require_once 'playerstorage.php';
header('Content-Type: application/json');
try {
    $ps = new Playerstorage();
    $players = $ps->findAll([]);
    $allScores = [];
    foreach ($players as $p) {
        $name = $p['name'] ?? '---';
        $scores = $p['scores'] ?? [];
        foreach ($scores as $s) {
            $allScores[] = ['name' => $name, 'score' => (int)$s];
        }
    }
    usort($allScores, function($a,$b){ return $b['score'] <=> $a['score']; });
    $top10 = array_slice($allScores, 0, 10);
    while (count($top10) < 10) $top10[] = ['name' => '---','score'=>0];
    echo json_encode($top10);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error'=>$e->getMessage()]);
}
