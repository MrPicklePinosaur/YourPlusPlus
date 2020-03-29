const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

let mainWindow;

app.on('ready',function(){
	//create a new window
	mainWindow = new BrowserWindow({});
	//load html into window
	mainWindow.loadURL(url.format({ //looks like file://dirname//mainWindow.html
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
});