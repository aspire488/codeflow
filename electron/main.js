const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Determine if we're in development or production
const isDev = !app.isPackaged;

// Global reference to the backend process
let backendProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#10141a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // Disable devtools in production
      devTools: isDev
    },
    show: false,
    title: 'CodeFlow'
  });

  // Show window when ready
  win.once('ready-to-show', () => {
    win.show();
    console.log('[Electron] Window ready');
  });

  // Load the app
  if (isDev) {
    win.loadURL('http://localhost:8080');
    // Open devtools in development
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'www', 'index.html'));
  }

  // Handle external links
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://www.onlinegdb.com')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Window events
  win.on('closed', () => {
    console.log('[Electron] Window closed');
  });

  return win;
}

function startBackend() {
  if (!isDev) {
    console.log('[Electron] Starting backend server...');
    const backendPath = path.join(__dirname, 'backend', 'server.py');
    
    if (fs.existsSync(backendPath)) {
      try {
        backendProcess = spawn('python', ['-m', 'uvicorn', 'server:app', '--port', '5000'], {
          cwd: path.join(__dirname, 'backend'),
          stdio: 'pipe'
        });
        
        backendProcess.stdout.on('data', (data) => {
          console.log('[Backend]', data.toString());
        });
        
        backendProcess.stderr.on('data', (data) => {
          console.error('[Backend Error]', data.toString());
        });
        
        backendProcess.on('close', (code) => {
          console.log('[Backend] Process exited with code:', code);
        });
        
        console.log('[Electron] Backend started');
      } catch (error) {
        console.error('[Electron] Failed to start backend:', error);
      }
    }
  }
}

function stopBackend() {
  if (backendProcess) {
    console.log('[Electron] Stopping backend...');
    backendProcess.kill();
    backendProcess = null;
  }
}

// App lifecycle
app.whenReady().then(() => {
  console.log('[Electron] App ready');
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  console.log('[Electron] All windows closed');
  stopBackend();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  console.log('[Electron] App quitting...');
  stopBackend();
});

// IPC handlers for frontend communication
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('open-external', (event, url) => {
  return shell.openExternal(url);
});

ipcMain.handle('is-dev', () => {
  return isDev;
});
