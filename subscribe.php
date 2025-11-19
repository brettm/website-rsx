<?php
require_once '../config.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var(trim($_POST["email"]), FILTER_VALIDATE_EMAIL);
    
    if ($email) {
        // Get credentials from environment variables (more secure)
        $apiKey = getenv('BREVO_API_KEY');
        $listId = getenv('BREVO_LIST_ID');
        
        if (!$apiKey || !$listId) {
            error_log("Brevo credentials not configured");
            echo "error";
            exit;
        }
        
        $brevoUrl = 'https://api.brevo.com/v3/contacts';
        
        $data = [
            'email' => $email,
            'listIds' => [intval($listId)],
            'updateEnabled' => true
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $brevoUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'accept: application/json',
            'content-type: application/json',
            'api-key: ' . $apiKey
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 201 || $httpCode === 204) {
            echo "success";
        } elseif ($httpCode === 400) {
            echo "invalid";
        } else {
            error_log("Brevo API Error: " . $response);
            echo "error";
        }
        
    } else {
        echo "invalid";
    }
} else {
    echo "invalid";
}
?>
