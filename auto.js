/**
 * Universal Auto-Config System v3.0
 * One Script for ANY Website - Zero Dependencies
 * Auto-detects, Auto-styles, Auto-enhances everything
 */

(function(global) {
    'use strict';
    
    // Prevent multiple initializations
    if (global.UniversalAutoConfig) {
        console.warn('⚠️ UniversalAutoConfig already loaded');
        return;
    }

    class UniversalAutoConfig {
        constructor(options = {}) {
            // Default configuration - Works for ANY site
            this.config = {
                // Core features
                autoStyle: options.autoStyle !== false,
                autoEnhance: options.autoEnhance !== false,
                autoOptimize: options.autoOptimize !== false,
                
                // UI components
                createHeader: options.createHeader === true, // Default: false (less invasive)
                createSidebar: options.createSidebar === true, // Default: false
                createNavigation: options.createNavigation === true, // Default: false
                createScrollTop: options.createScrollTop !== false,
                
                // Behavior
                darkMode: options.darkMode || 'auto', // 'auto', 'light', 'dark', 'system'
                responsive: options.responsive !== false,
                lazyLoad: options.lazyLoad !== false,
                formValidation: options.formValidation !== false,
                
                // Performance
                debug: options.debug || false,
                minify: options.minify !== false,
                version: '3.0'
            };
            
            // State
            this.initialized = false;
            this.isMobile = window.innerWidth <= 768;
            this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
            this.observedElements = new Set();
            this.features = {};
            
            // Bind methods for event listeners
            this.handleResize = this.handleResize.bind(this);
            this.handleScroll = this.handleScroll.bind(this);
            this.detectFeatures = this.detectFeatures.bind(this);
            
            this.log('🚀 Universal AutoConfig v' + this.config.version + ' initialized');
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
        
        // Generate unique ID
        generateId(prefix = 'uac') {
            return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        
        // Safe element query
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
        
        // ==================== CORE INITIALIZATION ====================
        
        init() {
            if (this.initialized) {
                this.warn('Already initialized');
                return this;
            }
            
            try {
                this.log('Starting initialization...');
                
                // Phase 1: Critical setup (always runs)
                this.injectEssentialCSS();
                this.setupViewport();
                this.detectFeatures();
                this.setupDarkMode();
                
                // Phase 2: UI Enhancement (configurable)
                if (this.config.autoStyle) {
                    this.enhanceUI();
                }
                
                // Phase 3: Performance optimization
                if (this.config.autoOptimize) {
                    this.optimizePerformance();
                }
                
                // Phase 4: Event system
                this.bindEvents();
                this.setupObservers();
                
                // Phase 5: Additional components (optional)
                this.addOptionalComponents();
                
                this.initialized = true;
                
                // Dispatch ready event
                setTimeout(() => {
                    document.dispatchEvent(new CustomEvent('uac:ready', {
                        detail: { 
                            version: this.config.version,
                            features: this.features,
                            config: this.config 
                        }
                    }));
                    this.log('✅ Ready! Enhanced', Object.keys(this.features).length, 'features');
                }, 100);
                
            } catch (error) {
                this.error('Init failed:', error);
            }
            
            return this;
        }
        
        // ==================== PHASE 1: CRITICAL SETUP ====================
        
        // Inject minimal essential CSS - Works everywhere
        injectEssentialCSS() {
            const styleId = 'uac-essential-styles';
            if (this.$(styleId)) return;
            
            const styles = `
                /* Universal AutoConfig Essential Styles */
                [data-uac-enhanced] {
                    transition: all 0.3s ease;
                }
                
                /* Button enhancements */
                button:not([data-uac-styled]),
                input[type="button"]:not([data-uac-styled]),
                input[type="submit"]:not([data-uac-styled]),
                .btn:not([data-uac-styled]) {
                    position: relative;
                    overflow: hidden;
                    border: none;
                    border-radius: 6px;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 1.4;
                    text-decoration: none;
                    display: inline-block;
                    text-align: center;
                    vertical-align: middle;
                    touch-action: manipulation;
                    user-select: none;
                    background-image: none;
                    transition: all 0.2s ease;
                    transform: translateZ(0);
                }
                
                button:hover:not(:disabled),
                input[type="button"]:hover:not(:disabled),
                input[type="submit"]:hover:not(:disabled),
                .btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                
                button:active:not(:disabled),
                input[type="button"]:active:not(:disabled),
                input[type="submit"]:active:not(:disabled),
                .btn:active:not(:disabled) {
                    transform: translateY(0);
                }
                
                /* Form enhancements */
                input:not([type="checkbox"]):not([type="radio"]):not([data-uac-styled]),
                textarea:not([data-uac-styled]),
                select:not([data-uac-styled]) {
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    padding: 10px 14px;
                    font-size: 14px;
                    line-height: 1.5;
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }
                
                input:focus:not([type="checkbox"]):not([type="radio"]),
                textarea:focus,
                select:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                /* Card enhancements */
                .card:not([data-uac-styled]),
                [class*="card"]:not([data-uac-styled]),
                article:not([data-uac-styled]),
                section:not([data-uac-styled]) > div:first-child:not([data-uac-styled]) {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                    transition: all 0.3s ease;
                }
                
                .card:hover:not([data-uac-styled]),
                [class*="card"]:hover:not([data-uac-styled]) {
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    border-color: #3b82f6;
                }
                
                /* Link enhancements */
                a:not([data-uac-styled]) {
                    text-decoration: none;
                    color: #3b82f6;
                    transition: color 0.2s ease;
                }
                
                a:hover:not([data-uac-styled]) {
                    color: #1d4ed8;
                    text-decoration: underline;
                }
                
                /* Responsive base */
                .uac-mobile-only { display: none !important; }
                .uac-desktop-only { display: block !important; }
                
                @media (max-width: 768px) {
                    .uac-mobile-only { display: block !important; }
                    .uac-desktop-only { display: none !important; }
                    
                    button, input, textarea, select {
                        font-size: 16px; /* Prevents iOS zoom */
                    }
                }
                
                /* Dark mode support */
                .uac-dark-mode {
                    background-color: #1a1a1a !important;
                    color: #f0f0f0 !important;
                }
                
                .uac-dark-mode input:not([type="checkbox"]):not([type="radio"]),
                .uac-dark-mode textarea,
                .uac-dark-mode select {
                    background-color: #2d2d2d;
                    border-color: #404040;
                    color: #f0f0f0;
                }
                
                .uac-dark-mode .card,
                .uac-dark-mode [class*="card"],
                .uac-dark-mode article {
                    background-color: #2d2d2d;
                    border-color: #404040;
                    color: #f0f0f0;
                }
                
                /* Scroll to top button */
                .uac-scroll-top {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: #3b82f6;
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
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                
                .uac-scroll-top.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .uac-scroll-top:hover {
                    background: #2563eb;
                    transform: translateY(-2px) scale(1.05);
                }
                
                /* Loading placeholder */
                .uac-loading {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: uac-loading 1.5s infinite;
                }
                
                @keyframes uac-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                
                /* Print optimization */
                @media print {
                    .uac-scroll-top,
                    .uac-mobile-only {
                        display: none !important;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = this.config.minify ? styles.replace(/\s+/g, ' ').trim() : styles;
            document.head.appendChild(style);
            
            this.log('Essential CSS injected');
        }
        
        // Ensure viewport meta exists
        setupViewport() {
            if (!this.$('meta[name="viewport"]')) {
                const meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=1, maximum-scale=5';
                document.head.insertBefore(meta, document.head.firstChild);
                this.log('Viewport meta added');
            }
        }
        
        // Detect website features
        detectFeatures() {
            this.features = {
                // Structure
                hasHeader: !!this.$('header, .header, [role="banner"]'),
                hasFooter: !!this.$('footer, .footer, [role="contentinfo"]'),
                hasNav: !!this.$('nav, .nav, .navbar, .navigation'),
                hasMain: !!this.$('main, .main, [role="main"]'),
                hasSidebar: !!this.$('aside, .sidebar, .side-nav'),
                
                // Content
                hasImages: this.$$('img').length > 0,
                hasVideos: this.$$('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length > 0,
                hasForms: this.$$('form').length > 0,
                hasButtons: this.$$('button, .btn, [role="button"]').length > 0,
                hasTables: this.$$('table').length > 0,
                hasLists: this.$$('ul, ol').length > 0,
                
                // Framework detection
                hasBootstrap: !!this.$('[class*="col-"], .container, .row'),
                hasTailwind: !!this.$('[class*="bg-"], [class*="text-"], [class*="p-"], [class*="m-"]'),
                hasjQuery: typeof jQuery !== 'undefined',
                hasReact: typeof React !== 'undefined',
                hasVue: typeof Vue !== 'undefined',
                
                // Technology
                hasWebFonts: this.$$('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]').length > 0,
                hasFontAwesome: !!this.$('link[href*="font-awesome"], link[href*="fontawesome"]'),
                
                // Analytics
                hasGoogleAnalytics: !!this.$('script[src*="google-analytics"], script[src*="gtag"], script[src*="googletagmanager"]'),
                hasFacebookPixel: !!this.$('script[src*="facebook.net"]'),
                
                // Performance
                hasLazyLoad: this.$$('[loading="lazy"], [data-src]').length > 0,
                hasWebP: this.$$('img[src*=".webp"], source[type="image/webp"]').length > 0
            };
            
            this.log('Detected features:', this.features);
        }
        
        // Setup dark mode based on config
        setupDarkMode() {
            if (this.config.darkMode === 'off') return;
            
            let darkMode = false;
            
            switch (this.config.darkMode) {
                case 'dark':
                    darkMode = true;
                    break;
                case 'light':
                    darkMode = false;
                    break;
                case 'system':
                    darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    break;
                case 'auto':
                default:
                    // Auto-detect based on time (6 PM to 6 AM)
                    const hour = new Date().getHours();
                    darkMode = hour >= 18 || hour < 6;
                    
                    // Also respect system preference
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        darkMode = true;
                    }
                    break;
            }
            
            if (darkMode) {
                document.documentElement.classList.add('uac-dark-mode');
                localStorage.setItem('uac-dark-mode', 'true');
            } else {
                document.documentElement.classList.remove('uac-dark-mode');
                localStorage.setItem('uac-dark-mode', 'false');
            }
            
            // Listen for system changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.config.darkMode === 'system' || this.config.darkMode === 'auto') {
                    if (e.matches) {
                        document.documentElement.classList.add('uac-dark-mode');
                    } else {
                        document.documentElement.classList.remove('uac-dark-mode');
                    }
                }
            });
        }
        
        // ==================== PHASE 2: UI ENHANCEMENT ====================
        
        enhanceUI() {
            this.log('Enhancing UI...');
            
            // Style all buttons
            this.enhanceButtons();
            
            // Enhance all forms
            if (this.config.formValidation) {
                this.enhanceForms();
            }
            
            // Enhance tables
            if (this.features.hasTables) {
                this.enhanceTables();
            }
            
            // Enhance images
            if (this.features.hasImages) {
                this.enhanceImages();
            }
            
            // Enhance links
            this.enhanceLinks();
            
            // Add loading states
            this.addLoadingStates();
            
            this.log('UI enhancement complete');
        }
        
        enhanceButtons() {
            this.$$('button, input[type="button"], input[type="submit"], .btn').forEach(btn => {
                if (btn.hasAttribute('data-uac-styled')) return;
                
                // Auto-detect button type
                const text = btn.textContent.toLowerCase() || btn.value.toLowerCase() || '';
                const isPrimary = text.includes('save') || text.includes('submit') || 
                                 text.includes('confirm') || text.includes('buy') || 
                                 text.includes('order') || text.includes('sign up');
                const isDanger = text.includes('delete') || text.includes('remove') || 
                                text.includes('cancel') || text.includes('reset');
                const isWarning = text.includes('edit') || text.includes('update') || 
                                 text.includes('warning') || text.includes('caution');
                
                // Add appropriate classes
                if (isPrimary) {
                    btn.classList.add('uac-btn-primary');
                    btn.style.backgroundColor = '#3b82f6';
                    btn.style.color = 'white';
                } else if (isDanger) {
                    btn.classList.add('uac-btn-danger');
                    btn.style.backgroundColor = '#ef4444';
                    btn.style.color = 'white';
                } else if (isWarning) {
                    btn.classList.add('uac-btn-warning');
                    btn.style.backgroundColor = '#f59e0b';
                    btn.style.color = 'white';
                } else {
                    btn.classList.add('uac-btn-secondary');
                    btn.style.backgroundColor = '#6b7280';
                    btn.style.color = 'white';
                }
                
                // Mark as styled
                btn.setAttribute('data-uac-styled', 'true');
                btn.classList.add('uac-enhanced');
            });
        }
        
        enhanceForms() {
            this.$$('form').forEach(form => {
                if (form.hasAttribute('data-uac-enhanced')) return;
                
                form.setAttribute('data-uac-enhanced', 'true');
                
                // Auto labels
                this.$$('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea, select', form)
                    .forEach(field => {
                        if (!field.id) {
                            field.id = this.generateId('field');
                        }
                        
                        if (!this.$(`label[for="${field.id}"]`, form) && field.placeholder) {
                            const label = document.createElement('label');
                            label.htmlFor = field.id;
                            label.textContent = field.placeholder;
                            label.style.cssText = 'display: block; margin-bottom: 5px; font-weight: 500;';
                            field.parentNode.insertBefore(label, field);
                        }
                    });
                
                // Auto validation
                form.addEventListener('submit', (e) => {
                    if (!this.validateForm(form)) {
                        e.preventDefault();
                        this.showFormError(form);
                    }
                });
            });
        }
        
        validateForm(form) {
            let isValid = true;
            
            this.$$('[required]', form).forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    
                    field.addEventListener('input', () => {
                        if (field.value.trim()) {
                            field.style.borderColor = '';
                            field.style.boxShadow = '';
                        }
                    });
                }
            });
            
            return isValid;
        }
        
        showFormError(form) {
            // Simple inline error
            const errorEl = document.createElement('div');
            errorEl.innerHTML = 'Please fill all required fields';
            errorEl.style.cssText = `
                background: #fef2f2;
                color: #dc2626;
                padding: 10px;
                border-radius: 6px;
                margin: 10px 0;
                border: 1px solid #fca5a5;
                font-size: 14px;
            `;
            
            form.prepend(errorEl);
            
            // Auto remove
            setTimeout(() => errorEl.remove(), 5000);
        }
        
        enhanceTables() {
            this.$$('table').forEach(table => {
                if (table.hasAttribute('data-uac-enhanced')) return;
                
                table.setAttribute('data-uac-enhanced', 'true');
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                
                // Add basic styling
                this.$$('th', table).forEach(th => {
                    th.style.padding = '12px';
                    th.style.textAlign = 'left';
                    th.style.borderBottom = '2px solid #e5e7eb';
                    th.style.backgroundColor = '#f9fafb';
                });
                
                this.$$('td', table).forEach(td => {
                    td.style.padding = '12px';
                    td.style.borderBottom = '1px solid #e5e7eb';
                });
                
                // Striped rows
                this.$$('tr', table).forEach((tr, index) => {
                    if (index % 2 === 1) {
                        tr.style.backgroundColor = '#f9fafb';
                    }
                });
            });
        }
        
        enhanceImages() {
            this.$$('img').forEach(img => {
                if (img.hasAttribute('data-uac-enhanced')) return;
                
                // Add alt if missing
                if (!img.alt && !img.hasAttribute('aria-hidden')) {
                    const alt = img.src.split('/').pop().split('.').shift() || 'Image';
                    img.alt = alt;
                }
                
                // Make responsive
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                
                // Add loading if not present
                if (!img.loading && !img.hasAttribute('data-src')) {
                    const rect = img.getBoundingClientRect();
                    if (rect.top > window.innerHeight * 1.5) {
                        img.loading = 'lazy';
                    }
                }
                
                img.setAttribute('data-uac-enhanced', 'true');
            });
        }
        
        enhanceLinks() {
            this.$$('a[href^="#"]').forEach(anchor => {
                if (anchor.hasAttribute('data-uac-enhanced')) return;
                
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId.startsWith('#')) {
                        const target = this.$(targetId);
                        if (target) {
                            e.preventDefault();
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                });
                
                anchor.setAttribute('data-uac-enhanced', 'true');
            });
        }
        
        addLoadingStates() {
            // Add loading state to buttons during click
            this.$$('button, input[type="submit"]').forEach(btn => {
                btn.addEventListener('click', function() {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<span class="uac-loading" style="display:inline-block;width:20px;height:20px;border-radius:50%;margin-right:8px;"></span> ' + originalText;
                    this.disabled = true;
                    
                    // Reset after 5 seconds max
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 5000);
                });
            });
        }
        
        // ==================== PHASE 3: PERFORMANCE OPTIMIZATION ====================
        
        optimizePerformance() {
            this.log('Optimizing performance...');
            
            // Lazy load images
            if (this.config.lazyLoad) {
                this.setupLazyLoading();
            }
            
            // Defer non-critical scripts
            this.deferScripts();
            
            // Optimize animations
            this.optimizeAnimations();
            
            // Prevent layout shifts
            this.preventLayoutShifts();
            
            this.log('Performance optimization complete');
        }
        
        setupLazyLoading() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src && !img.hasAttribute('data-loaded')) {
                            img.src = src;
                            img.setAttribute('data-loaded', 'true');
                            img.classList.add('uac-loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            }, { rootMargin: '50px' });
            
            this.$$('img[data-src]').forEach(img => observer.observe(img));
        }
        
        deferScripts() {
            this.$$('script:not([defer]):not([async]):not([type="module"])').forEach((script, index) => {
                // Don't defer first few scripts or critical ones
                if (index > 2 && !script.hasAttribute('data-critical')) {
                    script.defer = true;
                }
            });
        }
        
        optimizeAnimations() {
            // Respect reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.classList.add('uac-reduced-motion');
            }
        }
        
        preventLayoutShifts() {
            // Reserve space for images without dimensions
            this.$$('img:not([width]):not([height])').forEach(img => {
                if (!img.style.width && !img.style.height) {
                    img.style.width = '100%';
                    img.style.height = 'auto';
                    img.style.minHeight = '50px';
                }
            });
        }
        
        // ==================== PHASE 4: EVENT SYSTEM ====================
        
        bindEvents() {
            // Window events
            window.addEventListener('resize', this.handleResize);
            window.addEventListener('scroll', this.handleScroll);
            
            // Form events
            if (this.features.hasForms) {
                document.addEventListener('submit', (e) => {
                    if (e.target.tagName === 'FORM' && this.config.formValidation) {
                        // Already handled in enhanceForms
                    }
                });
            }
            
            // Click outside handlers
            document.addEventListener('click', (e) => {
                // Handle clicks on enhanced elements
                if (e.target.hasAttribute('data-uac-enhanced')) {
                    // Custom click handling if needed
                }
            });
            
            this.log('Events bound');
        }
        
        handleResize() {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
            
            if (wasMobile !== this.isMobile) {
                document.documentElement.classList.toggle('uac-is-mobile', this.isMobile);
                document.documentElement.classList.toggle('uac-is-desktop', !this.isMobile);
                
                // Dispatch resize event
                document.dispatchEvent(new CustomEvent('uac:resize', {
                    detail: { isMobile: this.isMobile, isTablet: this.isTablet }
                }));
            }
        }
        
        handleScroll() {
            // Scroll to top button visibility
            const scrollTopBtn = this.$('.uac-scroll-top');
            if (scrollTopBtn) {
                if (window.pageYOffset > 300) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            }
            
            // Parallax effects (optional)
            if (this.config.autoEnhance) {
                this.$$('[data-uac-parallax]').forEach(el => {
                    const speed = parseFloat(el.getAttribute('data-uac-parallax')) || 0.5;
                    const yPos = -(window.pageYOffset * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
            }
        }
        
        setupObservers() {
            // Observe DOM changes for new elements
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // Auto-enhance new elements
                            if (this.config.autoStyle) {
                                this.enhanceNewElement(node);
                            }
                            
                            // Add to feature detection
                            this.detectFeatures();
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            this.observer = observer;
            this.log('DOM observer started');
        }
        
        enhanceNewElement(element) {
            // Enhance buttons
            if (element.tagName === 'BUTTON' || element.classList.contains('btn')) {
                this.enhanceButtons();
            }
            
            // Enhance forms
            if (element.tagName === 'FORM' || element.querySelector('form')) {
                this.enhanceForms();
            }
            
            // Enhance images
            if (element.tagName === 'IMG' || element.querySelector('img')) {
                this.enhanceImages();
            }
            
            // Recursive check for children
            if (element.children) {
                Array.from(element.children).forEach(child => this.enhanceNewElement(child));
            }
        }
        
        // ==================== PHASE 5: OPTIONAL COMPONENTS ====================
        
        addOptionalComponents() {
            // Scroll to top button
            if (this.config.createScrollTop) {
                this.addScrollToTop();
            }
            
            // Header (optional)
            if (this.config.createHeader && !this.features.hasHeader) {
                this.addHeader();
            }
            
            // Navigation (optional)
            if (this.config.createNavigation && !this.features.hasNav) {
                this.addNavigation();
            }
            
            // Sidebar (optional)
            if (this.config.createSidebar && !this.features.hasSidebar) {
                this.addSidebar();
            }
        }
        
        addScrollToTop() {
            if (this.$('.uac-scroll-top')) return;
            
            const btn = document.createElement('button');
            btn.className = 'uac-scroll-top';
            btn.innerHTML = '↑';
            btn.title = 'Scroll to top';
            btn.setAttribute('aria-label', 'Scroll to top');
            
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            document.body.appendChild(btn);
        }
        
        addHeader() {
            const header = document.createElement('header');
            header.className = 'uac-header';
            header.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; max-width: 1200px; margin: 0 auto; width: 100%;">
                    <div class="uac-logo" style="font-weight: bold; font-size: 1.2rem;">
                        ${document.title || 'Website'}
                    </div>
                    <button class="uac-menu-toggle uac-mobile-only" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">
                        ☰
                    </button>
                </div>
            `;
            
            header.style.cssText = `
                background: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                position: sticky;
                top: 0;
                z-index: 1000;
            `;
            
            document.body.prepend(header);
            
            // Menu toggle for mobile
            const toggle = this.$('.uac-menu-toggle');
            if (toggle) {
                toggle.addEventListener('click', () => {
                    const nav = this.$('.uac-navigation');
                    if (nav) {
                        nav.classList.toggle('visible');
                    }
                });
            }
        }
        
        addNavigation() {
            // Create from headings
            const headings = this.$$('h1, h2, h3');
            if (headings.length < 2) return;
            
            const nav = document.createElement('nav');
            nav.className = 'uac-navigation uac-mobile-only';
            nav.innerHTML = '<ul style="list-style: none; padding: 0; margin: 0;"></ul>';
            
            headings.forEach((heading, index) => {
                if (!heading.id) {
                    heading.id = 'uac-heading-' + index;
                }
                
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#' + heading.id;
                a.textContent = heading.textContent.substring(0, 30);
                a.style.cssText = 'display: block; padding: 8px 12px; color: #374151; text-decoration: none;';
                
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    nav.classList.remove('visible');
                });
                
                li.appendChild(a);
                nav.querySelector('ul').appendChild(li);
            });
            
            nav.style.cssText = `
                position: fixed;
                top: 60px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                max-height: 70vh;
                overflow-y: auto;
                display: none;
                z-index: 999;
            `;
            
            nav.classList.add('visible');
            document.body.appendChild(nav);
        }
        
        addSidebar() {
            const sidebar = document.createElement('aside');
            sidebar.className = 'uac-sidebar uac-desktop-only';
            sidebar.innerHTML = `
                <div style="padding: 20px;">
                    <h3 style="margin-top: 0;">Quick Links</h3>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li><a href="#top">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <div style="margin-top: 20px;">
                        <button class="uac-theme-toggle" style="width: 100%; padding: 10px;">
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
                box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                z-index: 900;
                overflow-y: auto;
            `;
            
            // Adjust main content
            const main = this.$('main, .main, [role="main"]') || this.$('body > *:not(header):not(.uac-header):not(.uac-sidebar)');
            if (main) {
                main.style.marginLeft = '270px';
            }
            
            document.body.appendChild(sidebar);
            
            // Theme toggle
            const themeBtn = this.$('.uac-theme-toggle');
            if (themeBtn) {
                themeBtn.addEventListener('click', () => {
                    document.documentElement.classList.toggle('uac-dark-mode');
                });
            }
        }
        
        // ==================== PUBLIC API ====================
        
        // Toggle dark mode
        toggleDarkMode() {
            document.documentElement.classList.toggle('uac-dark-mode');
            const isDark = document.documentElement.classList.contains('uac-dark-mode');
            localStorage.setItem('uac-dark-mode', isDark.toString());
        }
        
        // Refresh enhancements
        refresh() {
            this.detectFeatures();
            if (this.config.autoStyle) {
                this.enhanceUI();
            }
        }
        
        // Get configuration
        getConfig() {
            return { ...this.config };
        }
        
        // Update configuration
        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            this.refresh();
        }
        
        // Destroy/cleanup
        destroy() {
            if (this.observer) {
                this.observer.disconnect();
            }
            
            window.removeEventListener('resize', this.handleResize);
            window.removeEventListener('scroll', this.handleScroll);
            
            // Remove injected styles
            const style = this.$('#uac-essential-styles');
            if (style) style.remove();
            
            // Remove enhanced attributes
            this.$$('[data-uac-enhanced], [data-uac-styled]').forEach(el => {
                el.removeAttribute('data-uac-enhanced');
                el.removeAttribute('data-uac-styled');
            });
            
            this.initialized = false;
            this.log('Destroyed');
        }
    }
    
    // Auto-initialize with default options
    function autoInitialize() {
        // Check if we should auto-init
        const shouldAutoInit = !document.querySelector('[data-uac-manual]');
        
        if (shouldAutoInit) {
            // Create instance with sensible defaults
            const uac = new UniversalAutoConfig({
                debug: window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1',
                autoStyle: true,
                autoEnhance: true,
                autoOptimize: true,
                createScrollTop: true,
                darkMode: 'auto',
                responsive: true,
                lazyLoad: true,
                formValidation: true,
                minify: true
            });
            
            // Start initialization
            uac.init();
            
            // Expose globally
            global.UniversalAutoConfig = uac;
            global.UAC = uac; // Short alias
            
            // Add to window for easy access
            if (!global.uac) {
                global.uac = uac;
            }
        }
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInitialize);
    } else {
        autoInitialize();
    }
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = UniversalAutoConfig;
    }
    
})(typeof globalThis !== 'undefined' ? globalThis : window);
