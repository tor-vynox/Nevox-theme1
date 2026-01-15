// Speech Synthesis Setup
const synth = window.speechSynthesis;
let currentUtterance = null;
let isPaused = false;

// DOM Elements
const textInput = document.getElementById('textInput');
const voiceSelect = document.getElementById('voiceSelect');
const rate = document.getElementById('rate');
const pitch = document.getElementById('pitch');
const volume = document.getElementById('volume');
const rateValue = document.getElementById('rateValue');
const pitchValue = document.getElementById('pitchValue');
const volumeValue = document.getElementById('volumeValue');
const speakBtn = document.getElementById('speakBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const charCount = document.getElementById('charCount');
const statusMessage = document.getElementById('statusMessage');
const progressBar = document.getElementById('progressBar');
const sampleBtns = document.querySelectorAll('.sample-btn');

// Initialize voices
let voices = [];

function loadVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = '';
    
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
    
    // Set default voice (try to find English)
    const defaultVoiceIndex = voices.findIndex(voice => 
        voice.lang.startsWith('en') || voice.default
    );
    if (defaultVoiceIndex !== -1) {
        voiceSelect.value = defaultVoiceIndex;
    }
}

// Character counter
textInput.addEventListener('input', function() {
    charCount.textContent = this.value.length;
    if (this.value.length > 5000) {
        charCount.style.color = '#dc3545';
    } else if (this.value.length > 3000) {
        charCount.style.color = '#ffc107';
    } else {
        charCount.style.color = '#28a745';
    }
});

// Initialize character count
charCount.textContent = textInput.value.length;

// Update slider values
rate.addEventListener('input', () => {
    rateValue.textContent = rate.value;
});

pitch.addEventListener('input', () => {
    pitchValue.textContent = pitch.value;
});

volume.addEventListener('input', () => {
    volumeValue.textContent = volume.value;
});

// Speak function
function speakText() {
    if (synth.speaking) {
        synth.cancel();
        return;
    }

    if (textInput.value.trim() === '') {
        updateStatus("Please enter some text first", "error");
        return;
    }

    const selectedVoiceIndex = voiceSelect.value;
    if (selectedVoiceIndex === '') {
        updateStatus("Please select a voice", "error");
        return;
    }

    currentUtterance = new SpeechSynthesisUtterance(textInput.value);
    currentUtterance.voice = voices[selectedVoiceIndex];
    currentUtterance.rate = parseFloat(rate.value);
    currentUtterance.pitch = parseFloat(pitch.value);
    currentUtterance.volume = parseFloat(volume.value);

    // Events for current utterance
    currentUtterance.onstart = function() {
        updateStatus("Speaking...", "speaking");
        toggleButtons(true);
        isPaused = false;
        updateProgress(true);
    };

    currentUtterance.onend = function() {
        updateStatus("Finished speaking", "success");
        toggleButtons(false);
        updateProgress(false);
        currentUtterance = null;
    };

    currentUtterance.onerror = function(event) {
        updateStatus("Error occurred while speaking", "error");
        toggleButtons(false);
        updateProgress(false);
        currentUtterance = null;
    };

    synth.speak(currentUtterance);
    updateStatus("Started speaking", "speaking");
}

// Update progress bar
function updateProgress(isSpeaking) {
    if (isSpeaking) {
        progressBar.style.width = '100%';
        // Simulate progress (in a real app, you'd calculate based on text length)
        let progress = 0;
        const interval = setInterval(() => {
            if (!synth.speaking || isPaused) {
                clearInterval(interval);
                return;
            }
            progress += 0.5;
            progressBar.style.width = Math.min(progress, 100) + '%';
        }, 100);
    } else {
        progressBar.style.width = '0%';
    }
}

// Update status message
function updateStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.style.color = 
        type === 'error' ? '#dc3545' : 
        type === 'success' ? '#28a745' : 
        type === 'speaking' ? '#2575fc' : '#333';
}

// Toggle buttons state
function toggleButtons(isSpeaking) {
    speakBtn.disabled = isSpeaking;
    pauseBtn.disabled = !isSpeaking || isPaused;
    resumeBtn.disabled = !isSpeaking || !isPaused;
    stopBtn.disabled = !isSpeaking;
}

// Pause speech
function pauseSpeech() {
    if (synth.speaking && !isPaused) {
        synth.pause();
        isPaused = true;
        updateStatus("Paused", "warning");
        toggleButtons(true);
    }
}

// Resume speech
function resumeSpeech() {
    if (synth.speaking && isPaused) {
        synth.resume();
        isPaused = false;
        updateStatus("Resumed speaking", "speaking");
        toggleButtons(true);
    }
}

// Stop speech
function stopSpeech() {
    if (synth.speaking) {
        synth.cancel();
        updateStatus("Stopped", "error");
        toggleButtons(false);
        updateProgress(false);
        isPaused = false;
        currentUtterance = null;
    }
}

// Clear text
function clearText() {
    textInput.value = '';
    charCount.textContent = '0';
    charCount.style.color = '#28a745';
    updateStatus("Text cleared", "success");
}

// Event Listeners
speakBtn.addEventListener('click', speakText);
pauseBtn.addEventListener('click', pauseSpeech);
resumeBtn.addEventListener('click', resumeSpeech);
stopBtn.addEventListener('click', stopSpeech);
clearBtn.addEventListener('click', clearText);

// Sample text buttons
sampleBtns.forEach(button => {
    button.addEventListener('click', function() {
        textInput.value = this.getAttribute('data-text');
        charCount.textContent = textInput.value.length;
        updateStatus("Sample text loaded", "success");
    });
});

// Load voices when they become available
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}

// Also try to load voices immediately
loadVoices();

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl+Enter to speak
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        speakText();
    }
    
    // Escape to stop
    if (event.key === 'Escape' && synth.speaking) {
        stopSpeech();
    }
});

// Initialize button states
toggleButtons(false);
