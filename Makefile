styleguide:	
	curl -s -o css/mapzen.styleguide.css https://mapzen.com/common/styleguide/styles/styleguide.css
	curl -s -o javascript/mapzen.styleguide.min.js https://mapzen.com/common/styleguide/scripts/mapzen-styleguide.min.js

localforage:
	curl -s -o javascript/localforage.js https://raw.githubusercontent.com/localForage/localForage/master/dist/localforage.js
	curl -s -o javascript/localforage.min.js https://raw.githubusercontent.com/localForage/localForage/master/dist/localforage.min.js

app_icons: icns
	cp images/icons/icon_64x64.png app_icon.png

icns:
	sips -z 16 16 images/icon.png --out images/icon.iconset/icon_16x16.png
	sips -z 16 16 images/icon.png --out images/icon.iconset/icon_16x16.png
	sips -z 32 32 images/icon.png --out images/icon.iconset/icon_16x16@2x.png
	sips -z 32 32 images/icon.png --out images/icon.iconset/icon_32x32.png
	sips -z 64 64 images/icon.png --out images/icon.iconset/icon_32x32@2x.png
	sips -z 64 64 images/icon.png --out images/icon.iconset/icon_64x64.png
	sips -z 128 128 images/icon.png --out images/icon.iconset/icon_128x128.png
	sips -z 256 256 images/icon.png --out images/icon.iconset/icon_128x128@2x.png
	sips -z 256 256 images/icon.png --out images/icon.iconset/icon_256x256.png
	sips -z 512 512 images/icon.png --out images/icon.iconset/icon_256x256@2x.png
	sips -z 512 512 images/icon.png --out images/icon.iconset/icon_512x512.png
	cp images/icon.png images/icon.iconset/icon_512x512@2x.png
	iconutil --convert icns --output app_icon.icns images/icon.iconset
