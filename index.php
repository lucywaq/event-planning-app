<?php ?>
<!DOCTYPE html>
// Auto-redirect after 3 seconds via meta tag below
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="3;url=login.php">
  <title>Event App — Loading</title>
  <link rel="stylesheet" href="css/style.css">
  <style>
    /* Extra splash animation */
    .splash-card {
      animation: fadeIn 0.8s ease forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body class="splash-body">
  <div class="splash-card">
    <div class="splash-logo">🎉</div>
    <h1 class="splash-title">JAMSPACE</h1>
    <p class="splash-sub">Your events, perfectly organized</p>
    <div class="splash-loader">
      <div class="splash-dot"></div>
      <div class="splash-dot"></div>
      <div class="splash-dot"></div>
    </div>
  </div>
</body>
</html>
