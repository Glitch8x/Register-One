$base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes('c:\Users\User\Desktop\student result platfrom\src\assets\fut_minna_logo.png'))
$content = "export const logoBase64 = 'data:image/png;base64,$base64';"
$content | Out-File -FilePath 'c:\Users\User\Desktop\student result platfrom\src\assets\logoData.js' -Encoding ascii
