<?php ?>
<!DOCTYPE html>
session_start();
include "db.php";

// Must be logged in to see this page
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Fetch fresh user data from DB
$id   = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$user   = $result->fetch_assoc();

// Get first letter of name for avatar
$initial = strtoupper(substr($user['name'], 0, 1));

// Format joined date
$joined = date("F j, Y", strtotime($user['created_at']));
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile — JAMSPACE</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="profile-body">

  <!-- TOP NAV BAR -->
  <nav class="profile-topbar">
    <a href="profile.php" class="brand">🎉 JAMSPACE</a>
    <a href="logout.php" class="logout-btn">Logout</a>
  </nav>

  <main class="profile-main">

    <!-- HERO CARD -->
    <div class="profile-hero">
      <div class="profile-avatar"><?= $initial ?></div>
      <div class="profile-hero-info">
        <h2><?= htmlspecialchars($user['name']) ?></h2>
        <div class="email-badge">✉️ <?= htmlspecialchars($user['email']) ?></div>
        <p class="joined">📅 Member since <?= $joined ?></p>
      </div>
    </div>

    <!-- INFO CARDS -->
    <div class="info-grid">

      <div class="info-card">
        <div class="info-card-icon icon-purple">👤</div>
        <div class="info-card-content">
          <label>Full Name</label>
          <span><?= htmlspecialchars($user['name']) ?></span>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-icon icon-teal">📧</div>
        <div class="info-card-content">
          <label>Email Address</label>
          <span><?= htmlspecialchars($user['email']) ?></span>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-icon icon-pink">🆔</div>
        <div class="info-card-content">
          <label>User ID</label>
          <span>#<?= $user['id'] ?></span>
        </div>
      </div>

      <div class="info-card">
        <div class="info-card-icon icon-purple">📅</div>
        <div class="info-card-content">
          <label>Date Joined</label>
          <span><?= $joined ?></span>
        </div>
      </div>

    </div><!-- /.info-grid -->

    <!-- ACTION BUTTONS -->
    <div class="action-row">
      <a href="logout.php" class="btn btn-outline">🚪 Log Out</a>
    </div>

  </main>

</body>
</html>
