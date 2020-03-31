const electron = require('electron');
const url = require('url');
const path = require('path');
//const customTitlebar = require('custom-electron-titlebar');
const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let createProjectWindow;

app.on('ready',function(){
	mainWindow = new BrowserWindow({
		//frame: false,
		webPreferences: {
			nodeIntegration: true
		}
	});
	//load html into window
	mainWindow.loadURL(url.format({ //looks like file://dirname//mainWindow.html
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	
	//menu
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);

	//close all open windows when closed
	mainWindow.on('closed', function(){
		app.quit()
	})
});


//Handle new project
function createNewProjectWindow() {
	newProjectWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		width: 300,
		height: 200,
		title: 'New Project',
		frame: false
	});

	newProjectWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'newProjectWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	
	//dispose
	newProjectWindow.on('close',function(){
		newProjectWindow = null;
	})
}

function createLanguageOptionsWindow() {
	languageOptionsWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
	});

}

//menu template
const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Open Project'
			},
			{
				label: 'New Project',
				click() {
					createNewProjectWindow();
				}
			},
			{
				label: 'Save Project'
			},
			{
				label: 'Quit',
				accelerator: 'CommandOrControl+Q',
				click() {
					app.quit();
				}
			}
		]
	}
];

//situational menu bar adjustments
if (process.platform == 'darwin') { mainMenuTemplate.unshift({}); } //offset menu if on mac
if (process.env.NODE_ENV != 'production') { //developer tools
	mainMenuTemplate.push({ 
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle DevTools',
				accelerator: 'CommandOrControl+Shift+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}