const electronInstaller = require("electron-winstaller");

(async () => {
    try {
        await electronInstaller.createWindowsInstaller({
            appDirectory: 'C:/Users/remai/Documents/GitHub/uchet',
            outputDirectory: 'C:/Users/remai/Documents/GitHub/uchet/out',
            authors: 'My App Inc.',
            exe: 'myapp.exe'
        });
        console.log('It worked!');
    } catch (e) {
        console.log(`No dice: ${e.message}`);
    }
})();