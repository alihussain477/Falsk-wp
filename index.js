<!DOCTYPE html>
<html>
<head>
    <title>Alex WP Loader</title>
</head>
<body style="background-color:#000;color:#0f0;font-family:monospace;">
    <h1>ALEX WHATSAPP LOADER TOOL</h1>
    <form action="/send" method="post" enctype="multipart/form-data">
        <label>Target Number:</label><br>
        <input type="text" name="target" required><br><br>

        <label>Header Name:</label><br>
        <input type="text" name="header" required><br><br>

        <label>Delay (in seconds):</label><br>
        <input type="number" name="delay" required><br><br>

        <label>Message File:</label><br>
        <input type="file" name="message_file" accept=".txt" required><br><br>

        <input type="submit" value="Start Sending">
    </form>
</body>
</html>
