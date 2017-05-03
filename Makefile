styleguide:	
	curl -s -o css/mapzen.styleguide.css https://mapzen.com/common/styleguide/styles/styleguide.css
	curl -s -o javascript/mapzen.styleguide.min.js https://mapzen.com/common/styleguide/scripts/mapzen-styleguide.min.js

localforage:
	curl -s -o javascript/localforage.js https://raw.githubusercontent.com/localForage/localForage/master/dist/localforage.js
	curl -s -o javascript/localforage.min.js https://raw.githubusercontent.com/localForage/localForage/master/dist/localforage.min.js

icons: icns
	cp app_icon.iconset/icon_64x64.png app_icon.png

icns:
	if test ! -d app_icon.iconset; then mkdir app_icon.iconset; fi
	rm -f app_icon.iconset/*.png
	sips -z 16 16 app_icon/app_icon.png --out app_icon.iconset/icon_16x16.png
	sips -z 16 16 app_icon/app_icon.png --out app_icon.iconset/icon_16x16.png
	sips -z 32 32 app_icon/app_icon.png --out app_icon.iconset/icon_16x16@2x.png
	sips -z 32 32 app_icon/app_icon.png --out app_icon.iconset/icon_32x32.png
	sips -z 64 64 app_icon/app_icon.png --out app_icon.iconset/icon_32x32@2x.png
	sips -z 64 64 app_icon/app_icon.png --out app_icon.iconset/icon_64x64.png
	sips -z 128 128 app_icon/app_icon.png --out app_icon.iconset/icon_128x128.png
	sips -z 256 256 app_icon/app_icon.png --out app_icon.iconset/icon_128x128@2x.png
	sips -z 256 256 app_icon/app_icon.png --out app_icon.iconset/icon_256x256.png
	sips -z 512 512 app_icon/app_icon.png --out app_icon.iconset/icon_256x256@2x.png
	sips -z 512 512 app_icon/app_icon.png --out app_icon.iconset/icon_512x512.png
	cp app_icon/app_icon.png app_icon.iconset/icon_512x512@2x.png
	iconutil --convert icns --output app_icon.icns app_icon.iconset

osx:
	electron-packager ./ "APIExplorer" --icon="app_icon" --overwrite --prune

package: icons osx
