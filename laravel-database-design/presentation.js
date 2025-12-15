/**
 * Laravel Database Design Presentation
 * JavaScript for slide navigation and interactions
 */

// State
let currentSlide = 1;
const totalSlides = 37;

// DOM Elements
const slides = document.querySelectorAll(".slide");
const progressFill = document.getElementById("progressFill");
const slideCounter = document.getElementById("slideCounter");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const thumbList = document.getElementById("thumbList");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initThumbnails();
  updateSlide();
  hljs.highlightAll();
});

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
    case " ":
    case "Enter":
      e.preventDefault();
      nextSlide();
      break;
    case "ArrowLeft":
    case "Backspace":
      e.preventDefault();
      prevSlide();
      break;
    case "Home":
      e.preventDefault();
      goToSlide(1);
      break;
    case "End":
      e.preventDefault();
      goToSlide(totalSlides);
      break;
    case "Escape":
      closeThumbnails();
      break;
  }

  // Number keys for quick navigation (1-9)
  if (e.key >= "1" && e.key <= "9") {
    const slideNum = Number.parseInt(e.key, 10);
    if (slideNum <= totalSlides) {
      goToSlide(slideNum);
    }
  }
});

// Touch/Swipe Navigation
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  false
);

document.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  false
);

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}

// Navigation Functions
function nextSlide() {
  if (currentSlide < totalSlides) {
    currentSlide++;
    updateSlide();
  }
}

function prevSlide() {
  if (currentSlide > 1) {
    currentSlide--;
    updateSlide();
  }
}

function goToSlide(slideNum) {
  if (slideNum >= 1 && slideNum <= totalSlides) {
    currentSlide = slideNum;
    updateSlide();
    closeThumbnails();
  }
}

function updateSlide() {
  // Update slides visibility
  slides.forEach((slide, index) => {
    const slideIndex = index + 1;
    slide.classList.remove("active", "prev");

    if (slideIndex === currentSlide) {
      slide.classList.add("active");
    } else if (slideIndex < currentSlide) {
      slide.classList.add("prev");
    }
  });

  // Update progress bar
  const progress = (currentSlide / totalSlides) * 100;
  progressFill.style.width = `${progress}%`;

  // Update counter
  slideCounter.textContent = `${currentSlide} / ${totalSlides}`;

  // Update navigation buttons
  prevBtn.disabled = currentSlide === 1;
  nextBtn.disabled = currentSlide === totalSlides;

  // Update thumbnails
  updateThumbnails();

  // Re-highlight code blocks (unset highlighted flag first to avoid warning)
  document.querySelectorAll("pre code").forEach((block) => {
    if (block.dataset.highlighted) {
      delete block.dataset.highlighted;
    }
    hljs.highlightElement(block);
  });

  // Store current slide in URL hash
  history.replaceState(null, null, `#slide-${currentSlide}`);
}

// Thumbnails
function initThumbnails() {
  const slideData = [
    "Trang bìa",
    "Mục lục",
    "ACID Properties",
    "Atomicity Example",
    "Consistency Example",
    "Isolation Levels",
    "Durability",
    "Normalization Intro",
    "1NF",
    "2NF",
    "3NF",
    "Schema & Migrations",
    "Naming Conventions",
    "Migration",
    "Foreign Key Actions",
    "Relationships Intro",
    "One-to-One",
    "One-to-Many",
    "Many-to-Many",
    "Polymorphic Intro",
    "Polymorphic Example",
    "Has Many Through",
    "Query Optimization",
    "N+1 Problem",
    "Select Columns",
    "Chunk Large Data",
    "Cache Queries",
    "Index Là Gì",
    "Index Types",
    "Indexing Strategies",
    "Transactions",
    "Soft Deletes",
    "Best Practices Intro",
    "Best Practices",
    "Anti-patterns",
    "Summary",
    "Thank You",
  ];

  slideData.forEach((title, index) => {
    const thumb = document.createElement("div");
    thumb.className = "thumb-item";
    thumb.textContent = `${index + 1}. ${title}`;
    thumb.onclick = () => goToSlide(index + 1);
    thumbList.appendChild(thumb);
  });
}

function updateThumbnails() {
  const thumbItems = document.querySelectorAll(".thumb-item");
  thumbItems.forEach((item, index) => {
    item.classList.toggle("active", index + 1 === currentSlide);
  });
}

function toggleThumbnails() {
  thumbList.classList.toggle("active");
}

function closeThumbnails() {
  thumbList.classList.remove("active");
}

// Check URL hash on load
globalThis.addEventListener("load", () => {
  const hash = globalThis.location.hash;
  if (hash?.startsWith("#slide-")) {
    const slideNum = Number.parseInt(hash.replace("#slide-", ""), 10);
    if (slideNum >= 1 && slideNum <= totalSlides) {
      currentSlide = slideNum;
      updateSlide();
    }
  }
});

// Fullscreen toggle (F key)
document.addEventListener("keydown", (e) => {
  if (e.key === "f" || e.key === "F") {
    toggleFullscreen();
  }
});

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

// Presenter mode (P key) - shows time
let presenterMode = false;
let startTime = null;

document.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "P") {
    presenterMode = !presenterMode;
    if (presenterMode) {
      startTime = new Date();
      showPresenterInfo();
    } else {
      hidePresenterInfo();
    }
  }
});

function showPresenterInfo() {
  let presenterDiv = document.getElementById("presenter-info");
  if (!presenterDiv) {
    presenterDiv = document.createElement("div");
    presenterDiv.id = "presenter-info";
    presenterDiv.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 0.75rem 1.25rem;
            background: rgba(26, 26, 37, 0.95);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 0.9rem;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;
    document.body.appendChild(presenterDiv);
  }

  updatePresenterInfo();
  setInterval(updatePresenterInfo, 1000);
}

function updatePresenterInfo() {
  const presenterDiv = document.getElementById("presenter-info");
  if (presenterDiv && presenterMode) {
    const now = new Date();
    const elapsed = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    presenterDiv.innerHTML = `
            <div>🕐 ${now.toLocaleTimeString()}</div>
            <div>⏱️ ${minutes}:${seconds.toString().padStart(2, "0")}</div>
        `;
  }
}

function hidePresenterInfo() {
  const presenterDiv = document.getElementById("presenter-info");
  if (presenterDiv) {
    presenterDiv.remove();
  }
}

// Auto-advance (A key)
let autoAdvance = false;
let autoInterval = null;

document.addEventListener("keydown", (e) => {
  if (e.key === "a" || e.key === "A") {
    autoAdvance = !autoAdvance;
    if (autoAdvance) {
      showNotification("Auto-advance: ON (30s)");
      autoInterval = setInterval(() => {
        if (currentSlide < totalSlides) {
          nextSlide();
        } else {
          clearInterval(autoInterval);
          autoAdvance = false;
          showNotification("Auto-advance: Completed");
        }
      }, 30000);
    } else {
      clearInterval(autoInterval);
      showNotification("Auto-advance: OFF");
    }
  }
});

// Notification system
function showNotification(message) {
  let notification = document.getElementById("notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification";
    notification.style.cssText = `
            position: fixed;
            bottom: 6rem;
            left: 50%;
            transform: translateX(-50%);
            padding: 0.75rem 1.5rem;
            background: rgba(59, 130, 246, 0.9);
            border-radius: 8px;
            font-size: 0.9rem;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.style.opacity = "1";

  setTimeout(() => {
    notification.style.opacity = "0";
  }, 2000);
}

// Help overlay (H key)
document.addEventListener("keydown", (e) => {
  if (e.key === "h" || e.key === "H") {
    toggleHelp();
  }
});

function toggleHelp() {
  let helpOverlay = document.getElementById("help-overlay");

  if (helpOverlay) {
    helpOverlay.remove();
    return;
  }

  helpOverlay = document.createElement("div");
  helpOverlay.id = "help-overlay";
  helpOverlay.innerHTML = `
        <div class="help-content">
            <h3>⌨️ Keyboard Shortcuts</h3>
            <div class="help-grid">
                <div><kbd>→</kbd> / <kbd>Space</kbd></div><div>Next slide</div>
                <div><kbd>←</kbd> / <kbd>Backspace</kbd></div><div>Previous slide</div>
                <div><kbd>1-9</kbd></div><div>Go to slide 1-9</div>
                <div><kbd>Home</kbd></div><div>First slide</div>
                <div><kbd>End</kbd></div><div>Last slide</div>
                <div><kbd>F</kbd></div><div>Toggle fullscreen</div>
                <div><kbd>P</kbd></div><div>Presenter mode</div>
                <div><kbd>A</kbd></div><div>Auto-advance (30s)</div>
                <div><kbd>H</kbd></div><div>Toggle this help</div>
                <div><kbd>Esc</kbd></div><div>Close overlays</div>
            </div>
            <p>Click anywhere or press <kbd>H</kbd> to close</p>
        </div>
    `;
  helpOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        cursor: pointer;
    `;

  const style = document.createElement("style");
  style.textContent = `
        .help-content {
            background: #1a1a25;
            padding: 2rem;
            border-radius: 16px;
            max-width: 500px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .help-content h3 {
            margin-bottom: 1.5rem;
            text-align: center;
        }
        .help-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 0.75rem 1.5rem;
            margin-bottom: 1.5rem;
        }
        .help-grid kbd {
            background: #2a2a3a;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-family: inherit;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .help-content p {
            text-align: center;
            color: #a0a0b0;
            font-size: 0.9rem;
        }
    `;
  helpOverlay.appendChild(style);

  helpOverlay.onclick = () => helpOverlay.remove();
  document.body.appendChild(helpOverlay);
}

// Console welcome message
console.log(
  `
%c🚀 Laravel Database Design Presentation
%cKeyboard shortcuts: Press H for help

Navigation:
  → / Space     Next slide
  ← / Backspace Previous slide
  1-9           Go to slide 1-9
  
Features:
  F - Fullscreen
  P - Presenter mode
  A - Auto-advance
  H - Help overlay
`,
  "font-size: 18px; font-weight: bold; color: #3b82f6;",
  "font-size: 12px; color: #a0a0b0;"
);
