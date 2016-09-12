//const BrowserWindow = require('electron').remote.BrowserWindow
const ipc = require('electron').ipcRenderer

const path = require('path')

const sendEmailBtn = document.getElementById('btn-send-email');
const startBtn = document.getElementById('btn-start-invoicing');

  startBtn.addEventListener('click',function(e){
  		ipc.send('start-invoicing');
  })
// Tell main process to send the email when the send button is clicked
  sendEmailBtn.addEventListener('click', function (event) {
  //const modalPath = path.join('file://', __dirname, '../../sections/windows/modal.html')
  //let win = new BrowserWindow({ width: 400, height: 320 })
  //win.on('closed', function () { win = null })
  //win.loadURL(modalPath)
  //win.show()

  var options = 
  {
  	'from':document.getElementById('from').value,
  	'to':document.getElementById('to').value,
  	'subject':document.getElementById('subject').value,
  	'text':document.getElementById('text').value

  };
  
  ipc.send('send-email',options);

})


