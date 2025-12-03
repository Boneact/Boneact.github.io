<?php
include("playerstorage.php");

$playerstorage = new PlayerStorage();
$currplayer = $playerstorage->findById($_GET["id"]);

$players = json_decode(file_get_contents("users.json"), true);

$allScores = [];

foreach ($players as $player) {
    $name = $player["name"];
    foreach ($player["scores"] as $score) {
        $allScores[] = [
            "name" => $name,
            "score" => $score
        ];
    }
}

usort($allScores, function($a, $b) {
    return $b["score"] <=> $a["score"];
});

$top10 = array_slice($allScores, 0, 10);

while (count($top10) < 10)
  {
    $top10[] = [
      "name"=> "---",
      "score"=> 0
    ];
  }
?>

<!doctype html>
<html lang="hu">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="stylesheet" href="css/styles.css"/>
  <title>Web Tetris</title>
</head>
<body>
  <script>
    localStorage.setItem('playerName', <?php echo json_encode($currplayer['name'] ?? ''); ?>);
  </script>
  <div class="container">
    <div class="sidebar">
      <h1>Leaderboard</h1>
      <div class="score-window-header">Top 10</div>
      <ol class="score-list">
        <?php foreach($top10 as $entry): ?>
          <li>
            <span><?= $entry["name"] ?></span>
            <strong><?= (int)$entry["score"] ?></strong>
          </li>
        <?php endforeach; ?>
      </ol>
      <div class="player-info">
        <div class="player-meta">
          <h5>Név</h5>
          <span class="player-name"><?= $currplayer["name"] ?></span>
        </div>
        <div class="player-actions">
          <button class="btn" id="exitBtn">Kilépés</button>
        </div>
      </div>
    </div>
    <div>
      <canvas id="playfield"></canvas>
    </div>
    <div class="sidebar">
      <h1>Tetris</h1>
      <div class="stat"><span>Pont:</span><span id="score">0</span></div>
      <div class="stat"><span>Szint:</span><span id="level">1</span></div>
      <div class="stat"><span>Sorok:</span><span id="lines">0</span></div>
      <canvas id="next" class="small-canvas" width="120" height="120"></canvas>
      <canvas id="hold" class="small-canvas" width="120" height="120"></canvas>
      <button id="newgameBtn" class="btn">Új játék</button>
      <button id="pauseBtn" class="btn">Szünet</button>
      <div class="controls">
        <strong>Billentyűk</strong>
        <ul>
          <li>← / → : mozgatás</li>
          <li>↓ : gyors esés</li>
          <li>Szóköz: hard drop</li>
          <li>↑ : forgatás</li>
          <li>c : hold</li>
          <li>p : szüneteltetés</li>
        </ul>
      </div>
    </div>
  </div>
  <script type="module" src="js/main.js"></script>
  <script>
    const exitBtn = document.querySelector("#exitBtn");
    exitBtn.addEventListener('click', ()=>window.location.href = "index.php")
  </script>
</body>
</html>
