<?php 
session_start();
include "db.php";

// If already logged in, go to profile
if (isset($_SESSION['user_id'])) {
    header("Location: profile.php");
    exit();
}

$error   = "";
$success = "";

if (isset($_POST['register'])) {
    $name     = trim($_POST['name']);
    $email    = trim($_POST['email']);
    $password = trim($_POST['password']);
    $confirm  = trim($_POST['confirm']);

    if (empty($name) || empty($email) || empty($password) || empty($confirm)) {
        $error = "All fields are required.";

    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";

    } elseif (strlen($password) < 6) {
        $error = "Password must be at least 6 characters.";

    } elseif ($password !== $confirm) {
        $error = "Passwords do not match.";

    } else {
        // Check if email already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $error = "An account with that email already exists.";
        } else {
            // Hash the password before saving!
            $hashed = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $name, $email, $hashed);

            if ($stmt->execute()) {
                header("Location: login.php?registered=1");
                exit();
            } else {
                $error = "Something went wrong. Please try again.";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register — TUKUTANE</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="auth-body">
  <div class="auth-wrapper">

    <div class="auth-header">
      <div class="logo">🎉</div>
      <h1>TUKUTANE</h1>
      <p>Create your free account today</p>
    </div>

    <div class="card">
      <h2>Create Account ✨</h2>
      <p class="subtitle">Join thousands of event planners</p>

      <?php if ($error): ?>
        <div class="msg msg-error">⚠️ <?= htmlspecialchars($error) ?></div>
      <?php endif; ?>

      <form method="POST" action="">

        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Juan dela Cruz"
            value="<?= htmlspecialchars($_POST['name'] ?? '') ?>"
            required
          >
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"
            required
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Min. 6 characters"
            required
          >
        </div>

        <div class="form-group">
          <label for="confirm">Confirm Password</label>
          <input
            type="password"
            id="confirm"
            name="confirm"
            placeholder="Repeat your password"
            required
          >
        </div>

        <button type="submit" name="register" class="btn btn-secondary">
          Create Account →
        </button>

      </form>

    </div><!-- /.card -->

    <div class="auth-footer">
      Already have an account?
      <a href="login.php">Sign in here</a>
    </div>

  </div><!-- /.auth-wrapper -->
</body>
</html>