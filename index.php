<?php
include("validate.php");
include("playerstorage.php");

$data = [];
$errors = [];
if(count($_POST) > 0)
{
  if(validate($_POST, $data, $errors))
  {
      $name = $data['name'];
      $password = $data['password'];
      $playerstorage = new PlayerStorage();
      $player = $playerstorage->findOne(["name" => $name]);
      if($player !== null && password_verify($password, $player["password"]))
      {
        $playerid = $player["id"];
        header("Location: game.php?id=$playerid");
        exit();
      }
      else
      {
        $errors["notfound"] = "Hibás felhasználónév vagy jelszó";
      }
  }
}

?>

<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tetris</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div class="container">
    <div class="menu">
      <h1>Tetris</h1>
      <form action="" method="post">
        <div class="control-row">
          <label>Felhasználónév:</label>
          <input type="text" name="name"
          value="<?= $_GET['name'] ?? $_POST['name'] ?? ""?>" required>
          <?php if (isset($errors['name'])) : ?>
            <small><?=  $errors['name'] ?></small>
          <?php endif; ?>
        </div>

        <div class="control-row">
          <label>Jelszó:</label>
          <input type="password" name="password" required>
          <?php if (isset($errors['password'])) : ?>
            <small><?=  $errors['password'] ?></small>
          <?php endif; ?>
        </div>

        <?php if (isset($errors['notfound'])) : ?>
          <span><?= $errors["notfound"] ?></span><br><br>
        <?php endif; ?>

        <div class="control-row">
          <label>Játéktér méret:</label>
          <select id="gridSizeSelect">
            <option value="8x16">Kicsi (8×16)</option>
            <option value="10x20">Normál (10×20)</option>
            <option value="12x24">Nagy (12×24)</option>
          </select>
        </div>
        <button type="submit" class="btn">Belépés</button>
        <p>Amennyiben nem rendelkezik felhasználói fiókkal<br> 
        kattintson az alábbi <a href="register.php">linkre</a></p>
      </form>
    </div>
  </div>
  <script>
    const form = document.querySelector("form");
    const Selector = document.querySelector("#gridSizeSelect");

    form.addEventListener('submit', () => {
      localStorage.setItem('gridSize', Selector.value);
    });
</script>
</body>
</html>