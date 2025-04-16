/**
 * script.js
 * Handles dynamic content for the Minimalist Live New Tab extension.
 * - Sets a random background video.
 * - Displays and updates the current time.
 * - Displays a time-appropriate greeting.
 */

// --- Configuration ---

// ** IMPORTANT: Replace these paths with the actual relative paths to YOUR video files **
// Place your video files inside a 'videos' subfolder within your extension's directory.
const videoList = [
    'videos/a.mp4',
    'videos/b.mp4',
    'videos/c.mp4',
    'videos/d.mp4'
];

// --- DOM Elements ---

// Get references to the HTML elements we need to interact with.
const videoSourceElement = document.getElementById('video-source');
const videoElement = document.getElementById('background-video');
const clockElement = document.getElementById('clock');
const greetingElement = document.getElementById('greeting');

// Add clock format preference to the top with other variables
let is24HourFormat = true;

// --- Core Functions ---

/**
 * Selects a random video from the videoList and sets it as the background.
 */
function setRandomBackgroundVideo() {
    // Basic error checking to ensure elements exist
    if (!videoSourceElement || !videoElement) {
        console.error("Error: Could not find video or source element in the HTML.");
        return;
    }
    if (videoList.length === 0) {
        console.warn("Video list is empty. Add video paths to the 'videoList' array in script.js.");
        // Optional: Set a default background color or image here
        return;
    }

    // Select a random index from the videoList array
    const randomIndex = Math.floor(Math.random() * videoList.length);
    const randomVideoPath = videoList[randomIndex];

    console.log("Selected video:", randomVideoPath); // Log selected video for debugging

    // Set the 'src' attribute of the <source> element
    videoSourceElement.setAttribute('src', randomVideoPath);

    // Attempt to automatically set the 'type' attribute based on file extension
    // This helps the browser load the video more efficiently.
    const fileExtension = randomVideoPath.split('.').pop().toLowerCase();
    if (fileExtension === 'webm') {
         videoSourceElement.setAttribute('type', 'video/webm');
    } else if (fileExtension === 'mp4') {
         videoSourceElement.setAttribute('type', 'video/mp4');
    } else {
        // Add more types if needed (e.g., 'ogv' for Ogg)
        console.warn("Unknown video type for:", randomVideoPath, "- Browser will attempt to infer type.");
        // Clear type attribute if unsure, let browser handle it
        videoSourceElement.removeAttribute('type');
    }

    // **Crucial:** Tell the <video> element to load the new source.
    videoElement.load();

    // Add preload attribute to the video element for smoother playback
    videoElement.setAttribute('preload', 'auto');

    // Add a loop attribute to the video element to enable looping
    videoElement.setAttribute('loop', 'true');

    // Use requestAnimationFrame for smoother rendering
    function smoothPlayVideo() {
        videoElement.play().catch(error => {
            console.log("Video play() promise rejected:", error);
        });
    }

    // Call smoothPlayVideo using requestAnimationFrame
    requestAnimationFrame(smoothPlayVideo);
}

/**
 * Updates the clock element with the current time (HH:MM format).
 */
function updateClock() {
    if (!clockElement) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    if (!is24HourFormat) {
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        clockElement.textContent = `${hours}:${minutes} ${period}`;
    } else {
        hours = String(hours).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}`;
    }
}

/**
 * Updates the greeting element based on the current time of day.
 */
function updateGreeting() {
    if (!greetingElement) return; // Exit if greeting element not found

    const hour = new Date().getHours(); // Get the current hour (0-23)
    let greeting;

    // Determine the appropriate greeting
    if (hour < 12) { // Before noon
        greeting = 'Good morning.';
    } else if (hour < 18) { // Between noon and 6 PM
        greeting = 'Good afternoon.';
    } else { // 6 PM onwards
        greeting = 'Good evening.';
    }

    // Update the text content of the greeting element
    greetingElement.textContent = greeting;
}

// Function to detect the dominant color of the video and adjust clock color
function adjustClockColorBasedOnVideo() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        console.error('Canvas context not available.');
        return;
    }

    canvas.width = 100; // Small size for performance
    canvas.height = 100;

    function updateClockColor() {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r = 0, g = 0, b = 0;
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];     // Red
            g += data[i + 1]; // Green
            b += data[i + 2]; // Blue
        }

        const pixelCount = data.length / 4;
        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);

        // Calculate brightness using the luminance formula
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

        // Set clock color to white for dark backgrounds and black for bright backgrounds
        clockElement.style.color = brightness < 128 ? 'white' : 'black';

        requestAnimationFrame(updateClockColor);
    }

    updateClockColor();
}

// Adjust greeting color based on video brightness
function updateGreetingColor() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        console.error('Canvas context not available.');
        return;
    }

    canvas.width = 100; // Small size for performance
    canvas.height = 100;

    function adjustColor() {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r = 0, g = 0, b = 0;
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];     // Red
            g += data[i + 1]; // Green
            b += data[i + 2]; // Blue
        }

        const pixelCount = data.length / 4;
        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);

        // Calculate brightness using the luminance formula
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

        // Set greeting color to white for dark backgrounds and black for bright backgrounds
        greetingElement.style.color = brightness < 128 ? 'white' : 'black';

        requestAnimationFrame(adjustColor);
    }

    adjustColor();
}

// --- Initialization ---

// Ensure the video resumes playback when the page becomes visible again
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        videoElement.play().catch(error => {
            console.error('Error resuming video playback:', error);
        });
    }
});

// --- Timed Updates ---

// Set an interval to update the clock every second (1000 milliseconds)
setInterval(updateClock, 1000);

// Optional: Update the greeting periodically (e.g., every minute) in case
// the user leaves the tab open across time boundaries (noon, 6 PM).
// setInterval(updateGreeting, 60000); // 60000ms = 1 minute

// Initialize variables for Pomodoro and focus mode
let isFocusModeActive = false;
let pomodoroInterval;
let timeLeft = 25 * 60; // 25 minutes in seconds
let wasCtrlZPressed = false;
let isRestPeriod = false;
let cycleCount = 0;

function toggleFocusMode() {
    isFocusModeActive = !isFocusModeActive;
    document.body.classList.toggle('focus-mode-active', isFocusModeActive);
    const pomodoroContainer = document.getElementById('pomodoro-container');
    const todoContainer = document.getElementById('todo-container');
    
    if (isFocusModeActive) {
        // Reset Pomodoro states
        isRestPeriod = false;
        cycleCount = 0;
        
        // Show todo list and pomodoro timer
        todoContainer.style.display = 'block';
        pomodoroContainer.style.display = 'block';
        
        // Request fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
        
        // Start Pomodoro timer
        startPomodoroWorkPeriod();
        
        // Save focus mode state
        localStorage.setItem('focusModeActive', 'true');
        
        // Prevent tab switching
        window.addEventListener('beforeunload', preventTabSwitch);
    } else {
        // Exit fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        
        // Stop and reset Pomodoro timer
        stopPomodoro();
        pomodoroContainer.style.display = 'none';
        
        localStorage.setItem('focusModeActive', 'false');
        window.removeEventListener('beforeunload', preventTabSwitch);
    }
}

function startPomodoroWorkPeriod() {
    timeLeft = 25 * 60; // 25 minutes
    isRestPeriod = false;
    updatePomodoroDisplay();
    document.getElementById('pomodoro-status').textContent = 'Focus Time';
    document.querySelector('.progress-ring-circle').style.stroke = 'rgba(6, 223, 6, 0.8)';
    document.querySelector('.timer-content').classList.remove('rest-period');
    document.getElementById('cycle-counter').textContent = `Cycle: ${cycleCount + 1}/2`;
    playNotificationSound();
    startTimer();
}

function startPomodoroRestPeriod() {
    timeLeft = 5 * 60; // 5 minutes
    isRestPeriod = true;
    updatePomodoroDisplay();
    document.getElementById('pomodoro-status').textContent = 'Rest Time';
    document.querySelector('.progress-ring-circle').style.stroke = 'rgba(250, 3, 3, 0.8)';
    document.querySelector('.timer-content').classList.add('rest-period');
    playNotificationSound();
    startTimer();
}

function playNotificationSound() {
    const sound = document.getElementById('timer-sound');
    sound.currentTime = 0;
    sound.play().catch(err => console.log('Audio play failed:', err));
}

function startTimer() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
    }
    
    pomodoroInterval = setInterval(() => {
        timeLeft--;
        updatePomodoroDisplay();
        
        if (timeLeft <= 0) {
            if (isRestPeriod) {
                cycleCount++;
                if (cycleCount >= 2) { // 2 cycles = 1 hour
                    completePomodoroSession();
                } else {
                    startPomodoroWorkPeriod();
                }
            } else {
                startPomodoroRestPeriod();
            }
        }
    }, 1000);
}

function stopPomodoro() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
    }
    timeLeft = 25 * 60;
    isRestPeriod = false;
    cycleCount = 0;
    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('pomodoro-timer').textContent = display;

    // Update circle progress
    const circle = document.querySelector('.progress-ring-circle');
    const totalTime = isRestPeriod ? 5 * 60 : 25 * 60;
    const progress = (timeLeft / totalTime);
    const circumference = 879.64; // 2 * π * 140 (radius)
    const offset = circumference * (1 - progress);
    circle.style.strokeDashoffset = offset;
}

function completePomodoroSession() {
    stopPomodoro();
    document.getElementById('pomodoro-status').textContent = 'Session Complete!';
    // Allow tab switching and exit focus mode after 3 seconds
    window.removeEventListener('beforeunload', preventTabSwitch);
    setTimeout(() => {
        if (isFocusModeActive) {
            toggleFocusMode();
        }
    }, 3000);
}

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality
    setRandomBackgroundVideo();
    updateClock();
    updateGreeting();
    adjustClockColorBasedOnVideo();
    updateGreetingColor();
    
    // Load clock format preference and set toggle state
    is24HourFormat = localStorage.getItem('clockFormat24h') !== 'false';
    const formatToggle = document.getElementById('format-toggle');
    const formatDots = document.querySelector('.format-dots');
    const toggleBox = document.querySelector('.format-toggle-box');
    
    if (formatToggle) {
        formatToggle.checked = is24HourFormat;
    }
    
    // Handle format toggle box
    if (formatDots && toggleBox) {
        formatDots.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBox.classList.toggle('show');
        });
        
        // Handle toggle switch change
        formatToggle.addEventListener('change', () => {
            is24HourFormat = formatToggle.checked;
            localStorage.setItem('clockFormat24h', is24HourFormat);
            updateClock();
        });
        
        // Hide toggle box when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggleBox.contains(e.target) && !formatDots.contains(e.target)) {
                toggleBox.classList.remove('show');
            }
        });
    }
    
    // Initialize todo list functionality
    const todoContainer = document.getElementById('todo-container');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const tikBotButton = document.getElementById('tikbot-button');
    const pomodoroContainer = document.getElementById('pomodoro-container');

    if (todoContainer && todoInput && todoList && tikBotButton) {
        // Set initial state
        todoContainer.style.display = 'none';
        pomodoroContainer.style.display = 'none';

        // Configure button
        tikBotButton.style.backgroundImage = 'url("check.png")';
        
        // Load saved todos
        const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
        savedTodos.forEach(todoText => {
            const listItem = createTodoItem(todoText);
            todoList.appendChild(listItem);
        });

        // Toggle todo list
        tikBotButton.addEventListener('click', () => {
            const isHidden = todoContainer.style.display === 'none';
            todoContainer.style.display = isHidden ? 'block' : 'none';
        });

        // Handle todo list functionality
        function createTodoItem(text) {
            const listItem = document.createElement('li');
            const taskText = document.createElement('span');
            taskText.textContent = text;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                listItem.remove();
                saveTodos();
            });
            
            listItem.appendChild(taskText);
            listItem.appendChild(deleteButton);
            return listItem;
        }

        function saveTodos() {
            const todos = Array.from(todoList.querySelectorAll('li span'))
                .map(span => span.textContent);
            localStorage.setItem('todos', JSON.stringify(todos));
        }

        todoInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && todoInput.value.trim() !== '') {
                const listItem = createTodoItem(todoInput.value);
                todoList.appendChild(listItem);
                saveTodos();
                todoInput.value = '';
            }
        });
    }

    // Handle Ctrl+Z shortcut
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'z') {
            wasCtrlZPressed = true;
            if (isFocusModeActive) {
                toggleFocusMode();
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key.toLowerCase() === 'z') {
            wasCtrlZPressed = false;
        }
    });

    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && isFocusModeActive) {
            toggleFocusMode(); // Exit focus mode if user exits fullscreen
        }
    });

    // Initialize focus mode button
    document.getElementById('focus-mode-button').addEventListener('click', toggleFocusMode);

    // Restore focus mode if it was active
    if (localStorage.getItem('focusModeActive') === 'true') {
        toggleFocusMode();
    }
});

function toggleClockFormat() {
    is24HourFormat = !is24HourFormat;
    localStorage.setItem('clockFormat24h', is24HourFormat);
    updateClock();
}
