// Copyright (c) The LHTML team
// See LICENSE for details.

const {app, BrowserWindow,Tray, Menu, protocol, ipcMain} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
var path=require('path');
//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

//-------------------------------------------------------------------
// Define the menu
//
// THIS SECTION IS NOT REQUIRED
//-------------------------------------------------------------------
let template = []
const appId = 'electron-windows-notifications'
const {ToastNotification} = require('electron-windows-notifications')
let imagePath = __dirname+'/tray_icons.png';


//-------------------------------------------------------------------
// Open a window that displays the version
//
// THIS SECTION IS NOT REQUIRED
//
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click "About" to see
// that updates are working.
//-------------------------------------------------------------------
let win;


ipcMain.on('asdty',(event, arg) => {

   var notification = new ToastNotification({
    appId: appId,
    template: `<toast><visual><binding template="ToastImageAndText02"><image id="1" src="%s"/><text id="1">%s</text><text id="2">%s</text></binding></visual></toast>`,
    strings: [imagePath,'Electron-Demo',arg]
})

notification.on('activated', () => console.log('Activated!'))
notification.show()

})


function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}


function createDefaultWindow() {
win = new BrowserWindow({icon: __dirname + '/icon.ico'});
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return win;
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
	
		var notification = new ToastNotification({
    appId: appId,
    template: `<toast><visual><binding template="ToastImageAndText02"><image id="1" src="%s"/><text id="1">%s</text><text id="2">%s</text></binding></visual></toast>`,
    strings: [imagePath,'Electron-Demo','Update available.']
})
	
	notification.on('activated', () => console.log('Activated!'))
notification.show()
	
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (ev, info) => {
	
		var notification = new ToastNotification({
    appId: appId,
    template: `<toast><visual><binding template="ToastImageAndText02"><image id="1" src="%s"/><text id="1">%s</text><text id="2">%s</text></binding></visual></toast>`,
    strings: [imagePath,'Electron-Demo','Update not available.']
})
	
	notification.on('activated', () => console.log('Activated!'))
notification.show()
	
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (ev, err) => {
	if(ev){
	  sendStatusToWindow('edo ev anta.',ev);	
	}
  sendStatusToWindow('Error in auto-updater.',err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  win.setProgressBar(progressObj.bytesPerSecond);
})
autoUpdater.on('update-downloaded', (ev, info) => {

		var notification = new ToastNotification({
    appId: appId,
    template: `<toast><visual><binding template="ToastImageAndText02"><image id="1" src="%s"/><text id="1">%s</text><text id="2">%s</text></binding></visual></toast>`,
    strings: [imagePath,'Electron-Demo','Update downloaded; will install in 5 seconds']
})
	
	notification.on('activated', () => console.log('Activated!'))
notification.show()
	
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
});


app.on('ready', function() {
		console.log('app starts');
	const isDev = require('electron-is-dev');

if (isDev) {
	console.log('Running in development');
	
	const menu = Menu.buildFromTemplate([
    {label: 'Check for Updates', click: function() {
	console.log('Running in production');
	  autoUpdater.checkForUpdates(); 
	}},
    {label: 'Help', click: function() { 
	let child = new BrowserWindow()
child.loadURL('http://www.miraclesoft.com/')
child.once('ready-to-show', () => {
  child.show()
})
	}},
	{label:'Quit', role:'quit', click:function(){
		app.quit();
	}}
  ])
  
		  path=__dirname+'/tray_icons.png';
  appIcon = new Tray(path)
  appIcon.setToolTip('Electron Demo in the tray.');

  appIcon.setContextMenu(menu)

   createDefaultWindow();
   
   sendStatusToWindow(imagePath);
	
} else {
	console.log('Running in production');
	// Create the Menu
  const menu = Menu.buildFromTemplate([
    {label: 'Check for Updates', click: function() {
	console.log('Running in production');
	  autoUpdater.checkForUpdates(); 
	}},
    {label: 'Help', click: function() { 
	let child = new BrowserWindow()
child.loadURL('http://www.miraclesoft.com/')
child.once('ready-to-show', () => {
  child.show()
})
	}},
	{label:'Quit', role:'quit', click:function(){
		app.quit();
	}}
  ])
  
		  path=__dirname+'/tray_icons.png';
  appIcon = new Tray(path)
  appIcon.setToolTip('Electron Demo in the tray.');

  appIcon.setContextMenu(menu)

   createDefaultWindow();
   
   sendStatusToWindow(imagePath);
  
}
});
app.on('window-all-closed', () => {
  app.quit();
});

//-------------------------------------------------------------------
// Auto updates
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (ev, info) => {
// })
// autoUpdater.on('update-not-available', (ev, info) => {
// })
// autoUpdater.on('error', (ev, err) => {
// })
// autoUpdater.on('download-progress', (ev, progressObj) => {
// })
autoUpdater.on('update-downloaded', (ev, info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 5000)
})

app.on('ready', function()  {

});
