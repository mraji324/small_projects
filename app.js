const messagesDiv = document.getElementById('messages');
const inputForm = document.getElementById('input-form');
const userInput = document.getElementById('user-input');

const database = firebase.database();
const chatRef = database.ref('chatMessages');

// Function to add message to chat display
function addMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
  messageDiv.textContent = message;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Listen for new chat messages from Firebase
chatRef.on('child_added', (snapshot) => {
  const data = snapshot.val();
  addMessage(data.message, data.sender);
});

// Handle user input submission
inputForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (message === '') return;

  // Save user message to Firebase
  chatRef.push({ message, sender: 'user' });

  // Clear input field
  userInput.value = '';

  // Simple bot response (echo)
  const botMessage = "You said: " + message;
  chatRef.push({ message: botMessage, sender: 'bot' });
});