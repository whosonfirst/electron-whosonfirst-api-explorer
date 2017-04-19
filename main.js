const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const ipcMain = require('electron').ipcMain;

const path = require('path')
const url = require('url')

let mainWindow

// https://electron.atom.io/docs/api/dialog/

function createWindow () {

	mainWindow = new BrowserWindow({width: 1024, height: 600})
	
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))
	
	// mainWindow.webContents.openDevTools()
	
	mainWindow.on('closed', function () {
		mainWindow = null
	})

	let contents = mainWindow.webContents;

	/*
	contents.capturePage(function(r){
		console.log(r);
	});
	*/
	
	contents.on('did-finish-load', (event, arg) => {
		contents.send('asynchronous-reply', "DID FINISH LOAD");
	});

	contents.on('did-navigate-in-page', (event, arg) => {
		contents.send('asynchronous-reply', "DID NAVIGATE");
	});
	
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
})

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
    
ipcMain.on('asynchronous-message', (event, arg) => {

	/*
	if (arg == "ping"){
		event.sender.send('asynchronous-reply', mainWindow.webContents.canGoBack());
	}
	*/

	// https://electron.atom.io/docs/api/web-contents/#contentsprinttopdfoptions-callback
	
	if (arg == "print"){
		let contents = mainWindow.webContents;		
		contents.print();
	}
})
