/**
 * Universal Auto-Config System v3.1
 * One Script for ANY Website - Zero Dependencies
 * Non-invasive, Class-based, Production Ready
 */

(function(global) {
    'use strict';
    
    // Prevent multiple initializations
    if (global.UniversalAutoConfig || global.UAC) {
        if (global.UAC && global.UAC.config && global.UAC.config.debug) {
            console.warn('⚠️ UniversalAutoConfig already loaded');
        }
        return;
    }

    class UniversalAutoConfig {
        constructor(options = {}) {
            // Merge with defaults - Ultra conservative by default
            this.config = {
                // Core enhancements
                enhanceButtons: options.enhanceButtons !== false,
                enhanceForms: options.enhanceForms !== false,
                enhanceImages: options.enhanceImages !== false,
                enhanceTables: options.enhanceTables !== false,
                enhanceLinks: options.enhanceLinks !== false,
                
                // Performance
                lazyLoadImages: options.lazyLoadImages !== false,
                deferScripts: options.deferScripts === true,
                preventLayoutShifts: options.preventLayoutShifts !== false,
                respectMotion: options.respectMotion !== false,
                
                // UI Features
                darkMode: options.darkMode || 'off', // 'off', 'auto', 'system', 'manual'
                scrollToTop: options.scrollToTop === true,
                loadingStates: options.loadingStates === true,
                smoothScroll: options.smoothScroll !== false,
                
                // Optional Components (OFF by default - non-invasive)
                createHeader: options.createHeader === true,
                createNavigation: options.createNavigation === true,
                createSidebar: options.createSidebar === true,
                
                // Behavior
                debug: options.debug || false,
                version: '3.1',
                minifyCSS: true,
                autoInit: options.autoInit !== false
            };
            
            // State
            this.initialized = false;
            this.isMobile = window.innerWidth <= 768;
            this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
            this.features = {};
            this.observer = null;
            this.loadingButtons = new WeakSet(); // Track buttons showing loading
            
            // Safe binding
            this.handleResize = this.throttle(this.handleResize.bind(this), 150);
            this.handleScroll = this.throttle(this.handleScroll.bind(this), 50);
            
            this.log('🚀 UAC v' + this.config.version + ' created');
        }
        
        // ==================== UTILITY METHODS ====================
        
        log(...args) {
            if (this.config.debug) {
                console.log('🔧 UAC:', ...args);
            }
        }
        
        warn(...args) {
            console.warn('⚠️ UAC:', ...args);
        }
        
        error(...args) {
            console.error('❌ UAC:', ...args);
        }
        
        // Throttle function for performance
        throttle(fn, delay) {
            let lastCall = 0;
            return function(...args) {
                const now = Date.now();
                if (now - lastCall >= delay) {
                    lastCall = now;
                    return fn.apply(this, args);
                }
            };
        }
        
        // Safe query selector
        $(selector, context = document) {
            try {
                return context.querySelector(selector);
            } catch (e) {
                return null;
            }
        }
        
        $$(selector, context = document) {
            try {
                return Array.from(context.querySelectorAll(selector));
            } catch (e) {
                return [];
            }
        }
        
        // Generate unique ID
        generateId(prefix = 'uac') {
            return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        
        // Check if element has own styles
        hasCustomStyles(el) {
            const style = window.getComputedStyle(el);
            return style.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
                   style.borderColor !== 'rgba(0, 0, 0, 0)' ||
                   style.borderRadius !== '0px';
        }
        
        // ==================== CORE INITIALIZATION ====================
        
        init() {
            if (this.initialized) {
                this.warn('Already initialized');
                return this;
            }
            
            try {
                this.log('Initializing...');
                
                // Phase 1: Critical setup
                this.injectEssentialCSS();
                this.setupViewport();
                this.detectEnvironment();
                
                // Phase 2: Apply configured enhancements
                this.applyEnhancements();
                
                // Phase 3: Performance optimizations
                this.applyOptimizations();
                
                // Phase 4: Event system
                this.setupEventListeners();
                this.setupObservers();
                
                // Phase 5: Optional features
                this.setupOptionalFeatures();
                
                this.initialized = true;
                
                // Dispatch ready event
                setTimeout(() => {
                    const event = new CustomEvent('uac:ready', {
                        detail: { 
                            version: this.config.version,
                            features: this.features,
                            config: this.config 
                        }
                    });
                    document.dispatchEvent(event);
                    this.log('✅ Ready!');
                }, 100);
                
            } catch (error) {
                this.error('Init failed:', error);
            }
            
            return this;
        }
        
        // ==================== PHASE 1: CRITICAL SETUP ====================
        
        injectEssentialCSS() {
            const styleId = 'uac-core-styles';
            if (this.$(styleId)) return;
            
            // Minimal, non-invasive CSS only
            const styles = `
                /* Universal AutoConfig - Minimal Enhancement Styles */
                /* These styles only enhance, never override existing styles */
                
                /* Button enhancements - only if no custom styles */
                button.uac-enhanced:not([style*="background"]):not(.btn),
                .uac-enhanced-btn:not([style*="background"]):not(.btn) {
                    position: relative;
                    overflow: hidden;
                    border: 1px solid transparent;
                    border-radius: 6px;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 1.4;
                    display: inline-block;
                    text-align: center;
                    vertical-align: middle;
                    transition: all 0.2s ease;
                    transform: translateZ(0);
                }
                
                button.uac-enhanced:hover:not(:disabled):not([style*="background"]):not(.btn),
                .uac-enhanced-btn:hover:not(:disabled):not([style*="background"]):not(.btn) {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                /* Button type indicators - very subtle */
                .uac-btn-primary:not([style*="background"]):not(.btn-primary) {
                    background-color: #3b82f6;
                    color: white;
                    border-color: #2563eb;
                }
                
                .uac-btn-danger:not([style*="background"]):not(.btn-danger) {
                    background-color: #ef4444;
                    color: white;
                    border-color: #dc2626;
                }
                
                .uac-btn-warning:not([style*="background"]):not(.btn-warning) {
                    background-color: #f59e0b;
                    color: white;
                    border-color: #d97706;
                }
                
                .uac-btn-secondary:not([style*="background"]):not(.btn-secondary) {
                    background-color: #6b7280;
                    color: white;
                    border-color: #4b5563;
                }
                
                /* Form field enhancements - only basic defaults */
                input.uac-enhanced:not([style*="border"]):not(.form-control),
                textarea.uac-enhanced:not([style*="border"]):not(.form-control),
                select.uac-enhanced:not([style*="border"]):not(.form-control) {
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    padding: 10px 14px;
                    font-size: 14px;
                    line-height: 1.5;
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
                }
                
                input.uac-enhanced:focus:not([style*="border"]):not(.form-control),
                textarea.uac-enhanced:focus:not([style*="border"]):not(.form-control),
                select.uac-enhanced:focus:not([style*="border"]):not(.form-control) {
                    border-color: #3b82f6;
                    outline: none;
                }
                
                /* Table enhancements - only if plain */
                table.uac-enhanced:not([style*="border"]):not(.table) {
                    border-collapse: collapse;
                    width: 100%;
                }
                
                table.uac-enhanced th:not([style*="border"]):not(.table th) {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 2px solid #e5e7eb;
                }
                
                table.uac-enhanced td:not([style*="border"]):not(.table td) {
                    padding: 12px;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                /* Responsive base */
                @media (max-width: 768px) {
                    :root {
                        --uac-touch-target: 44px;
                    }
                    
                    button, input, textarea, select {
                        font-size: 16px; /* Prevents iOS zoom */
                    }
                }
                
                /* Dark mode - prefers-color-scheme media query */
                @media (prefers-color-scheme: dark) {
                    :root:has(.uac-dark-mode) {
                        color-scheme: dark;
                    }
                    
                    .uac-dark-mode button.uac-enhanced:not([style*="background"]):not(.btn),
                    .uac-dark-mode .uac-enhanced-btn:not([style*="background"]):not(.btn) {
                        background-color: #374151;
                        border-color: #4b5563;
                        color: #f3f4f6;
                    }
                    
                    .uac-dark-mode input.uac-enhanced:not([style*="border"]):not(.form-control),
                    .uac-dark-mode textarea.uac-enhanced:not([style*="border"]):not(.form-control),
                    .uac-dark-mode select.uac-enhanced:not([style*="border"]):not(.form-control) {
                        background-color: #1f2937;
                        border-color: #374151;
                        color: #f3f4f6;
                    }
                }
                
                /* Scroll to top button */
                .uac-scroll-top {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: rgba(59, 130, 246, 0.9);
                    color: white;
                    border: none;
                    cursor: pointer;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                
                .uac-scroll-top.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .uac-scroll-top:hover {
                    background: rgba(37, 99, 235, 0.9);
                    transform: translateY(-2px);
                }
                
                /* Loading spinner */
                .uac-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: uac-spin 0.6s linear infinite;
                    margin-right: 8px;
                    vertical-align: middle;
                }
                
                @keyframes uac-spin {
                    to { transform: rotate(360deg); }
                }
                
                /* Navigation */
                .uac-navigation {
                    position: fixed;
                    top: 70px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    max-height: 70vh;
                    overflow-y: auto;
                    z-index: 999;
                    display: none;
                    min-width: 200px;
                }
                
                .uac-navigation.visible {
                    display: block;
                }
                
                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = this.config.minifyCSS ? 
                styles.replace(/\s+/g, ' ').trim() : styles;
            document.head.appendChild(style);
            
            this.log('Core CSS injected');
        }
        
        setupViewport() {
            if (!this.$('meta[name="viewport"]') && this.isMobile) {
                const meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=1';
                document.head.insertBefore(meta, document.head.firstChild);
                this.log('Viewport meta added');
            }
        }
        
        detectEnvironment() {
            this.features = {
                // Detect existing frameworks
                hasBootstrap: !!this.$('.container, .row, [class*="col-"]'),
                hasTailwind: !!this.$('[class*="bg-"], [class*="text-"]'),
                hasUIKit: !!this.$('.uk-button, .uk-grid'),
                hasFoundation: !!this.$('.button, .row'),
                
                // Detect JS frameworks
                hasjQuery: typeof jQuery !== 'undefined',
                hasReact: typeof React !== 'undefined',
                hasVue: typeof Vue !== 'undefined',
                hasAngular: typeof angular !== 'undefined',
                
                // Site structure
                hasCustomCSS: this.$('link[rel="stylesheet"]') !== null,
                hasCustomHeader: !!this.$('header, .header, .site-header'),
                hasCustomFooter: !!this.$('footer, .footer, .site-footer'),
                hasCustomNav: !!this.$('nav, .nav, .navbar'),
                hasCustomSidebar: !!this.$('aside, .sidebar'),
                
                // Content
                buttonCount: this.$$('button, .btn, [role="button"]').length,
                formCount: this.$$('form').length,
                imageCount: this.$$('img').length,
                tableCount: this.$$('table').length
            };
            
            this.log('Environment detected:', this.features);
            
            // Auto-disable features if framework detected
            if (this.features.hasBootstrap || this.features.hasTailwind || 
                this.features.hasUIKit || this.features.hasFoundation) {
                this.log('Framework detected - using minimal enhancements');
                this.config.enhanceButtons = false;
                this.config.enhanceForms = false;
                this.config.enhanceTables = false;
            }
        }
        
        // ==================== PHASE 2: ENHANCEMENTS ====================
        
        applyEnhancements() {
            this.log('Applying enhancements...');
            
            // Only enhance if no framework detected
            if (!this.features.hasBootstrap && !this.features.hasTailwind) {
                if (this.config.enhanceButtons) this.enhanceButtons();
                if (this.config.enhanceForms) this.enhanceForms();
                if (this.config.enhanceTables) this.enhanceTables();
            }
            
            // Always safe to enhance these
            if (this.config.enhanceImages) this.enhanceImages();
            if (this.config.enhanceLinks) this.enhanceLinks();
            if (this.config.smoothScroll) this.setupSmoothScroll();
            if (this.config.loadingStates) this.setupLoadingStates();
            
            this.log('Enhancements applied');
        }
        
        enhanceButtons() {
            this.$$('button:not([data-uac]), input[type="button"]:not([data-uac]), input[type="submit"]:not([data-uac])')
                .forEach(btn => {
                    // Skip if already styled by framework
                    if (btn.className.includes('btn-') || this.hasCustomStyles(btn)) {
                        return;
                    }
                    
                    btn.setAttribute('data-uac', 'enhanced');
                    btn.classList.add('uac-enhanced');
                    
                    // Detect button type from text/content
                    const text = (btn.textContent || btn.value || '').toLowerCase();
                    const isPrimary = text.includes('save') || text.includes('submit') || 
                                     text.includes('confirm') || text.includes('buy');
                    const isDanger = text.includes('delete') || text.includes('remove') || 
                                    text.includes('cancel');
                    const isWarning = text.includes('edit') || text.includes('update');
                    
                    // Add type class
                    if (isPrimary) {
                        btn.classList.add('uac-btn-primary');
                    } else if (isDanger) {
                        btn.classList.add('uac-btn-danger');
                    } else if (isWarning) {
                        btn.classList.add('uac-btn-warning');
                    } else {
                        btn.classList.add('uac-btn-secondary');
                    }
                });
        }
        
        enhanceForms() {
            this.$$('form:not([data-uac])').forEach(form => {
                form.setAttribute('data-uac', 'enhanced');
                
                // Add basic validation
                const validateForm = () => {
                    let isValid = true;
                    
                    this.$$('[required]', form).forEach(field => {
                        if (!field.value.trim()) {
                            isValid = false;
                            if (!field.hasAttribute('data-uac-error')) {
                                field.setAttribute('data-uac-error', 'true');
                                field.style.borderColor = '#ef4444';
                            }
                        }
                    });
                    
                    if (!isValid) {
                        this.showFormError('Please fill all required fields', form);
                    }
                    
                    return isValid;
                };
                
                // Store original submit handler
                const originalSubmit = form.onsubmit;
                
                form.onsubmit = function(e) {
                    if (!validateForm()) {
                        e.preventDefault();
                        return false;
                    }
                    
                    if (originalSubmit) {
                        return originalSubmit.call(this, e);
                    }
                    
                    return true;
                };
                
                // Clear error on input
                this.$$('input, textarea, select', form).forEach(field => {
                    field.addEventListener('input', () => {
                        if (field.hasAttribute('data-uac-error')) {
                            field.removeAttribute('data-uac-error');
                            field.style.borderColor = '';
                        }
                    });
                });
                
                // Add uac-enhanced class to form elements
                this.$$('input:not([type="hidden"]), textarea, select', form).forEach(el => {
                    if (!this.hasCustomStyles(el)) {
                        el.classList.add('uac-enhanced');
                    }
                });
            });
        }
        
        showFormError(message, form) {
            // Remove existing error
            const existing = this.$('.uac-form-error', form);
            if (existing) existing.remove();
            
            // Create error element
            const error = document.createElement('div');
            error.className = 'uac-form-error';
            error.textContent = message;
            error.style.cssText = `
                background: #fef2f2;
                color: #dc2626;
                padding: 10px;
                border-radius: 6px;
                margin: 10px 0;
                border: 1px solid #fca5a5;
                font-size: 14px;
                animation: fadeIn 0.3s ease;
            `;
            
            // Add animation
            if (!this.$('style#uac-animations')) {
                const style = document.createElement('style');
                style.id = 'uac-animations';
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            form.insertBefore(error, form.firstChild);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (error.parentNode) {
                    error.style.opacity = '0';
                    error.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => error.remove(), 300);
                }
            }, 5000);
        }
        
        enhanceTables() {
            this.$$('table:not([data-uac]):not(.table)').forEach(table => {
                if (this.hasCustomStyles(table)) return;
                
                table.setAttribute('data-uac', 'enhanced');
                table.classList.add('uac-enhanced');
                
                // Basic table styling
                this.$$('th', table).forEach(th => {
                    if (!this.hasCustomStyles(th)) {
                        th.style.padding = '12px';
                        th.style.textAlign = 'left';
                        th.style.borderBottom = '2px solid #e5e7eb';
                    }
                });
                
                this.$$('td', table).forEach((td, index) => {
                    if (!this.hasCustomStyles(td)) {
                        td.style.padding = '12px';
                        td.style.borderBottom = '1px solid #e5e7eb';
                        
                        // Subtle row coloring
                        const row = Math.floor(index / table.rows[0].cells.length);
                        if (row % 2 === 1) {
                            td.style.backgroundColor = '#f9fafb';
                        }
                    }
                });
            });
        }
        
        enhanceImages() {
            this.$$('img:not([data-uac])').forEach(img => {
                img.setAttribute('data-uac', 'enhanced');
                
                // Add alt if missing
                if (!img.alt && !img.hasAttribute('aria-hidden')) {
                    const src = img.src || '';
                    const alt = src.split('/').pop().split('.').shift() || 'Image';
                    img.alt = alt.substring(0, 100);
                }
                
                // Make responsive
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                
                // Add loading lazy for offscreen images
                if (!img.loading && !img.hasAttribute('data-src')) {
                    const rect = img.getBoundingClientRect();
                    if (rect.top > window.innerHeight * 2) {
                        img.loading = 'lazy';
                    }
                }
            });
        }
        
        enhanceLinks() {
            this.$$('a[href^="#"]:not([data-uac])').forEach(anchor => {
                anchor.setAttribute('data-uac', 'enhanced');
                
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;
                    
                    const target = this.$(href);
                    if (target) {
                        e.preventDefault();
                        this.smoothScrollTo(target);
                    }
                });
            });
        }
        
        setupSmoothScroll() {
            // Native smooth scroll if supported
            if ('scrollBehavior' in document.documentElement.style) {
                return; // Browser supports it natively
            }
            
            // Polyfill for older browsers
            this.smoothScrollTo = (target) => {
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 500;
                let start = null;
                
                const ease = (t, b, c, d) => {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                };
                
                const step = (timestamp) => {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const y = ease(progress, startPosition, distance, duration);
                    window.scrollTo(0, y);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                };
                
                window.requestAnimationFrame(step);
            };
        }
        
        setupLoadingStates() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('button, input[type="submit"]');
                
                if (!btn || this.loadingButtons.has(btn) || !btn.form) {
                    return;
                }
                
                // Only for form submission buttons
                if (btn.type === 'submit' || btn.getAttribute('type') === 'submit') {
                    const form = btn.form;
                    const originalText = btn.innerHTML;
                    const isAsync = form.hasAttribute('data-async');
                    
                    // Add loading state
                    btn.innerHTML = `<span class="uac-spinner"></span>${originalText}`;
                    btn.disabled = true;
                    this.loadingButtons.add(btn);
                    
                    // Reset after form submit or timeout
                    const resetButton = () => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        this.loadingButtons.delete(btn);
                    };
                    
                    // Listen for form submission completion
                    form.addEventListener('submit', function handler() {
                        setTimeout(resetButton, 100);
                        form.removeEventListener('submit', handler);
                    });
                    
                    // Safety timeout
                    setTimeout(resetButton, 10000);
                }
            });
        }
        
        // ==================== PHASE 3: OPTIMIZATIONS ====================
        
        applyOptimizations() {
            this.log('Applying optimizations...');
            
            if (this.config.lazyLoadImages) this.setupLazyLoading();
            if (this.config.deferScripts) this.deferNonCriticalScripts();
            if (this.config.preventLayoutShifts) this.preventLayoutShifts();
            if (this.config.respectMotion) this.respectReducedMotion();
            
            this.log('Optimizations applied');
        }
        
        setupLazyLoading() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src && !img.hasAttribute('data-loaded')) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.setAttribute('data-loaded', 'true');
                            img.classList.add('uac-loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            }, { rootMargin: '100px' });
            
            this.$$('img[data-src]').forEach(img => observer.observe(img));
        }
        
        deferNonCriticalScripts() {
            this.$$('script:not([defer]):not([async]):not([type="module"])').forEach((script, index) => {
                // Don't defer first 3 scripts or critical ones
                if (index > 2 && !script.hasAttribute('data-critical')) {
                    script.defer = true;
                }
            });
        }
        
        preventLayoutShifts() {
            // Set dimensions for images without them
            this.$$('img:not([width]):not([height])').forEach(img => {
                if (img.naturalWidth && img.naturalHeight) {
                    const ratio = img.naturalHeight / img.naturalWidth;
                    img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
                } else {
                    // Use a placeholder aspect ratio
                    img.style.aspectRatio = '16 / 9';
                }
            });
        }
        
        respectReducedMotion() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.classList.add('uac-reduced-motion');
            }
        }
        
        // ==================== PHASE 4: EVENT SYSTEM ====================
        
        setupEventListeners() {
            window.addEventListener('resize', this.handleResize);
            window.addEventListener('scroll', this.handleScroll);
            
            // Initial class setup
            document.documentElement.classList.toggle('uac-mobile', this.isMobile);
            document.documentElement.classList.toggle('uac-desktop', !this.isMobile);
            
            this.log('Event listeners setup');
        }
        
        handleResize() {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
            
            if (wasMobile !== this.isMobile) {
                document.documentElement.classList.toggle('uac-mobile', this.isMobile);
                document.documentElement.classList.toggle('uac-desktop', !this.isMobile);
                
                // Dispatch custom event
                document.dispatchEvent(new CustomEvent('uac:resize', {
                    detail: { isMobile: this.isMobile, isTablet: this.isTablet }
                }));
            }
        }
        
        handleScroll() {
            // Scroll to top button
            const scrollBtn = this.$('.uac-scroll-top');
            if (scrollBtn) {
                if (window.pageYOffset > 300) {
                    scrollBtn.classList.add('visible');
                } else {
                    scrollBtn.classList.remove('visible');
                }
            }
        }
        
        setupObservers() {
            // Watch for new elements
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            this.enhanceNewElement(node);
                        }
                    });
                });
            });
            
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            this.log('DOM observer started');
        }
        
        enhanceNewElement(element) {
            // Skip if framework detected
            if (this.features.hasBootstrap || this.features.hasTailwind) {
                return;
            }
            
            // Check element type and enhance
            if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
                if (this.config.enhanceButtons) {
                    setTimeout(() => this.enhanceButtons(), 10);
                }
            } else if (element.tagName === 'FORM') {
                if (this.config.enhanceForms) {
                    setTimeout(() => this.enhanceForms(), 10);
                }
            } else if (element.tagName === 'IMG') {
                if (this.config.enhanceImages) {
                    setTimeout(() => this.enhanceImages(), 10);
                }
            } else if (element.tagName === 'A') {
                if (this.config.enhanceLinks) {
                    setTimeout(() => this.enhanceLinks(), 10);
                }
            }
            
            // Check children recursively with depth limit
            const enhanceChildren = (el, depth = 0) => {
                if (depth > 3) return; // Limit recursion depth
                
                if (el.children) {
                    Array.from(el.children).forEach(child => {
                        this.enhanceNewElement(child);
                        enhanceChildren(child, depth + 1);
                    });
                }
            };
            
            enhanceChildren(element);
        }
        
        // ==================== PHASE 5: OPTIONAL FEATURES ====================
        
        setupOptionalFeatures() {
            if (this.config.darkMode !== 'off') {
                this.setupDarkMode();
            }
            
            if (this.config.scrollToTop) {
                this.addScrollToTop();
            }
            
            if (this.config.createNavigation && !this.features.hasCustomNav) {
                this.addNavigation();
            }
            
            // Header and sidebar are OFF by default - only add if explicitly requested
            if (this.config.createHeader && !this.features.hasCustomHeader) {
                this.addHeader();
            }
            
            if (this.config.createSidebar && !this.features.hasCustomSidebar) {
                this.addSidebar();
            }
        }
        
        setupDarkMode() {
            let isDark = false;
            
            switch (this.config.darkMode) {
                case 'system':
                    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    break;
                    
                case 'auto':
                    const hour = new Date().getHours();
                    isDark = hour >= 18 || hour < 6;
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        isDark = true;
                    }
                    break;
                    
                case 'manual':
                    isDark = localStorage.getItem('uac-dark-mode') === 'true';
                    break;
                    
                default:
                    isDark = false;
            }
            
            if (isDark) {
                document.documentElement.classList.add('uac-dark-mode');
            }
            
            // Store preference
            localStorage.setItem('uac-dark-mode', isDark.toString());
            
            // Listen for system changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.config.darkMode === 'system' || this.config.darkMode === 'auto') {
                    if (e.matches) {
                        document.documentElement.classList.add('uac-dark-mode');
                    } else {
                        document.documentElement.classList.remove('uac-dark-mode');
                    }
                    localStorage.setItem('uac-dark-mode', e.matches.toString());
                }
            });
        }
        
        addScrollToTop() {
            if (this.$('.uac-scroll-top')) return;
            
            const btn = document.createElement('button');
            btn.className = 'uac-scroll-top';
            btn.innerHTML = '↑';
            btn.title = 'Scroll to top';
            btn.setAttribute('aria-label', 'Scroll to top');
            
            btn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: this.config.smoothScroll ? 'smooth' : 'auto'
                });
            });
            
            document.body.appendChild(btn);
            
            // Initial visibility check
            setTimeout(() => this.handleScroll(), 100);
        }
        
        addNavigation() {
            // Create from h1-h3 headings
            const headings = this.$$('h1, h2, h3').filter(h => h.id || h.textContent.trim());
            if (headings.length < 2) return;
            
            const nav = document.createElement('nav');
            nav.className = 'uac-navigation';
            nav.setAttribute('aria-label', 'Page navigation');
            
            const ul = document.createElement('ul');
            ul.style.cssText = 'list-style: none; padding: 0; margin: 0;';
            
            headings.forEach((heading, index) => {
                if (!heading.id) {
                    heading.id = `uac-heading-${index}`;
                }
                
                const li = document.createElement('li');
                li.style.margin = '5px 0';
                
                const a = document.createElement('a');
                a.href = `#${heading.id}`;
                a.textContent = heading.textContent.substring(0, 30);
                a.style.cssText = `
                    display: block;
                    padding: 8px 12px;
                    color: #374151;
                    text-decoration: none;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                `;
                
                a.addEventListener('mouseenter', () => {
                    a.style.backgroundColor = '#f3f4f6';
                });
                
                a.addEventListener('mouseleave', () => {
                    a.style.backgroundColor = '';
                });
                
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.smoothScrollTo(heading);
                    nav.classList.remove('visible');
                });
                
                li.appendChild(a);
                ul.appendChild(li);
            });
            
            nav.appendChild(ul);
            document.body.appendChild(nav);
            
            // Add toggle button for mobile
            if (this.isMobile) {
                const toggle = document.createElement('button');
                toggle.className = 'uac-nav-toggle uac-mobile-only';
                toggle.innerHTML = '☰ Menu';
                toggle.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    padding: 8px 12px;
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                    cursor: pointer;
                    z-index: 1000;
                    font-size: 14px;
                `;
                
                toggle.addEventListener('click', () => {
                    nav.classList.toggle('visible');
                });
                
                document.body.appendChild(toggle);
            }
        }
        
        addHeader() {
            const header = document.createElement('header');
            header.className = 'uac-header';
            header.innerHTML = `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    max-width: 1200px;
                    margin: 0 auto;
                ">
                    <div class="uac-logo" style="font-weight: bold;">
                        ${document.title || window.location.hostname}
                    </div>
                    <nav class="uac-header-nav">
                        <a href="/" style="margin: 0 10px;">Home</a>
                        <a href="#about" style="margin: 0 10px;">About</a>
                        <a href="#contact" style="margin: 0 10px;">Contact</a>
                    </nav>
                </div>
            `;
            
            header.style.cssText = `
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid #e5e7eb;
                position: sticky;
                top: 0;
                z-index: 100;
            `;
            
            document.body.insertBefore(header, document.body.firstChild);
        }
        
        addSidebar() {
            const sidebar = document.createElement('aside');
            sidebar.className = 'uac-sidebar uac-desktop-only';
            sidebar.innerHTML = `
                <div style="padding: 20px;">
                    <h3 style="margin-top: 0;">Quick Links</h3>
                    <nav style="margin-bottom: 20px;">
                        <a href="#top" style="display: block; padding: 8px 0;">Home</a>
                        <a href="#content" style="display: block; padding: 8px 0;">Content</a>
                        <a href="#footer" style="display: block; padding: 8px 0;">Footer</a>
                    </nav>
                    <div>
                        <button class="uac-theme-toggle" style="
                            width: 100%;
                            padding: 10px;
                            background: #3b82f6;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                        ">
                            Toggle Theme
                        </button>
                    </div>
                </div>
            `;
            
            sidebar.style.cssText = `
                position: fixed;
                left: 0;
                top: 0;
                bottom: 0;
                width: 250px;
                background: white;
                border-right: 1px solid #e5e7eb;
                overflow-y: auto;
                z-index: 90;
            `;
            
            document.body.appendChild(sidebar);
            
            // Adjust main content if needed
            const main = this.$('main') || this.$('.main-content') || this.$('article');
            if (main) {
                main.style.marginLeft = '260px';
            }
            
            // Theme toggle
            const themeBtn = this.$('.uac-theme-toggle', sidebar);
            if (themeBtn) {
                themeBtn.addEventListener('click', () => {
                    document.documentElement.classList.toggle('uac-dark-mode');
                    localStorage.setItem('uac-dark-mode', 
                        document.documentElement.classList.contains('uac-dark-mode').toString());
                });
            }
        }
        
        // ==================== PUBLIC API ====================
        
        toggleDarkMode(force) {
            if (typeof force === 'boolean') {
                if (force) {
                    document.documentElement.classList.add('uac-dark-mode');
                } else {
                    document.documentElement.classList.remove('uac-dark-mode');
                }
            } else {
                document.documentElement.classList.toggle('uac-dark-mode');
            }
            
            localStorage.setItem('uac-dark-mode', 
                document.documentElement.classList.contains('uac-dark-mode').toString());
            
            return document.documentElement.classList.contains('uac-dark-mode');
        }
        
        refresh() {
            this.detectEnvironment();
            this.applyEnhancements();
            this.log('Refreshed');
        }
        
        updateConfig(newConfig) {
            Object.assign(this.config, newConfig);
            this.refresh();
            this.log('Config updated');
        }
        
        getState() {
            return {
                initialized: this.initialized,
                config: { ...this.config },
                features: { ...this.features },
                isMobile: this.isMobile,
                isTablet: this.isTablet
            };
        }
        
        destroy() {
            // Stop observing
            if (this.observer) {
                this.observer.disconnect();
            }
            
            // Remove event listeners
            window.removeEventListener('resize', this.handleResize);
            window.removeEventListener('scroll', this.handleScroll);
            
            // Remove injected styles
            const styles = this.$$('style[id^="uac-"]');
            styles.forEach(style => style.remove());
            
            // Remove enhanced attributes
            this.$$('[data-uac]').forEach(el => {
                el.removeAttribute('data-uac');
                el.classList.remove('uac-enhanced', 'uac-btn-primary', 'uac-btn-danger', 
                                   'uac-btn-warning', 'uac-btn-secondary');
            });
            
            // Remove added elements
            this.$$('.uac-scroll-top, .uac-navigation, .uac-header, .uac-sidebar, .uac-nav-toggle')
                .forEach(el => el.remove());
            
            this.initialized = false;
            this.log('Destroyed');
        }
        
        // Helper method for smooth scrolling
        smoothScrollTo(target) {
            if ('scrollBehavior' in document.documentElement.style) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Use polyfill if setupSmoothScroll was called
                if (typeof this.smoothScrollTo === 'function') {
                    this.smoothScrollTo(target);
                } else {
                    target.scrollIntoView(true);
                }
            }
        }
    }
    
    // Auto-initialization
    function initializeUAC() {
        // Check if manual initialization is requested
        const manualInit = document.querySelector('[data-uac-manual]');
        
        // Check for configuration in global variable
        const userConfig = window.UAC_CONFIG || {};
        
        // Merge with sensible defaults
        const config = {
            debug: window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1',
            enhanceButtons: true,
            enhanceForms: true,
            enhanceImages: true,
            enhanceTables: true,
            enhanceLinks: true,
            lazyLoadImages: true,
            smoothScroll: true,
            scrollToTop: true,
            darkMode: 'auto',
            autoInit: !manualInit,
            ...userConfig
        };
        
        // Create instance
        const uac = new UniversalAutoConfig(config);
        
        // Store globally
        global.UniversalAutoConfig = UniversalAutoConfig; // Constructor
        global.UAC = uac; // Instance
        
        // Auto-initialize if configured
        if (config.autoInit) {
            uac.init();
        }
        
        return uac;
    }
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUAC);
    } else {
        initializeUAC();
    }
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = UniversalAutoConfig;
    }
    
    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return UniversalAutoConfig;
        });
    }
    
})(typeof globalThis !== 'undefined' ? globalThis : window);
