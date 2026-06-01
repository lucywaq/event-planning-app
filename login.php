<?php
session_start();
include "db.php";

// If already logged in, go to profile
if (isset($_SESSION['user_id'])) {
    header("Location: profile.php");
    exit();
}

$error = "";
$success = "";

if (isset($_POST['login'])) {
    $email    = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($email) || empty($password)) {
        $error = "Please fill in all fields.";
    } else {
        // Use prepared statement (safer!)
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Check password (password_verify works with password_hash)
            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id']   = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_email']= $user['email'];
                header("Location: profile.php");
                exit();
            } else {
                $error = "Incorrect password. Try again.";
            }
        } else {
            $error = "No account found with that email.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login — EventPlanner</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="auth-body">
  <div class="auth-wrapper">

    <div class="auth-header">
      <div class="logo">🎉</div>
      <h1>EventPlanner</h1>
      <p>Sign in to manage your events</p>
    </div>

    <div class="card">
      <h2>Welcome back 👋</h2>
      <p class="subtitle">Enter your details to continue</p>

      <?php if ($error): ?>
        <div class="msg msg-error">⚠️ <?= htmlspecialchars($error) ?></div>
      <?php endif; ?>

      <?php if (isset($_GET['registered'])): ?>
        <div class="msg msg-success">✅ Account created! Please log in.</div>
      <?php endif; ?>

      <form method="POST" action="">

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
            placeholder="Enter your password"
            required
          >
        </div>

        <button type="submit" name="login" class="btn btn-primary">
          Sign In →
        </button>

      </form>

      <div class="divider">or</div>

    </div><!-- /.card -->

    <div class="auth-footer">
      Don't have an account?
      <a href="register.php">Create one free</a>
    </div>

  </div><!-- /.auth-wrapper -->
</body>
</html>