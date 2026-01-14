/**
 * NEVOX Auto-Config System v2.0
 * No AI - Pure JavaScript Auto Configuration
 */

class AutoConfigSystem {
    constructor() {
        this.version = '2.0';
        this.features = {};
        this.initialized = false;
    }

    // Initialize everything automatically
    autoInit() {
        console.log('🚀 AutoConfig Initializing...');
        
        // Auto-detect and configure
        this.autoDetectFeatures();
        this.autoConfigureUI();
        this.autoOptimizePerformance();
        this.autoBindEvents();
        this.autoLoadComponents();
        
        this.initialized = true;
        console.log('✅ AutoConfig Ready - No AI Required');
    }

    // ১. স্বয়ংক্রিয় ফিচার ডিটেক্ট
    autoDetectFeatures() {
        // Detect existing features
        this.features = {
            hasHeader: !!document.querySelector('header, .header, .nvx-header'),
            hasSidebar: !!document.querySelector('aside, .sidebar, .nvx-sidebar'),
            hasForms: document.querySelectorAll('form').length > 0,
            hasButtons: document.querySelectorAll('button, .btn').length > 0,
            hasImages: document.querySelectorAll('img').length > 0,
            hasVideos: document.querySelectorAll('video, iframe').length > 0,
            hasNavigation: document.querySelectorAll('nav, .nav, .navbar').length > 0
        };
    }

    // ২. স্বয়ংক্রিয় UI কনফিগার
    autoConfigureUI() {
        // Auto-add classes to elements
        this.autoStyleButtons();
        this.autoStyleForms();
        this.autoStyleCards();
        this.autoAddResponsive();
    }

    autoStyleButtons() {
        document.querySelectorAll('button:not([data-styled])').forEach(button => {
            // Auto-detect button type and add appropriate class
            const text = button.textContent.toLowerCase();
            
            if (text.includes('save') || text.includes('submit') || text.includes('confirm')) {
                button.classList.add('btn-primary', 'nvx-btn');
            } else if (text.includes('cancel') || text.includes('delete') || text.includes('remove')) {
                button.classList.add('btn-danger', 'nvx-btn');
            } else if (text.includes('edit') || text.includes('update') || text.includes('modify')) {
                button.classList.add('btn-warning', 'nvx-btn');
            } else {
                button.classList.add('btn-secondary', 'nvx-btn');
            }
            
            button.setAttribute('data-styled', 'true');
            
            // Auto-add hover effect
            button.style.transition = 'all 0.3s ease';
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
        });
    }

    autoStyleForms() {
        document.querySelectorAll('form:not([data-enhanced])').forEach(form => {
            form.setAttribute('data-enhanced', 'true');
            
            // Auto-add labels if missing
            form.querySelectorAll('input:not([type="hidden"]), textarea, select').forEach(input => {
                if (!input.id) {
                    input.id = 'input-' + Math.random().toString(36).substr(2, 9);
                }
                
                // Check if label exists
                const label = form.querySelector(`label[for="${input.id}"]`);
                if (!label && input.placeholder) {
                    const newLabel = document.createElement('label');
                    newLabel.htmlFor = input.id;
                    newLabel.textContent = input.placeholder;
                    newLabel.style.display = 'block';
                    newLabel.style.marginBottom = '5px';
                    newLabel.style.fontWeight = '500';
                    input.parentNode.insertBefore(newLabel, input);
                }
            });
            
            // Auto-form validation
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showFormErrors(form);
                }
            });
        });
    }

    // ৩. ফর্ম ভ্যালিডেশন
    validateForm(form) {
        let isValid = true;
        const errors = [];
        
        form.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                errors.push({
                    field: field.name || field.id,
                    message: 'This field is required'
                });
                
                // Highlight error
                field.style.borderColor = '#ef4444';
                field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                
                // Auto-remove error style
                field.addEventListener('input', () => {
                    field.style.borderColor = '';
                    field.style.boxShadow = '';
                });
            }
        });
        
        return isValid;
    }

    // ৪. স্বয়ংক্রিয় ইভেন্ট বাইন্ডিং
    autoBindEvents() {
        // Auto-bind click events for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Auto-bind modal triggers
        document.querySelectorAll('[data-toggle="modal"]').forEach(trigger => {
            const modalId = trigger.getAttribute('data-target');
            if (modalId) {
                trigger.addEventListener('click', () => {
                    this.toggleModal(modalId);
                });
            }
        });

        // Auto-toggle mobile menu
        document.querySelectorAll('[data-toggle="menu"]').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const menuId = toggle.getAttribute('data-target') || 'main-menu';
                this.toggleMobileMenu(menuId);
            });
        });
    }

    // ৫. স্বয়ংক্রিয় লোড কম্পোনেন্টস
    autoLoadComponents() {
        // Auto-load missing components
        if (this.features.hasHeader && !document.querySelector('.nvx-header')) {
            this.loadHeader();
        }
        
        if (this.features.hasSidebar && !document.querySelector('.nvx-sidebar')) {
            this.loadSidebar();
        }
        
        // Auto-add missing navigation
        if (!this.features.hasNavigation) {
            this.autoCreateNavigation();
        }
    }

    loadHeader() {
        const header = document.querySelector('header') || document.createElement('header');
        if (!header.classList.contains('nvx-header')) {
            header.classList.add('nvx-header', 'glass-panel');
            
            // Auto-create logo if missing
            if (!header.querySelector('.logo')) {
                const logo = document.createElement('div');
                logo.className = 'logo';
                logo.innerHTML = '<i class="fas fa-rocket"></i> <span>NEVOX</span>';
                header.prepend(logo);
            }
            
            // Auto-create search if missing
            if (!header.querySelector('.search')) {
                const search = document.createElement('div');
                search.className = 'search glass-panel';
                search.innerHTML = `
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search...">
                `;
                header.appendChild(search);
            }
        }
    }

    autoCreateNavigation() {
        // Find main content sections
        const sections = document.querySelectorAll('section, main > div, [data-section]');
        if (sections.length > 3) {
            const nav = document.createElement('nav');
            nav.className = 'auto-nav glass-panel';
            nav.innerHTML = '<ul></ul>';
            
            sections.forEach((section, index) => {
                const title = section.getAttribute('data-title') || 
                             section.querySelector('h1, h2, h3')?.textContent || 
                             `Section ${index + 1}`;
                
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#section-${index}`;
                a.textContent = title;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    section.scrollIntoView({ behavior: 'smooth' });
                });
                
                li.appendChild(a);
                nav.querySelector('ul').appendChild(li);
            });
            
            document.body.prepend(nav);
        }
    }

    // ৬. মোবাইল মেনু সিস্টেম
    toggleMobileMenu(menuId) {
        const menu = document.getElementById(menuId) || document.querySelector('.mobile-menu');
        if (menu) {
            menu.classList.toggle('active');
            
            // Auto-create overlay
            let overlay = document.querySelector('.menu-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'menu-overlay';
                overlay.addEventListener('click', () => {
                    menu.classList.remove('active');
                    overlay.remove();
                });
                document.body.appendChild(overlay);
            }
            
            if (menu.classList.contains('active')) {
                overlay.style.display = 'block';
            } else {
                overlay.remove();
            }
        }
    }

    // ৭. মডাল সিস্টেম
    toggleModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.toggle('active');
            
            // Auto-create backdrop
            let backdrop = document.querySelector('.modal-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop';
                backdrop.addEventListener('click', () => {
                    modal.classList.remove('active');
                    backdrop.remove();
                });
                document.body.appendChild(backdrop);
            }
            
            if (modal.classList.contains('active')) {
                backdrop.style.display = 'block';
                document.body.style.overflow = 'hidden';
            } else {
                backdrop.remove();
                document.body.style.overflow = '';
            }
        }
    }

    // ৮. স্বয়ংক্রিয় পারফরম্যান্স অপ্টিমাইজেশন
    autoOptimizePerformance() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Defer non-critical scripts
        this.deferScripts();
        
        // Optimize animations
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img:not([data-loaded])');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src') || img.src;
                    
                    if (src) {
                        img.src = src;
                        img.setAttribute('data-loaded', 'true');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '50px' });
        
        images.forEach(img => observer.observe(img));
    }

    // ৯. নতুন ফিচার/বাটন স্বয়ংক্রিয় কনফিগার
    autoConfigureNewElements() {
        // Watch for new elements added to DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // Auto-style new buttons
                        if (node.tagName === 'BUTTON' || node.classList?.contains('btn')) {
                            this.autoStyleButtons();
                        }
                        
                        // Auto-enhance new forms
                        if (node.tagName === 'FORM' || node.querySelector?.('form')) {
                            this.autoStyleForms();
                        }
                        
                        // Auto-detect new features
                        this.autoDetectFeatures();
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ১০. শুরু করুন সবকিছু
    start() {
        this.autoInit();
        this.autoConfigureNewElements();
        
        // Make available globally
        window.AutoConfig = this;
        
        // Dispatch ready event
        document.dispatchEvent(new Event('autoconfig-ready'));
        
        return this;
    }
}

// স্বয়ংক্রিয় শুরু - কোন ম্যানুয়াল কল দরকার নেই
document.addEventListener('DOMContentLoaded', () => {
    const autoConfig = new AutoConfigSystem();
    autoConfig.start();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoConfigSystem;
}
