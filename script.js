/* 
File Name: script.js
Purpose: Core interactive logic for the Foxwell Games website.
Features: State management, theme application, dynamic accordion physics, real-time CMD parsing, lightbox visualization, and mail routing.
Owner: Foxwell Collective Interactive (Foxwell Games)
Copyright: All rights reserved. Codes, IPs, contents, and studio materials are strictly protected under international copyright and intellectual property laws.
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // Screens
    const deviceScreen = document.getElementById('device-screen');
    const setupScreen = document.getElementById('setup-screen');
    const termsScreen = document.getElementById('terms-screen');
    const mainSite = document.getElementById('main-site');

    // Device Selection
    const deviceButtons = document.querySelectorAll('.device-btn');

    // Setup Options
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const userColorInput = document.getElementById('user-color');
    const settingsColorInput = document.getElementById('settings-color');
    const userGlowInput = document.getElementById('user-glow');
    const settingsGlowInput = document.getElementById('settings-glow');
    const btnSetupConfirm = document.getElementById('btn-setup-confirm');

    // Terms
    const chkAcceptTerms = document.getElementById('chk-accept-terms');
    const btnEnterSite = document.getElementById('btn-enter-site');

    // CMD
    const cmdInput = document.getElementById('cmd-input');
    const cmdSuggestions = document.getElementById('cmd-suggestions');
    const cmdPrefixDisplay = document.getElementById('cmd-prefix-display');
    
    // Accordions
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Lightbox
    const lightboxOverlay = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-img');

    // Contact Form
    const subjectSelect = document.getElementById('contact-subject');
    const groupOtherSubject = document.getElementById('group-other-subject');
    const btnSendEmail = document.getElementById('btn-send-email');

    // --- State Variables ---
    let root = document.documentElement;

    // --- 0. Device Selection Logic ---
    if (deviceButtons.length > 0) {
        deviceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedDevice = btn.getAttribute('data-device') || btn.dataset.device;
                if (selectedDevice) {
                    document.body.setAttribute('data-device', selectedDevice);
                }
                if (deviceScreen) {
                    deviceScreen.classList.remove('active');
                }
                if (setupScreen) {
                    setupScreen.classList.add('active');
                }
            });
        });
    }

    // --- 1. Setup Screen Logic ---
    function applyColor(color) {
        root.style.setProperty('--accent-color', color);
        if (userColorInput) userColorInput.value = color;
        if (settingsColorInput) settingsColorInput.value = color;
        
        colorSwatches.forEach(swatch => {
            if (swatch.dataset.color.toLowerCase() === color.toLowerCase()) {
                swatch.classList.add('selected');
            } else {
                swatch.classList.remove('selected');
            }
        });
    }

    function applyGlow(isGlowing) {
        const glowValue = isGlowing ? '1' : '0';
        root.style.setProperty('--glow-opacity', glowValue);
        if (userGlowInput) userGlowInput.checked = isGlowing;
        if (settingsGlowInput) settingsGlowInput.checked = isGlowing;
    }

    if (colorSwatches.length > 0) {
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                applyColor(swatch.dataset.color);
            });
        });
    }

    if (userColorInput) userColorInput.addEventListener('input', (e) => applyColor(e.target.value));
    if (settingsColorInput) settingsColorInput.addEventListener('input', (e) => applyColor(e.target.value));

    if (userGlowInput) userGlowInput.addEventListener('change', (e) => applyGlow(e.target.checked));
    if (settingsGlowInput) settingsGlowInput.addEventListener('change', (e) => applyGlow(e.target.checked));

    if (btnSetupConfirm) {
        btnSetupConfirm.addEventListener('click', () => {
            if (setupScreen) setupScreen.classList.remove('active');
            if (termsScreen) termsScreen.classList.add('active');
        });
    }

    // --- 2. Terms of Service Logic ---
    if (chkAcceptTerms) {
        chkAcceptTerms.addEventListener('change', (e) => {
            if (e.target.checked) {
                btnEnterSite.classList.remove('disabled');
            } else {
                btnEnterSite.classList.add('disabled');
            }
        });
    }

    if (btnEnterSite) {
        btnEnterSite.addEventListener('click', () => {
            if (!chkAcceptTerms.checked) return;
            if (termsScreen) termsScreen.classList.remove('active');
            if (mainSite) mainSite.classList.add('active');
            
            // Focus CMD upon entry
            setTimeout(() => {
                if (cmdInput) cmdInput.focus();
            }, 500);
        });
    }

    // --- 3. Accordion & Nested Tabs Logic (Smart Toggle & Height Calculation) ---
    function updateParentHeights(contentElement) {
        let parentContent = contentElement.parentElement.closest('.accordion-content');
        if (parentContent) {
            parentContent.style.maxHeight = 'none';
            let recalculatedHeight = parentContent.scrollHeight;
            parentContent.style.maxHeight = recalculatedHeight + "px";
            updateParentHeights(parentContent);
        }
    }

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            e.stopPropagation(); 
            
            const content = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            const parentAccordion = this.closest('.accordion');
            if (parentAccordion && parentAccordion.classList.contains('main-accordion')) {
                const siblingHeaders = parentAccordion.querySelectorAll(':scope > .accordion-item > .accordion-header');
                siblingHeaders.forEach(sibHeader => {
                    if (sibHeader !== this && sibHeader.getAttribute('aria-expanded') === 'true') {
                        sibHeader.setAttribute('aria-expanded', 'false');
                        sibHeader.nextElementSibling.style.maxHeight = null;
                    }
                });
            } else {
                // Intelligent nested accordion refinement: automatically close other open nested tabs within the same parent block
                const parentContentBlock = this.closest('.content-padding') || this.closest('.accordion-content');
                if (parentContentBlock) {
                    const siblingNestedHeaders = parentContentBlock.querySelectorAll('.nested-header');
                    siblingNestedHeaders.forEach(sibHeader => {
                        if (sibHeader !== this && sibHeader.getAttribute('aria-expanded') === 'true') {
                            sibHeader.setAttribute('aria-expanded', 'false');
                            sibHeader.nextElementSibling.style.maxHeight = null;
                        }
                    });
                }
            }
            
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
            } else {
                this.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + "px";
            }
            
            setTimeout(() => {
                updateParentHeights(content);
            }, 50);
        });
    });

    function openTabByKeyword(keyword) {
        const items = document.querySelectorAll('.accordion-item');
        items.forEach(item => {
            const keys = item.dataset.keyword;
            if (keys && keys.includes(keyword)) {
                const header = item.querySelector(':scope > .accordion-header');
                const content = item.querySelector(':scope > .accordion-content');
                if (header && content && header.getAttribute('aria-expanded') === 'false') {
                    header.click();
                }
                
                let parentItem = item.parentElement.closest('.accordion-item');
                while (parentItem) {
                    const parentHeader = parentItem.querySelector(':scope > .accordion-header');
                    if (parentHeader && parentHeader.getAttribute('aria-expanded') === 'false') {
                        parentHeader.click();
                    }
                    parentItem = parentItem.parentElement.closest('.accordion-item');
                }
                
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        });
    }

    // --- 4. CMD Terminal Logic (Enhanced Parsing & Suggestions) ---
    if (cmdInput) {
        cmdInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase().trim();
            cmdSuggestions.innerHTML = '';
            
            const availableKeywords = ['home', 'projects', 'blogs', 'curiosities', 'settings', 'contact', 'pokspokee', 'encounter', 'everlight'];
            
            if (val.length > 0) {
                cmdSuggestions.classList.remove('hidden');
                
                const matchedKeywords = availableKeywords.filter(k => k.includes(val));
                
                if (matchedKeywords.length > 0) {
                    matchedKeywords.forEach(keyword => {
                        const suggestionDiv = document.createElement('div');
                        suggestionDiv.classList.add('cmd-suggestion');
                        const capitalizedWord = keyword.charAt(0).toUpperCase() + keyword.slice(1);
                        suggestionDiv.textContent = capitalizedWord;
                        
                        suggestionDiv.addEventListener('click', () => {
                            cmdPrefixDisplay.textContent = `CMD> ${capitalizedWord}>`;
                            cmdInput.value = '';
                            cmdSuggestions.classList.add('hidden');
                            openTabByKeyword(keyword);
                        });
                        
                        cmdSuggestions.appendChild(suggestionDiv);
                    });
                } else {
                    const noResultDiv = document.createElement('div');
                    noResultDiv.classList.add('cmd-suggestion');
                    noResultDiv.textContent = 'Command not found';
                    cmdSuggestions.appendChild(noResultDiv);
                }
                
            } else {
                cmdSuggestions.classList.add('hidden');
                cmdPrefixDisplay.textContent = 'CMD>';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (cmdSuggestions && !e.target.closest('.cmd-terminal')) {
            cmdSuggestions.classList.add('hidden');
        }
    });

    // --- 5. Lightbox Logic ---
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            if (lightboxImg) lightboxImg.src = img.src;
            if (lightboxCaption) lightboxCaption.textContent = "You are currently viewing the expanded image.";
            if (lightboxOverlay) lightboxOverlay.setAttribute('aria-hidden', 'false');
        });
    });

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', () => {
            if (lightboxOverlay) lightboxOverlay.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                if (lightboxImg) lightboxImg.src = '';
            }, 300);
        });
    }

    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                lightboxCloseBtn.click();
            }
        });
    }

    // --- 6. Contact Form Logic ---
    if (subjectSelect) {
        subjectSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Other') {
                if (groupOtherSubject) groupOtherSubject.classList.remove('hidden');
            } else {
                if (groupOtherSubject) groupOtherSubject.classList.add('hidden');
            }
            
            setTimeout(() => {
                updateParentHeights(subjectSelect.closest('.accordion-content'));
            }, 50);
        });
    }

    if (btnSendEmail) {
        btnSendEmail.addEventListener('click', () => {
            const nameEl = document.getElementById('contact-name');
            const otherSubjectEl = document.getElementById('contact-other-subject');
            const bodyEl = document.getElementById('contact-body');

            const name = nameEl ? nameEl.value.trim() : '';
            const subjectVal = subjectSelect ? subjectSelect.value : '';
            const otherSubject = otherSubjectEl ? otherSubjectEl.value.trim() : '';
            const body = bodyEl ? bodyEl.value.trim() : '';
            
            let finalSubject = subjectVal === 'Other' && otherSubject !== '' ? otherSubject : subjectVal;
            
            let messageBody = "";
            
            if (name) {
                messageBody += `Hello, my name is ${name}.%0D%0A%0D%0A`;
            }
            
            messageBody += body.replace(/\n/g, '%0D%0A');
            
            const targetEmail = "foxwellcollective.contact@gmail.com";
            const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(finalSubject)}&body=${messageBody}`;
            
            window.location.href = mailtoLink;
        });
    }

    // --- Boot Initialization ---
    applyColor('#007aff');
});

/* 
Terms of Use: The codes provided herein may be modified strictly for personal use. They cannot be shared, distributed, or presented illegally as if they were the property of someone else, in accordance with the accepted terms of Foxwell Collective Interactive.
*/
