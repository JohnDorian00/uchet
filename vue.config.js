module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            nodeVersion: "14.16.1",
            builderOptions: {
                "productName": "uchet",
                "win": {
                    "target": [
                        "portable"
                    ]
                },
                "portable": {
                    "artifactName": "uchet.exe"
                },
                "directories": {
                    "output": "build"
                },
                "nodeVersion": "14.16.1"
            }
        }
    }
}
