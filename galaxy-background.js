// HD Galaxy Background Script - 8K Quality
// Create starry background
const starryBg = document.getElementById('starryBg');
const numStars = 3500;
const stars = [];
const starColors = ['blue', 'white', 'yellow', 'red'];
const starSizes = [
    { class: 'tiny', size: [0.5, 1], weight: 0.75 },
    { class: 'small', size: [1, 1.8], weight: 0.18 },
    { class: 'medium', size: [1.8, 3], weight: 0.06 },
    { class: 'large', size: [3, 5], weight: 0.01 }
];

// Function to get weighted random star size
function getRandomStarSize() {
    const rand = Math.random();
    let cumulative = 0;
    for (const sizeType of starSizes) {
        cumulative += sizeType.weight;
        if (rand <= cumulative) {
            return sizeType;
        }
    }
    return starSizes[0];
}

// Create stars with varying sizes and colors
for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    const sizeType = getRandomStarSize();
    const size = sizeType.size[0] + Math.random() * (sizeType.size[1] - sizeType.size[0]);
    const colorClass = starColors[Math.floor(Math.random() * starColors.length)];
    
    star.className = `star ${sizeType.class} ${colorClass}`;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    
    // Random position with some clustering
    const cluster = Math.random() > 0.7;
    if (cluster) {
        const clusterX = Math.random() * 100;
        const clusterY = Math.random() * 100;
        star.style.left = (clusterX + (Math.random() - 0.5) * 10) + '%';
        star.style.top = (clusterY + (Math.random() - 0.5) * 10) + '%';
    } else {
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
    }
    
    // Random opacity for depth
    const baseOpacity = 0.4 + Math.random() * 0.6;
    star.style.opacity = baseOpacity;
    star.dataset.baseOpacity = baseOpacity;
    
    // Store initial position and depth for parallax
    star.dataset.x = parseFloat(star.style.left);
    star.dataset.y = parseFloat(star.style.top);
    star.dataset.depth = Math.random() * 0.8 + 0.2;
    
    // Random twinkle animation for some stars
    if (Math.random() > 0.7) {
        const duration = 2 + Math.random() * 4;
        const delay = Math.random() * 5;
        star.style.animation = `twinkle ${duration}s ease-in-out ${delay}s infinite`;
    }
    
    starryBg.appendChild(star);
    stars.push(star);
}

// Mouse move parallax effect with smoother movement
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Animate stars with smooth parallax
function animateStars() {
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    
    stars.forEach(star => {
        const depth = parseFloat(star.dataset.depth);
        const moveX = mouseX * 30 * depth;
        const moveY = mouseY * 30 * depth;
        
        star.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    requestAnimationFrame(animateStars);
}

animateStars();

// Enhanced twinkling effect
setInterval(() => {
    stars.forEach(star => {
        if (Math.random() > 0.98) {
            const baseOpacity = parseFloat(star.dataset.baseOpacity);
            star.style.opacity = baseOpacity * (0.3 + Math.random() * 0.7);
        }
    });
}, 50);

// Create shooting stars periodically
function createShootingStar() {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    shootingStar.style.left = (50 + Math.random() * 50) + '%';
    shootingStar.style.top = (Math.random() * 30) + '%';
    
    starryBg.appendChild(shootingStar);
    
    setTimeout(() => {
        shootingStar.remove();
    }, 1500);
}

// Spawn shooting stars randomly - More frequent
setInterval(() => {
    if (Math.random() > 0.3) {
        createShootingStar();
    }
}, 1200);
