const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

/**
 * API 키 파일 경로
 */
const getApiKeyPath = () => path.join(process.cwd(), 'chatgpt_history', 'api_key.json');

/**
 * 폴더 역할 파일 경로
 */
const getFolderRolesPath = () => path.join(process.cwd(), 'chatgpt_history', 'folder_roles.json');

/**
 * API 키 가져오기
 */
async function getApiKey() {
    const apiKeyPath = getApiKeyPath();

    if (fs.existsSync(apiKeyPath)) {
        const data = fs.readFileSync(apiKeyPath, 'utf-8');
        const parsed = JSON.parse(data);
        return parsed.apiKey || null;
    }
    return null;
}

/**
 * API 키 저장
 */
async function saveApiKey(apiKey) {
    const apiKeyPath = getApiKeyPath();
    const dir = path.dirname(apiKeyPath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(apiKeyPath, JSON.stringify({ apiKey }, null, 2));
}

/**
 * 폴더 역할 가져오기
 */
function getFolderRoles() {
    const folderRolesPath = getFolderRolesPath();

    if (fs.existsSync(folderRolesPath)) {
        const data = fs.readFileSync(folderRolesPath, 'utf-8');
        return JSON.parse(data);
    }
    return {};
}

/**
 * 폴더 역할 저장
 */
function saveFolderRoles(folderRoles) {
    const folderRolesPath = getFolderRolesPath();
    const dir = path.dirname(folderRolesPath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(folderRolesPath, JSON.stringify(folderRoles, null, 2));
}

/**
 * 폴더 역할 정의
 */
async function defineFolderRoles(rootPath) {
    const folders = fs
        .readdirSync(rootPath)
        .filter(
            (file) =>
                fs.statSync(path.join(rootPath, file)).isDirectory() &&
                !file.startsWith('.') &&
                file !== 'chatgpt_history'
        );

    const folderRoles = {};

    for (const folder of folders) {
        const role = await vscode.window.showInputBox({
            prompt: `Define the role for folder: ${folder}`,
        });
        if (role) {
            folderRoles[folder] = role;
        }
    }

    const folderRolesPath = getFolderRolesPath();
    if (!fs.existsSync(path.dirname(folderRolesPath))) {
        fs.mkdirSync(path.dirname(folderRolesPath), { recursive: true });
    }
    fs.writeFileSync(folderRolesPath, JSON.stringify(folderRoles, null, 2));

    return folderRoles;
}

/**
 * 설정 초기화
 */
function resetSettings() {
    const apiKeyPath = getApiKeyPath();
    const folderRolesPath = getFolderRolesPath();

    if (fs.existsSync(apiKeyPath)) fs.unlinkSync(apiKeyPath);
    if (fs.existsSync(folderRolesPath)) fs.unlinkSync(folderRolesPath);
}

module.exports = {
    getApiKey,
    saveApiKey,
    getFolderRoles,
    saveFolderRoles,
    defineFolderRoles,
    resetSettings,
};
