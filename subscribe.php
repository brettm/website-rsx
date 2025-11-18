<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var(trim($_POST["email"]), FILTER_VALIDATE_EMAIL);
    
    if ($email) {
        // Set your email address where you want to receive subscriptions
        $to = "your-email@yourbusiness.com";
        $subject = "New Newsletter Subscription";
        $message = "You have a new newsletter subscriber:\n\nEmail: " . $email . "\n\nDate: " . date('Y-m-d H:i:s');
        $headers = "From: newsletter@yourdomain.com";
        
        // Send email
        if (mail($to, $subject, $message, $headers)) {
            // Also save to a text file as backup
            file_put_contents('subscribers.txt', $email . PHP_EOL, FILE_APPEND | LOCK_EX);
            
            // Return success response
            echo "success";
        } else {
            echo "error";
        }
    } else {
        echo "invalid";
    }
} else {
    echo "invalid";
}
?>
