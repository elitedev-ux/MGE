Add-Type -AssemblyName System.Drawing
$files = @(Get-ChildItem -LiteralPath 'src/assets/MGE PIC' -File | Sort-Object Name)
$manifest = for ($i=0; $i -lt $files.Count; $i++) { [pscustomobject]@{ index=$i+1; file=$files[$i].Name } }
$manifest | ConvertTo-Json | Set-Content -Encoding UTF8 'asset-index.json'
for ($start=0; $start -lt $files.Count; $start+=20) {
  $canvas = New-Object System.Drawing.Bitmap 1400,1200
  $g = [System.Drawing.Graphics]::FromImage($canvas)
  $g.Clear([System.Drawing.Color]::White)
  $font = New-Object System.Drawing.Font 'Arial',12
  for ($j=0; $j -lt 20 -and ($start+$j) -lt $files.Count; $j++) {
    $file=$files[$start+$j]; $img=[System.Drawing.Image]::FromFile($file.FullName)
    $x=($j%5)*280; $y=[math]::Floor($j/5)*300
    $scale=[math]::Min(260/$img.Width,265/$img.Height)
    $w=[int]($img.Width*$scale); $h=[int]($img.Height*$scale)
    $g.DrawImage($img,[int]($x+(280-$w)/2),[int]$y,$w,$h)
    $g.DrawString("$($start+$j+1): $($file.Name.Substring(0,8))",$font,[System.Drawing.Brushes]::Black,[single]($x+8),[single]($y+273))
    $img.Dispose()
  }
  $canvas.Save((Join-Path (Get-Location) "preview-assets-$([int]($start/20)+1).jpg"),[System.Drawing.Imaging.ImageFormat]::Jpeg)
  $g.Dispose(); $font.Dispose(); $canvas.Dispose()
}
Write-Output "Indexed $($files.Count) images."
