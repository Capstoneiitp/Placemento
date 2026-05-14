document.addEventListener('DOMContentLoaded', () => {

    const CHATBOT_API_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' || window.location.hostname === ''
        ? 'http://127.0.0.1:8000'
        : 'https://my-deployed-chatbot.com'; // TODO: Replace when deployed

    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.send-btn');

    // Add initial welcome message
    addMessage("Hello! I am your AI Placement Assistant. Ask me anything about your skills", 'bot');

    // Event listeners
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Add user message to UI
        addMessage(text, 'user');
        chatInput.value = '';

        // 2. Add loading state (to show bot is thinking)
        const loadingId = addMessage("Thinking...", 'bot', true);

        // 3. Send to backend
        fetchBackendResponse(text, loadingId);
    }

    function addMessage(text, sender, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const id = 'msg-' + Date.now();
        if (isLoading) messageDiv.id = id;

        const icon = sender === 'bot' ? '🤖' : 'U';

        // Prevent XSS by escaping user input, but allow Markdown HTML for the bot
        let formattedText = text;
        if (sender === 'bot' && typeof marked !== 'undefined') {
            formattedText = marked.parse(text);
        } else if (sender === 'user') {
            // Simple HTML escape function for user input
            formattedText = text.replace(/&/g, '&amp;')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;')
                                .replace(/"/g, '&quot;')
                                .replace(/'/g, '&#039;');
        }
        
        // Use innerHTML for both to allow markdown HTML rendering
        messageDiv.innerHTML = `
            <div class="message-icon">${icon}</div>
            <div class="message-bubble">${formattedText}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom

        return id;
    }

    function updateMessage(id, newText) {
        const msgDiv = document.getElementById(id);
        if (msgDiv) {
            const formattedText = typeof marked !== 'undefined' ? marked.parse(newText) : newText;
            msgDiv.querySelector('.message-bubble').innerHTML = formattedText;
        }
    }

    async function fetchBackendResponse(message, loadingId) {
        try {
            const analysisData = localStorage.getItem('placement_prediction_results') || "No analysis data available yet.";
            
            const response = await fetch(`${CHATBOT_API_BASE_URL}/api/chat/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: message,
                    analysis_data: analysisData 
                })
            });
            
            if (!response.ok) throw new Error("Server Error");
            
            const data = await response.json();
            
            // Check for API key error or other errors from backend
            if (data.error) {
                updateMessage(loadingId, "Error: " + data.error);
            } else {
                updateMessage(loadingId, data.reply);
            }

        } catch (error) {
            console.error("Error communicating with backend:", error);
            updateMessage(loadingId, "Sorry, I am having trouble connecting to the server. Please ensure the backend is running.");
        }
    }
});
