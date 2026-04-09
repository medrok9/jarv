const chat = document.getElementById('chat');
const statusEl = document.getElementById('status');
const btn = document.getElementById('activate');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = 'en-US';

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  speechSynthesis.speak(u);
}

function addLine(who, text) {
  const div = document.createElement('div');
  div.textContent = who + ': ' + text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function handleCommand(text) {
  text = text.toLowerCase();

  if (text.includes('time')) {
    const t = new Date().toLocaleTimeString();
    speak('The time is ' + t);
    addLine('JARVIS', 'The time is ' + t);
    return;
  }

  if (text.includes('date') || text.includes('day')) {
    const d = new Date().toDateString();
    speak('Today is ' + d);
    addLine('JARVIS', 'Today is ' + d);
    return;
  }

  const mathMatch = text.match(/(what is|calculate)(.*)/);
  if (mathMatch) {
    try {
      const expr = mathMatch[2].replace(/[^0-9+\-*/().]/g, '');
      const result = Function('return ' + expr)();
      speak('The answer is ' + result);
      addLine('JARVIS', 'Answer: ' + result);
      return;
    } catch {
      speak('I could not calculate that.');
    }
  }

  speak('Command received.');
  addLine('JARVIS', 'Command received.');
}

recognition.onresult = (e) => {
  const text = e.results[e.results.length - 1][0].transcript.trim();
  addLine('You', text);

  if (text.toLowerCase().startsWith('hey jarvis') || text.toLowerCase().startsWith('hey jarvas')) {
    const cmd = text.replace(/hey jarvis|hey jarvas/i, '').trim();
    speak('Yes?');
    if (cmd) handleCommand(cmd);
  }
};

btn.onclick = () => {
  recognition.start();
  statusEl.textContent = 'Listening...';
  speak('Jarvis online.');
};
