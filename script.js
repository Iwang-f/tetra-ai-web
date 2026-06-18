(function () {
    'use strict';

    const root = document.documentElement;
    const body = document.body;

    /* ─── Theme toggle (dark default, persisted) ─────────────────────────── */
    let saved;
    try {
        saved = localStorage.getItem('tetra-theme');
    } catch (error) {
        saved = null;
    }
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            root.setAttribute('data-theme', next);
            try {
                localStorage.setItem('tetra-theme', next);
            } catch (error) {
                // Theme selection still works when browser storage is unavailable.
            }
        });
    }

    /* ─── Hamburger menu ─────────────────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const backdrop = document.getElementById('navBackdrop');

    const closeMenu = () => {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
        backdrop?.classList.remove('active');
        body.style.overflow = '';
        hamburger?.setAttribute('aria-expanded', 'false');
        hamburger?.setAttribute('aria-label', 'Buka menu');
    };

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const open = navLinks.classList.toggle('active');
            hamburger.classList.toggle('active', open);
            backdrop?.classList.toggle('active', open);
            body.style.overflow = open ? 'hidden' : '';
            hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
            hamburger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
        });
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
        backdrop?.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
        const desktopNav = window.matchMedia('(min-width: 769px)');
        desktopNav.addEventListener('change', (event) => {
            if (event.matches) closeMenu();
        });
    }

    /* ─── Navbar scroll affordance ───────────────────────────────────────── */
    const nav = document.getElementById('nav');
    if (nav) {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ─── Hero reveal (the one signature moment) ─────────────────────────── */
    const reveals = document.querySelectorAll('.hero .reveal');
    reveals.forEach((el) => {
        const d = el.getAttribute('data-reveal-delay') || 0;
        el.style.setProperty('--reveal-delay', d);
    });
    requestAnimationFrame(() => {
        requestAnimationFrame(() => reveals.forEach(el => el.classList.add('revealed')));
    });

    /* ─── Portfolio playback: open third-party videos in a 16:9 lightbox ─── */
    const videoModal = document.getElementById('videoModal');
    const videoModalFrame = document.getElementById('videoModalFrame');
    const videoModalTitle = document.getElementById('videoModalTitle');
    let lastVideoTrigger = null;

    const closeVideoModal = () => {
        if (!videoModal || !videoModalFrame) return;
        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
        videoModalFrame.classList.remove('video-modal-frame-portrait');
        videoModalFrame.replaceChildren();
        lastVideoTrigger?.focus();
        lastVideoTrigger = null;
    };

    document.querySelectorAll('.video-embed').forEach((embed) => {
        const trigger = embed.querySelector('.video-placeholder');
        if (!trigger) return;
        if (!embed.dataset.src) {
            trigger.disabled = true;
            return;
        }

        trigger.addEventListener('click', () => {
            const isLocalVideo = /\.mp4(?:$|\?)/i.test(embed.dataset.src);
            const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
            const isPortraitVideo = embed.dataset.ratio === 'portrait';
            if (isMobileViewport && !isPortraitVideo && !isLocalVideo) {
                window.open(embed.dataset.src, '_blank', 'noopener');
                return;
            }

            if (!videoModal || !videoModalFrame) return;
            lastVideoTrigger = trigger;

            const player = isLocalVideo ? document.createElement('video') : document.createElement('iframe');
            player.src = embed.dataset.src;
            player.title = embed.dataset.title || 'Video TETRA';
            if (isLocalVideo) {
                player.controls = true;
                player.preload = 'metadata';
                player.playsInline = true;
            } else {
                player.loading = 'eager';
                player.allow = 'autoplay; encrypted-media; fullscreen';
                player.allowFullscreen = true;
            }

            if (videoModalTitle) videoModalTitle.textContent = embed.dataset.title || 'Video TETRA';
            videoModalFrame.classList.toggle('video-modal-frame-portrait', embed.dataset.ratio === 'portrait');
            videoModalFrame.replaceChildren(player);
            videoModal.classList.add('active');
            videoModal.setAttribute('aria-hidden', 'false');
            body.style.overflow = 'hidden';
            videoModal.querySelector('.video-modal-close')?.focus();
        });
    });

    videoModal?.querySelectorAll('[data-video-close]').forEach((el) => {
        el.addEventListener('click', closeVideoModal);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && videoModal?.classList.contains('active')) closeVideoModal();
    });

    /* ─── Brief form: hand off a reviewable message to WhatsApp ─────────── */
    const briefForm = document.getElementById('briefForm');
    if (briefForm) {
        briefForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(briefForm);
            const lines = [
                'Halo TETRA, saya ingin mendiskusikan proyek video.',
                '',
                `Nama: ${formData.get('name')}`,
                `Brand/perusahaan: ${formData.get('brand')}`,
                `Kebutuhan: ${formData.get('project')}`,
                `Target waktu: ${formData.get('timeline')}`,
                '',
                'Tujuan / brief:',
                String(formData.get('brief')).trim()
            ];
            const message = encodeURIComponent(lines.join('\n'));
            window.open(`https://wa.me/6282283905473?text=${message}`, '_blank', 'noopener');
        });
    }
})();
