const electron = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const ipc = electron.ipcMain
const shell = electron.shell

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const dialog = require('electron').dialog

const Menu = electron.Menu
let transport;
let mainWindow
let viewerWindow
let menu;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

function setupEmailing(){
    transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mr0.0nerd@gmail.com',
        pass: '0724022479'
      }
    });
  /*var transport = nodemailer.createTransport(smtpTransport({
   host: 'smtp.zoho.com',
   port: 587,
   auth: {
       user: 'ahmed@techiediaries.com',
       pass: 'jb395566'
   }
  }));  */

}

function sendEmail(options){
        const pdfPath = path.join(os.tmpdir(), 'print.pdf')
        var options = options || {};
        options.from = options.from || "support@techiediaries.com";
        transport.sendMail({
          from: options.from,
          to: options.to,
          subject: options.subject,
          html: '',
          text: options.text,  
          attachments: [{
              filename: 'invoice.pdf',
              path: pdfPath,
              contentType: 'application/pdf'
          }]
        }, function(err, responseStatus) {
          console.log('email sent ');
          if (err) {
            console.log(err);
          } else {
            console.log(responseStatus.message);
          }
        });  
}




function createViewerWindow () {
  // Create the browser window.
  viewerWindow = new BrowserWindow({
    frame: true,
    resizable: true,
    width: 900,
    height: 600
  });

  // and load the index.html of the app.
  viewerWindow.loadURL(`file://${__dirname}/viewer.html`)

  viewerWindow.on('closed', function () {
    viewerWindow = null
  })
}

function printPDF(){
  const pdfPath = path.join(os.tmpdir(), 'print.pdf')
  //const win = BrowserWindow.fromWebContents(event.sender)
  // Use default printing options
  mainWindow.webContents.printToPDF({}, function (error, data) {
    if (error) throw error
    fs.writeFile(pdfPath, data, function (error) {
      if (error) {
        throw error
      }
      shell.openItem(pdfPath)
      //event.sender.send('wrote-pdf', pdfPath)
      //createViewerWindow();

    })
    })  
}
function enableMenuItems()
{
  menu.items[2].submenu.items[3].enabled = true;
  menu.items[2].submenu.items[6].enabled = true;
      
}
function disbaleMenuItems(){
  menu.items[2].submenu.items[3].enabled = false;
  menu.items[2].submenu.items[6].enabled = false;

}

let template = [
{
  label:'File',
  submenu:[
  {
    'label':'New Invoice ...',
    'click':function(){
      //menu.items[2].submenu.items[3].enabled = true;
      //menu.items[2].submenu.items[6].enabled = true;
      menu.items[2].submenu.items[0].enabled = true;
      disbaleMenuItems();
      mainWindow.loadURL(`file://${__dirname}/index.html`)
    }
  },
  {
    type: 'separator'
  },
  {
    type: 'separator'
  },
  {
    type: 'separator'
  },
  {
      'label':'Close',
      'click':function(){
        app.quit();
      }
  }    
  ]
},
{
  label: 'Edit',
  submenu: [
  {
    label: 'Undo',
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }, {
    label: 'Redo',
    accelerator: 'Shift+CmdOrCtrl+Z',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }, {
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }, {
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }, {
    label: 'Select All',
    accelerator: 'CmdOrCtrl+A',
    role: 'selectall'
  }]

},
{
  label: 'Tools',

  submenu:[
    {'label':'Generate PDF','enabled':false,click:function(){
      printPDF();
      enableMenuItems();
    }},
    {
    type: 'separator'
    },
    {
      type: 'separator'
    },
    {'label':'Email..','enabled':false,click:function(){
      
      mainWindow.loadURL(`file://${__dirname}/emailer.html`);

      //sendEmail();
    }},
    {
      type: 'separator'
    },
    {
      type: 'separator'
    },
    {'label':'Save PDF As..','enabled':false,click:function(){
      savePDF();

    }},

    

  ]
},
{
  label: 'Help',
  submenu:[
    {'label':'About',    
      'click': function () {
        //electron.shell.openExternal('http://www.techiediaries.com')
        //openDlg();

        mainWindow.loadURL(`file://${__dirname}/splash.html`)
        menu.items[2].submenu.items[0].enabled = false;
        disbaleMenuItems();
    }},
    {
    type: 'separator'
    },
    {
      type: 'separator'
    },
    {

      'label': 'More Free Apps',
      click:function(){
        electron.shell.openExternal('http://www.techiediaries.com')
    }}
  
  ]
},

];
function savePDF(){
  var fs = require('fs');


  const options = {
    title: 'Save Invoice PDF',
    filters: [
      { name: 'PDF', extensions: ['pdf'] }
    ]
  }
  const pdfPath = path.join(os.tmpdir(), 'print.pdf')
  dialog.showSaveDialog(options, function (filename) {
    //event.sender.send('saved-file', filename)
    if (filename === undefined) return;
    fs.createReadStream(pdfPath).pipe(fs.createWriteStream(filename));
  })



}
function openDlg(){
  const options = {
    type: 'info',
    title: 'About InvoiceTOP',
    message: "InvoiceTOP by mrnerd.For more free apps visit http://apps.techiediaries.com",
    buttons: ['Ok']
  }
  dialog.showMessageBox(options, function (index) {
    //event.sender.send('information-dialog-selection', index)
  })
}

function createWindow () {
  // Create the browser window.
  var startTime = Date.now();
  mainWindow = new BrowserWindow({
    frame: true,
    resizable: false,
    width: 860,
    height: 600,
    show:false,
  });
   menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  setupEmailing();
  ipc.on('start-invoicing', function (event) {
    menu.items[2].submenu.items[0].enabled = true;

    mainWindow.loadURL(`file://${__dirname}/index.html`);
  })
  ipc.on('send-email', function (event,arg) {
  console.log(arg);
    sendEmail(arg);
  })
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/splash.html`)
  mainWindow.webContents.on('did-finish-load', function() {
    setTimeout(function(){
      mainWindow.show();
      console.error(Date.now() - startTime);  
    }, 40);
  });

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
