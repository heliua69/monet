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
    'videos/c.mp4', // Example: 'videos/a.mp4'
    
    
];

// --- DOM Elements ---

// Get references to the HTML elements we need to interact with.
const videoSourceElement = document.getElementById('video-source');
const videoElement = document.getElementById('background-video');
const clockElement = document.getElementById('clock');
const greetingElement = document.getElementById('greeting');

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
    if (!clockElement) return; // Exit if clock element not found

    const now = new Date();
    // Get hours and minutes, padding with a leading zero if needed (e.g., '09' instead of '9')
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Update the text content of the clock element
    clockElement.textContent = `${hours}:${minutes}`;
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

// Function to add a TikBot-style to-do list
function initializeTikBotTodoList() {
    const tikBotButton = document.createElement('button');
    tikBotButton.id = 'tikbot-button';
    tikBotButton.textContent = ''; // Remove text content
    tikBotButton.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'20 6 9 17 4 12\'/%3E%3C/svg%3E")';
    tikBotButton.style.backgroundRepeat = 'no-repeat';
    tikBotButton.style.backgroundPosition = 'center';
    tikBotButton.style.backgroundSize = '50%';
    tikBotButton.style.position = 'absolute';
    tikBotButton.style.bottom = '20px';
    tikBotButton.style.right = '20px';
    tikBotButton.style.background = '#ff6b6b';
    tikBotButton.style.color = 'white';
    tikBotButton.style.border = 'none';
    tikBotButton.style.borderRadius = '50%';
    tikBotButton.style.width = '60px';
    tikBotButton.style.height = '60px';
    tikBotButton.style.fontSize = '1em';
    tikBotButton.style.cursor = 'pointer';
    tikBotButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    tikBotButton.style.transition = 'transform 0.3s ease';

    tikBotButton.addEventListener('mouseenter', () => {
        tikBotButton.style.transform = 'scale(1.1)';
    });

    tikBotButton.addEventListener('mouseleave', () => {
        tikBotButton.style.transform = 'scale(1)';
    });

    const todoContainer = document.createElement('div');
    todoContainer.id = 'todo-container';
    todoContainer.style.position = 'absolute';
    todoContainer.style.bottom = '100px';
    todoContainer.style.right = '20px';
    todoContainer.style.background = 'rgba(0, 0, 0, 0.6)';
    todoContainer.style.padding = '15px';
    todoContainer.style.borderRadius = '10px';
    todoContainer.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.5)';
    todoContainer.style.color = 'white';
    todoContainer.style.fontSize = '1em';
    todoContainer.style.fontFamily = 'Inter, sans-serif';
    todoContainer.style.display = 'none';

    const todoTitle = document.createElement('h3');
    todoTitle.textContent = 'To-Do List';
    todoTitle.style.margin = '0 0 10px 0';
    todoTitle.style.fontSize = '1.2em';
    todoTitle.style.fontWeight = '600';
    todoContainer.appendChild(todoTitle);

    const todoInput = document.createElement('input');
    todoInput.type = 'text';
    todoInput.placeholder = 'Add a new task';
    todoInput.style.width = '100%';
    todoInput.style.padding = '8px';
    todoInput.style.marginBottom = '10px';
    todoInput.style.border = 'none';
    todoInput.style.borderRadius = '5px';
    todoInput.style.fontSize = '1em';
    todoContainer.appendChild(todoInput);

    const todoList = document.createElement('ul');
    todoList.style.listStyle = 'none';
    todoList.style.padding = '0';
    todoContainer.appendChild(todoList);

    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && todoInput.value.trim() !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = todoInput.value;
            listItem.style.marginBottom = '8px';
            listItem.style.display = 'flex';
            listItem.style.justifyContent = 'space-between';
            listItem.style.alignItems = 'center';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.background = '#ff6b6b';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '5px';
            deleteButton.style.color = 'white';
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.fontSize = '0.9em';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.transition = 'background 0.3s ease';

            deleteButton.addEventListener('mouseenter', () => {
                deleteButton.style.background = '#ff4c4c';
            });

            deleteButton.addEventListener('mouseleave', () => {
                deleteButton.style.background = '#ff6b6b';
            });

            deleteButton.addEventListener('click', () => {
                todoList.removeChild(listItem);
            });

            listItem.appendChild(deleteButton);
            todoList.appendChild(listItem);
            todoInput.value = '';
        }
    });

    tikBotButton.addEventListener('click', () => {
        todoContainer.style.display = todoContainer.style.display === 'none' ? 'block' : 'none';
    });

    document.body.appendChild(tikBotButton);
    document.body.appendChild(todoContainer);
}

// --- Initialization ---

// Run the functions once immediately when the script loads
setRandomBackgroundVideo(); // Set the initial background video
updateClock();            // Display the initial time
updateGreeting();         // Display the initial greeting

// Call the function to adjust clock color based on video
adjustClockColorBasedOnVideo();

// Initialize the TikBot-style to-do list
initializeTikBotTodoList();

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
