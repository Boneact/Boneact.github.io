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
      $data["password"] = password_hash($data["password"], PASSWORD_DEFAULT);
      $playerstorage = new PlayerStorage();
      if($playerstorage->findOne(["name" => $name]) === NULL)
      {
        $playerstorage->add($data);
        header("Location: index.php?name=$name");
        exit();
      }
      else
      {
        $errors["existing"] = "Játékos ezzel a felhasználónévvel már létezik";
      }
  }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Regisztráció</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container">
    <div class="menu">
      <h1>Regisztráció</h1>
      <form action="" method="post">
        <div class="control-row">
          <label>Felhasználónév:</label>
          <input type="text" name="name"
          value="<?= $_POST['name'] ?? ""?>" required>
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
        <?php if (isset($errors['existing'])) : ?>
            <span><?= $errors["existing"] ?></span><br>
        <?php endif; ?>
        <button type="submit" class="btn">Regisztráció</button>
      </form>
    </div>
  </div>
</body>
</html>