const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

const settings = require('electron-settings');

const ipcMain = require('electron').ipcMain;

const path = require('path')
const url = require('url')

/*

https://medium.com/@ccnokes/how-to-securely-store-sensitive-information-in-electron-with-node-keytar-51af99f1cfc4
https://github.com/atom/node-keytar
https://github.com/whosonfirst/electron-whosonfirst-api-explorer/issues/12

Sigh... (20170418/thisisaaronland)

Uncaught Error: The module
'electron-whosonfirst-api-explorer/node_modules/keytar/build/Release/keytar.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 51. This version of Node.js requires
NODE_MODULE_VERSION 53. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or`npm install`).

const keytar = require('keytar')	
api_key = keytar.getPassword("whosonfirst", "api_explorer")
*/

let mainWindow
let settingsWindow

function createMainWindow () {

	mainWindow = new BrowserWindow({width: 1024, height: 600})
	
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	mainWindow.webContents.openDevTools();
	
	mainWindow.on('closed', function (){
		mainWindow = null
	});
}

function createSettingsWindow () {

	if (settingsWindow){
		settingsWindow.show();
		return;
	}
	
	settingsWindow = new BrowserWindow({width: 1024, height: 600})
	
	settingsWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'settings.html'),
		protocol: 'file:',
		slashes: true
	}))

	settingsWindow.webContents.openDevTools();
	
	settingsWindow.on('closed', function (){
		settingsWindow = null
	});
}

app.on('ready', function(){

	createMainWindow();

	// https://pracucci.com/atom-electron-enable-copy-and-paste.html

	var name = app.getName();

	var about = "About " + name;
	var hide = "Hide " + name;
	var quit = "Quit " + name;
	
	var template = [
		{
			label: "Application",
			submenu: [
				{ label: about, selector: "orderFrontStandardAboutPanel:" },
				{ type: "separator" },
				{ label: hide, accelerator: "Command+H", click: function() { app.hide(); }},			
				{ label: quit, accelerator: "Command+Q", click: function() { app.quit(); }}
			]
		},
		{
			label: "Edit",
			submenu: [
				{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
				{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
				{ type: "separator" },
				{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
				{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
				{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
				{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
			]
		},
		{
			label: "Mapzen",
			submenu: [
				{ label: "Settings", accelerator: "Ctrl+M", click: function() { createSettingsWindow();	}},
			]
		},
		{
			label: "Developer",
			submenu: [
				{ label: "Developer Console", accelerator: "Command+D", click: function(){
					var win = BrowserWindow.getFocusedWindow();
					if (win){ win.webContents.openDevTools(); }}
				}
			]
		}
	];
	
	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});

app.on('window-all-closed', function (){
	
	if (process.platform !== 'darwin'){
		app.quit();
	}
})

app.on('activate', function (){
	
	if (mainWindow === null){
		createMainWindow();
	}
})

ipcMain.on('renderer', (event, arg) => {

	if (arg == "settings"){
		createSettingsWindow();
		return;
	}
	
	if (arg == "print"){

		// https://github.com/whosonfirst/electron-whosonfirst-api-explorer/issues/10	
		// https://electron.atom.io/docs/api/web-contents/#contentsprinttopdfoptions-callback
		
		let contents = mainWindow.webContents;

		contents.print();
		return;

		// basically all this to default to a PDF file but still only
		// "prints" a single page/viewport rather than all the content
		// (20170419/thisisaaronland)
		
		var opts = {
			marginsType: 0,
			printBackground: false,
			printSelectionOnly: false,
			landscape: false
		};

		var cb = function(err, buf){

			if (err){
				throw error;
			}

			const remote = require("electron");
			const fs = require("fs");			
			
			remote.dialog.showSaveDialog(BrowserWindow.getCurrentWindow, (filename) => {

				fs.writeFile(filename, buf, (error) => {
					
					if (error){
						throw error;
					}
				});
			});
		};
		
		contents.printToPDF(opts, cb);
	}
})
