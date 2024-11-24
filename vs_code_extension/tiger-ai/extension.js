const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let messageCounter = 0; // 메시지 번호를 관리하는 변수

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('tiger-ai.start', async () => {
            const panel = vscode.window.createWebviewPanel(
                'tigerAI',
                'TigerAI',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                }
            );

        // HTML 파일 경로 설정
        const htmlPath = path.join(context.extensionPath, 'webview', 'index.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        // CSS 파일 경로 설정
        const styleUri = panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'webview', 'styles.css'))
        );

        // JavaScript 파일 경로 설정
        const scriptUri = panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'webview', 'script.js'))
        );

        // HTML에서 경로를 설정
        htmlContent = htmlContent
            .replace('./styles.css', styleUri.toString())
            .replace('./script.js', scriptUri.toString());

            panel.webview.html = htmlContent;

            // 메시지 처리
            panel.webview.onDidReceiveMessage(async (message) => {
                switch (message.command) {
                    case 'initialize':
                        panel.webview.postMessage({ command: 'display', text: 'Welcome to TigerAI!' });
                        break;
                    case 'userInput':
                        messageCounter++; // 메시지 번호 증가
                        const numberedResponse = `${messageCounter}: Response to "${message.text}"`;
                        panel.webview.postMessage({ command: 'display', text: numberedResponse });
                        break;
                    default:
                        panel.webview.postMessage({ command: 'error', text: 'Unknown command.' });
                }
            });
        })
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
