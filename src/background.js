'use strict'

// import {app, protocol, BrowserWindow, ipcMain, nativeTheme} from 'electron'

import {app, protocol, BrowserWindow} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        center: true,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
        }
    })
    
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
    
    
    // ipcMain.on('dark-mode:toggle', () => {
    //     if (nativeTheme.shouldUseDarkColors) {
    //         nativeTheme.themeSource = 'light'
    //     } else {
    //         nativeTheme.themeSource = 'dark'
    //     }
    //     return nativeTheme.shouldUseDarkColors
    // })
    //
    // ipcMain.on('dark-mode:system', () => {
    //     nativeTheme.themeSource = 'system'
    // })
}

app.allowRendererProcessReuse = false

let myWindow = null;
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', () => {
        // Someone tried to run a second instance, we should focus our window.
        if (myWindow) {
            if (myWindow.isMinimized()) myWindow.restore()
            myWindow.focus()
        }
    })
    
    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On macOS it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })
    
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
    app.on('ready', async () => {
        if (isDevelopment && !process.env.IS_TEST) {
            // Install Vue Devtools
            try {
                await installExtension(VUEJS_DEVTOOLS)
            } catch (e) {
                console.error('Vue Devtools failed to install:', e.toString())
            }
        }
        // мб удалить await
        createWindow();
    })
    
    app.on('new-window', function (event, url) {
        event.preventDefault();
        open(url);
    });

// Exit cleanly on request from parent process in development mode.
    if (isDevelopment) {
        if (process.platform === 'win32') {
            process.on('message', (data) => {
                if (data === 'graceful-exit') {
                    app.quit()
                }
            })
        } else {
            process.on('SIGTERM', () => {
                app.quit()
            })
        }
    }
}

// nodejs 12.8.3


//    "forge": {
//       "packagerConfig": {},
//       "publishers": [
//         {
//           "name": "@electron-forge/publisher-github",
//           "config": {
//             "repository": {
//               "owner": "JohnDorian00",
//               "name": "uchet"
//             },
//             "authToken": "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"
//           }
//         }
//       ]
//     }
