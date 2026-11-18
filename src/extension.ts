import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('tyrell-love.applyWallpaper', async () => {
        // Use vscode.env.appRoot to reliably locate VS Code's internal workbench CSS
        const cssPath = path.join(vscode.env.appRoot, 'out', 'vs', 'workbench', 'workbench.desktop.main.css');

        let imageFilePath = path.join(context.extensionPath, 'media', 'wallpaper.png');
        let mimeType = 'image/png';

        if (!fs.existsSync(imageFilePath)) {
            imageFilePath = path.join(context.extensionPath, 'media', 'wallpaper.png.jpg');
            mimeType = 'image/jpeg';
        }

        if (!fs.existsSync(imageFilePath)) {
            vscode.window.showErrorMessage(`Wallpaper image not found in media folder!`);
            return;
        }

        const imageBase64 = fs.readFileSync(imageFilePath, { encoding: 'base64' });
        const imageDataUri = `data:${mimeType};base64,${imageBase64}`;

        const wallpaperCSS = `
        /* VS Code Custom Extension Wallpaper */
        body {
            background-image: linear-gradient(135deg, rgba(8,15,18,0.72), rgba(4,8,10,0.82)), url('${imageDataUri}') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }
        .monaco-editor, .monaco-editor .margin, .monaco-editor-background {
            background: rgba(0, 0, 0, 0.4) !important;
        }
        .sidebar, .activitybar, .titlebar {
            background-color: rgba(6, 11, 14, 0.6) !important;
        }
        `;

        try {
            if (fs.existsSync(cssPath)) {
                let cssContent = fs.readFileSync(cssPath, 'utf8');

                if (!cssContent.includes('VS Code Custom Extension Wallpaper')) {
                    fs.appendFileSync(cssPath, wallpaperCSS, 'utf8');
                    vscode.window.showInformationMessage('Wallpaper applied! Fully close and reopen VS Code to see it.');
                } else {
                    vscode.window.showInformationMessage('Wallpaper is already applied!');
                }
            } else {
                vscode.window.showErrorMessage(`Could not locate CSS at: ${cssPath}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage('Permission denied: Close VS Code, right-click VS Code -> Run as administrator, and try again.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}