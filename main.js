const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

//listen for app to be ready
app.on('ready', function(){
    
    //create new Window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    
    // load html file to window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true, 
    }))
    

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

    Menu.setApplicationMenu(mainMenu)

    mainWindow.on('closed', function(){
        app.quit()
    })

    // mainWindow.setMenu(null) //set menu to nothing
})

//Handle create add new window
function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 400,
        height: 200,
        title: 'Add new item',
        webPreferences: {
            nodeIntegration: true
        }
    });

    // load html file to window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    // addWindow.setMenu(null)

    addWindow.on('close', function(){
        addWindow = null
    })
}

function clearItems(){

}

//Catch item:add
ipcMain.on('item:add', function(e, item){
	// console.log(": item", item)
    mainWindow.webContents.send('item:add', item)
    addWindow.close()
})

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add item',
                accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
                click(){
                    createAddWindow()
                }
            },
            {
                label: 'Clear item',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    }
]

if (process.platform == 'darwin'){
    mainMenuTemplate.unshift({})
}

if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push(
        {
            label: 'Developer Tools',
            submenu: [
                {
                    label: 'Toggle DevTools',
                    accelerator: process.platform == 'darwin' ? 'Command+Shift+I' : 'Ctrl+Shift+I',
                    click(item, focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
            ]
        }
    )
}