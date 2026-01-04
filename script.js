// Next Level Loading Animation JavaScript
class AdvancedLoadingAnimation {
    constructor() {
        this.currentTheme = 'neon';
        this.soundEnabled = false;
        this.animationSpeed = 1;
        this.loadingTimeout = null;
        this.progressInterval = null;
        this.statsInterval = null;
        this.particles = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createParticleSystem();
        this.initThemeSystem();
        this.initSoundSystem();
        this.startLoading();
    }

    setupEventListeners() {
        // Theme selector
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeTheme(e.target.dataset.theme);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Enter':
                case ' ':
                    if (document.querySelector('.content').classList.contains('hidden')) {
                        this.startLoading();
                    }
                    break;
                case 't':
                    this.changeTheme();
                    break;
                case 's':
                    this.toggleSound();
                    break;
                case 'ArrowUp':
                    this.changeSpeed(0.5);
                    break;
                case 'ArrowDown':
                    this.changeSpeed(-0.5);
                    break;
            }
        });

        // Mouse interactions
        this.setupMouseInteractions();
    }

    createParticleSystem() {
        const container = document.querySelector('.particles-container');
        
        // Create additional dynamic particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            container.appendChild(particle);
        }
    }

    initThemeSystem() {
        const themes = ['neon', 'cyber', 'cosmic', 'minimal'];
        let currentIndex = 0;

        // Auto-cycle themes every 10 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % themes.length;
            this.changeTheme(themes[currentIndex]);
        }, 10000);
    }

    initSoundSystem() {
        // Create audio context for sound effects
        this.audioContext = null;
        this.sounds = {
            loading: this.createTone(440, 'sine'),
            complete: this.createTone(880, 'triangle'),
            theme: this.createTone(660, 'square')
        };
    }

    createTone(frequency, type = 'sine') {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.5);
        };
    }

    setupMouseInteractions() {
        const spinner = document.querySelector('.morphing-spinner');
        const dots = document.querySelectorAll('.dot');
        const loadingContainer = document.querySelector('.loading-container');

        // Spinner interactions
        spinner.addEventListener('mouseenter', () => {
            spinner.style.transform = 'scale(1.1) rotateY(180deg)';
            this.playSound('loading');
        });

        spinner.addEventListener('mouseleave', () => {
            spinner.style.transform = 'scale(1) rotateY(0deg)';
        });

        // Dot interactions
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                dot.style.background = `linear-gradient(45deg, ${this.getRandomColor()}, ${this.getRandomColor()})`;
                dot.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    dot.style.transform = 'scale(1)';
                }, 200);
                this.playSound('loading');
            });
        });

        // Container hover effects
        loadingContainer.addEventListener('mouseenter', () => {
            loadingContainer.style.transform = 'scale(1.02)';
            loadingContainer.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
        });

        loadingContainer.addEventListener('mouseleave', () => {
            loadingContainer.style.transform = 'scale(1)';
            loadingContainer.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        });
    }

    startLoading() {
        const loadingContainer = document.querySelector('.loading-container');
        const content = document.querySelector('.content');
        
        // Show loading container
        loadingContainer.classList.remove('hidden');
        content.classList.add('hidden');
        
        // Reset animations
        this.resetAnimations();
        
        // Start progress animation
        this.startProgressAnimation();
        
        // Start stats animation
        this.startStatsAnimation();
        
        // Dynamic loading text
        this.startDynamicText();
        
        // Simulate loading time (4-6 seconds)
        const loadingTime = (Math.random() * 2000 + 4000) / this.animationSpeed;
        
        this.loadingTimeout = setTimeout(() => {
            this.hideLoading();
        }, loadingTime);

        // Initialize audio context on first interaction
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    resetAnimations() {
        const progressBar = document.querySelector('.progress-bar');
        const percentage = document.querySelector('.progress-percentage');
        const statFills = document.querySelectorAll('.stat-fill');
        
        progressBar.style.width = '0%';
        percentage.textContent = '0%';
        statFills.forEach(fill => {
            fill.style.width = '0%';
        });
    }

    startProgressAnimation() {
        const progressBar = document.querySelector('.progress-bar');
        const percentage = document.querySelector('.progress-percentage');
        let progress = 0;
        
        this.progressInterval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(this.progressInterval);
            }
            
            progressBar.style.width = progress + '%';
            percentage.textContent = Math.round(progress) + '%';
            
            // Add glow effect
            progressBar.style.boxShadow = `0 0 ${progress * 2}px var(--primary-color)`;
        }, 100 / this.animationSpeed);
    }

    startStatsAnimation() {
        const stats = ['memory', 'cpu', 'network'];
        let statIndex = 0;
        
        this.statsInterval = setInterval(() => {
            const statFill = document.querySelector(`[data-stat="${stats[statIndex]}"]`);
            if (statFill) {
                const randomWidth = Math.random() * 100;
                statFill.style.width = randomWidth + '%';
                statFill.style.transition = 'width 0.5s ease';
            }
            
            statIndex = (statIndex + 1) % stats.length;
        }, 800 / this.animationSpeed);
    }

    startDynamicText() {
        const loadingWord = document.querySelector('.loading-word');
        const texts = [
            'Loading', 'Initializing', 'Processing', 'Optimizing', 
            'Calibrating', 'Synchronizing', 'Finalizing', 'Almost Ready'
        ];
        let currentIndex = 0;
        
        setInterval(() => {
            loadingWord.textContent = texts[currentIndex];
            currentIndex = (currentIndex + 1) % texts.length;
            
            // Add typing effect
            loadingWord.style.opacity = '0';
            setTimeout(() => {
                loadingWord.style.opacity = '1';
            }, 100);
        }, 2000 / this.animationSpeed);
    }

    hideLoading() {
        const loadingContainer = document.querySelector('.loading-container');
        const content = document.querySelector('.content');
        
        // Clear intervals
        clearTimeout(this.loadingTimeout);
        clearInterval(this.progressInterval);
        clearInterval(this.statsInterval);
        
        // Play completion sound
        this.playSound('complete');
        
        // Hide loading with advanced transition
        loadingContainer.style.opacity = '0';
        loadingContainer.style.transform = 'scale(0.8) rotateY(180deg)';
        
        setTimeout(() => {
            loadingContainer.classList.add('hidden');
            content.classList.remove('hidden');
            
            // Reset loading container styles
            loadingContainer.style.opacity = '1';
            loadingContainer.style.transform = 'scale(1) rotateY(0deg)';
            
            // Trigger success animation
            this.triggerSuccessAnimation();
        }, 500);
    }

    triggerSuccessAnimation() {
        const checkmark = document.querySelector('.checkmark');
        checkmark.style.animation = 'none';
        setTimeout(() => {
            checkmark.style.animation = 'checkmark-appear 0.8s ease-out';
        }, 100);
    }

    changeTheme(theme = null) {
        if (!theme) {
            const themes = ['neon', 'cyber', 'cosmic', 'minimal'];
            const currentIndex = themes.indexOf(this.currentTheme);
            theme = themes[(currentIndex + 1) % themes.length];
        }
        
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        
        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        
        // Play theme change sound
        this.playSound('theme');
        
        // Add theme transition effect
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.querySelector('.btn-secondary');
        soundBtn.textContent = this.soundEnabled ? 'Sound On' : 'Sound Off';
        
        if (this.soundEnabled && !this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        this.playSound('loading');
    }

    changeSpeed(delta) {
        this.animationSpeed = Math.max(0.5, Math.min(3, this.animationSpeed + delta));
        
        // Update speed indicator
        const speedBtn = document.querySelector('.btn-tertiary');
        speedBtn.textContent = `Speed: ${this.animationSpeed.toFixed(1)}x`;
        
        // Apply speed to animations
        document.documentElement.style.setProperty('--animation-speed', this.animationSpeed);
    }

    playSound(soundType) {
        if (this.sounds[soundType]) {
            this.sounds[soundType]();
        }
    }

    getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Global functions for HTML onclick handlers
let loadingAnimation;

function showLoading() {
    loadingAnimation.startLoading();
}

function toggleSound() {
    loadingAnimation.toggleSound();
}

function changeSpeed() {
    loadingAnimation.changeSpeed(0.5);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadingAnimation = new AdvancedLoadingAnimation();
    
    // Add performance monitoring
    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`🚀 Page load time: ${loadTime}ms`);
    }
    
    // Add resize handler for responsive adjustments
    window.addEventListener('resize', () => {
        // Recalculate particle positions on resize
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            if (Math.random() > 0.5) {
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
            }
        });
    });
    
    // Add visibility change handler
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when tab is not visible
            document.body.style.animationPlayState = 'paused';
        } else {
            // Resume animations when tab becomes visible
            document.body.style.animationPlayState = 'running';
        }
    });
    
    // Add touch support for mobile
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        
        if (Math.abs(deltaY) > 50) {
            if (deltaY > 0) {
                // Swipe up - change theme
                loadingAnimation.changeTheme();
            } else {
                // Swipe down - restart loading
                showLoading();
            }
        }
    });
    
    console.log('🎨 Next Level Loading Animation initialized!');
    console.log('🎮 Controls:');
    console.log('  - Space/Enter: Restart loading');
    console.log('  - T: Change theme');
    console.log('  - S: Toggle sound');
    console.log('  - ↑/↓: Change speed');
    console.log('  - Swipe up/down on mobile');
});