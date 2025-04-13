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
    'videos/a.mp4', // Example: 'videos/a.mp4'
    
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

// --- Initialization ---

// Run the functions once immediately when the script loads
setRandomBackgroundVideo(); // Set the initial background video
updateClock();            // Display the initial time
updateGreeting();         // Display the initial greeting

// Call the function to adjust clock color based on video
adjustClockColorBasedOnVideo();

// --- Timed Updates ---

// Set an interval to update the clock every second (1000 milliseconds)
setInterval(updateClock, 1000);

// Optional: Update the greeting periodically (e.g., every minute) in case
// the user leaves the tab open across time boundaries (noon, 6 PM).
// setInterval(updateGreeting, 60000); // 60000ms = 1 minute
