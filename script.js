const messages = [
    "👋 Welcome!",
    "🆕 Up Next → <b>Restream Vertical Plugin</b>",
    "🆕 Up Next → Redesigned <b>Guest Studio</b>",
    "💬 Join our <b>Discord</b> community!"
];

const listElement = document.getElementById('ticker-list');
const mainBox = document.getElementById('main-box');

// Variables are now calculated dynamically
let itemHeight = 0; 
let boxPadding = 0; 
let currentIndex = 0;
const totalRealItems = messages.length;

// Helper to get current dimensions (updates on resize)
function updateDimensions() {
    // Temporarily create a dummy item to measure CSS values
    const tempItem = document.createElement('div');
    tempItem.className = 'ticker-item';
    tempItem.style.visibility = 'hidden';
    tempItem.style.position = 'absolute';
    tempItem.innerHTML = '<span class="msg-content">Test</span>';
    document.body.appendChild(tempItem);
    
    // Read the computed height from CSS
    itemHeight = tempItem.offsetHeight;
    document.body.removeChild(tempItem);

    // Calculate padding (Left + Right + Border safety)
    const computedStyle = window.getComputedStyle(mainBox);
    const pLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const pRight = parseFloat(computedStyle.paddingRight) || 0;
    const border = parseFloat(computedStyle.borderLeftWidth) || 0;
    
    // Add a small buffer (5px) to ensure text doesn't wrap
    boxPadding = pLeft + pRight + border + 5; 
}

function initTicker() {
    updateDimensions(); // Calculate sizes first
    listElement.innerHTML = '';

    messages.forEach(msg => {
        let li = document.createElement('li');
        li.className = 'ticker-item';
        li.innerHTML = `<span class="msg-content">${msg}</span>`; 
        listElement.appendChild(li);
    });

    if (listElement.children.length > 0) {
        let firstItemClone = listElement.children[0].cloneNode(true);
        listElement.appendChild(firstItemClone);
    }
    
    updateBoxWidth(0);
}

function updateBoxWidth(index) {
    const items = listElement.children;
    if (items[index]) {
        const span = items[index].querySelector('.msg-content');
        // Get accurate width
        const textWidth = span.getBoundingClientRect().width; 
        const totalWidth = textWidth + boxPadding;
        mainBox.style.width = totalWidth + 'px';
    }
}

function rotateTicker() {
    currentIndex++;
    
    listElement.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    
    // Recalculate position based on current itemHeight
    const translateY = -1 * (currentIndex * itemHeight);
    listElement.style.transform = 'translateY(' + translateY + 'px)';

    updateBoxWidth(currentIndex);

    if (currentIndex === totalRealItems) {
        setTimeout(() => {
            listElement.style.transition = 'none';
            currentIndex = 0;
            listElement.style.transform = 'translateY(0px)';
            updateBoxWidth(0); 
            // Force reflow
            void listElement.offsetWidth;
        }, 600); 
    }
}

// INIT
setTimeout(() => {
    initTicker();
    setInterval(rotateTicker, 5000);
}, 500);

// LISTENER: Recalculate everything if user resizes the window
window.addEventListener('resize', () => {
    updateDimensions();
    
    // Fix current position immediately so it doesn't look broken
    listElement.style.transition = 'none';
    const translateY = -1 * (currentIndex * itemHeight);
    listElement.style.transform = 'translateY(' + translateY + 'px)';
    
    // Fix width immediately
    updateBoxWidth(currentIndex);
});