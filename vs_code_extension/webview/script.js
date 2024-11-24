const vscode = acquireVsCodeApi();

const output = document.getElementById('output');
const input = document.getElementById('input');
const sendButton = document.getElementById('send');

// 메시지 추가
function appendMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type === 'user' ? 'user-message' : 'ai-message');
    messageDiv.textContent = content;
    output.appendChild(messageDiv);
    output.scrollTop = output.scrollHeight;
}

// 초기화
vscode.postMessage({ command: 'initialize' });

// 메시지 수신 처리
window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.command === 'display') {
        appendMessage(message.text, message.type);
    }
});

// 메시지 전송
function sendMessage() {
    const userInput = input.value.trim();
    if (userInput) {
        appendMessage(userInput, 'user');
        vscode.postMessage({ command: 'userInput', text: userInput });
        input.value = '';
        resizeInput();
    }
}

// 입력창 크기 동적 조정
function resizeInput() {
    input.style.height = 'auto';
    input.style.height = `${input.scrollHeight}px`;
}

// 버튼 클릭 및 엔터키 처리
sendButton.addEventListener('click', sendMessage);
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    } else {
        resizeInput();
    }
});
