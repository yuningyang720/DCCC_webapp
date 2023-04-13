
sizes=("16x16" "20x20" "29x29" "32x32" "36x36" "38x38" "40x40" "44x44" "48x48" "50x50" "55x55" "58x58" "57x57" "60x60"
 "70x70" "72x72" "76x76" "80x80" "87x87" "88x88" "96x96" "100x100" "114x114" "120x120" "144x144" "150x150" "152x152"
  "167x167" "172x172" "180x180" "192x192" "196x196" "216x216" "310x310" "512x512" "1024x1024")

flat_sizes=("1024x1024")

ios_splash_sizes=("320x480" "640x960" "640x1136" "750x1334" "1242x2208" "768x1024" "1536x2048")
android_splash_sizes=("200x320" "320x480" "480x800" "720x1280" "960x1600" "1280x1920")

for size in "${sizes[@]}"
do
  convert $1 -resize $size "src/assets/img/icons/logo-$size.png"
done

for size in "${flat_sizes[@]}"
do
  convert $1 -resize $size  -background $2 -flatten "src/assets/img/icons/logo-$size-flat.png"
done



for size in "${ios_splash_sizes[@]}"
do
  logo_width=$(( $(sed "s/x\(.*\)//" <<<$size) / 2 ))
  convert $1 -resize $logo_width -background $2 -gravity center -extent $size "graphics/screen/ios/splash-$size.png"
done

for size in "${android_splash_sizes[@]}"
do
  logo_width=$(( $(sed "s/x\(.*\)//" <<<$size) / 2 ))
  convert $1 -resize $logo_width -background $2 -gravity center -extent $size "graphics/screen/android/splash-$size.png"
done
