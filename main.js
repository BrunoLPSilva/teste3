// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')

const { autoUpdater } = require('electron-updater');

const path = require('path')

let mainWindow;

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('src/views/login.html')


  mainWindow.once('ready-to-show', () => {
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'BrunoLPSilva',
      repo: 'soli-restaurante-desktop',
      token: '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',
    });
    autoUpdater.checkForUpdatesAndNotify();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('get-printers', async (event, args) => {
  let list = await mainWindow.webContents.getPrintersAsync();
  console.log(list);

  mainWindow.webContents.send('receber-impressoras', list);
});

ipcMain.handle('imprimir', async (event, args) => {
  console.log(args);
  const ticket = new BrowserWindow({
    width: 300,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  });




  ticket.loadFile('src/views/ticket.html')
    .then(() => {

      ticket.webContents.send('enviar-pedido', args);

      const impressora = args.impressora;

      var options = {
        silent: true,
        deviceName: impressora,
        printBackground: true,
        color: false,
        margin: {
          marginType: 'printableArea'
        },
        landscape: false,
        pagesPerSheet: 1,
        collate: false,
        copies: 1,
        /*pageSize: { height: 600, width: 353 }*/
      }

      ticket.webContents.print(options, (success, failureReason) => {
        if (!success) {
          console.log(failureReason);
        }

        console.log('Print Initiated');

        // setTimeout(() => {
        //   ticket.close();
        // }, 3000);

      });
    });



});

ipcMain.handle('impressao', async (event, args) => {
  console.log(args);
  const ticket = new BrowserWindow({
    width: 300,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  });

  const impressora = args.impressora;

  ticket.loadFile('src/views/ticketEntregador.html')
    .then(() => {

      ticket.webContents.send('enviar-pedido', args);
      var options = {
        silent: true,
        deviceName: impressora,
        printBackground: true,
        color: false,
        margin: {
          marginType: 'printableArea'
        },
        landscape: false,
        pagesPerSheet: 1,
        collate: false,
        copies: 1,
        pageSize: { height: 600, width: 353 }
      }

      ticket.webContents.print(options, (success, failureReason) => {
        if (!success) {
          console.log(failureReason);
        }

        console.log('Print Initiated');

        // setTimeout(() => {
        //   ticket.close();
        // }, 3000);

      });
    });



});

ipcMain.handle('imprimir-fechamento-caixa', async (event, args) => {
  console.log(args);
  const ticket = new BrowserWindow({
    width: 300,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  });


  const impressora = args.impressora;

  ticket.loadFile('src/views/fechamentoTicket.html')
    .then(() => {

      ticket.webContents.send('imprimir-fechamento', args);

      var options = {
        silent: true,
        deviceName: impressora,
        printBackground: true,
        color: false,
        margin: {
          marginType: 'printableArea'
        },
        landscape: false,
        pagesPerSheet: 1,
        collate: false,
        copies: 1,
        /*pageSize: { height: 600, width: 353 }*/
      }

      ticket.webContents.print(options, (success, failureReason) => {
        if (!success) {
          console.log(failureReason);
        }

        console.log('Print Initiated');

        // setTimeout(() => {
        //   ticket.close();
        // }, 3000);

      });
    });



});

autoUpdater.on('update-available', () => {
  //mainWindow.webContents.send('update_available');
  console.log('atualizando');
});

autoUpdater.on('update-downloaded', () => {
  //mainWindow.webContents.send('update_downloaded');

  autoUpdater.quitAndInstall();
});