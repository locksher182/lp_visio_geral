/**
 * LANDING PAGE "TESTE 360° VISIONÁRIOS" - COMPORTAMENTO E INTERATIVIDADE
 */

document.addEventListener("DOMContentLoaded", () => {
    // === 1. COMPORTAMENTO DO HEADER NO SCROLL ===
    const mainHeader = document.getElementById("mainHeader");
    const handleScroll = () => {
        mainHeader.classList.toggle("scrolled", window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Executa no carregamento inicial caso a página comece scrollada

    // === YouTube Facades Loader ===
    const facades = document.querySelectorAll(".youtube-facade");
    facades.forEach(facade => {
        const videoId = facade.getAttribute("data-video-id");
        if (videoId) {
            // Define o thumbnail padrão de alta resolução do YouTube como background do container
            facade.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`;
            
            // Substitui a fachada estática pelo iframe do player real ao clicar
            facade.addEventListener("click", () => {
                const iframe = document.createElement("iframe");
                iframe.className = facade.classList.contains("presentation-player") ? "presentation-player" : "vsl-player";
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
                iframe.title = "YouTube Video Player";
                iframe.frameBorder = "0";
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                iframe.allowFullscreen = true;
                
                // Limpa o conteúdo da fachada (como o botão de play) e insere o iframe
                facade.innerHTML = "";
                facade.appendChild(iframe);
            });
        }
    });

    // === 2. MENU MOBILE HAMBÚRGUER E GAVETA DE NAVEGAÇÃO ===
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    const mobileLinks = document.querySelectorAll(".mobile-nav-item");

    const toggleMenu = () => {
        const isOpen = mobileNav.classList.toggle("active");
        menuToggle.classList.toggle("open", isOpen);
        menuToggle.setAttribute("aria-expanded", isOpen);
    };

    menuToggle.addEventListener("click", toggleMenu);

    // Fechar menu mobile ao clicar em um link
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (mobileNav.classList.contains("active")) {
                toggleMenu();
            }
        });
    });

    // === 3. CARROSSEL DE DEPOIMENTOS EM 3D COM GRADIENTE NAS BORDAS ===
    const depoimentosGrid = document.getElementById("depoimentosGrid");
    const cards = document.querySelectorAll(".testimonial-card");
    const dots = document.querySelectorAll(".carousel-indicators .dot");
    const prevBtn = document.getElementById("carouselPrevBtn");
    const nextBtn = document.getElementById("carouselNextBtn");
    const viewportWrapper = document.querySelector(".carousel-viewport-wrapper");
    
    let currentSlide = 0;
    const totalSlides = cards.length;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoplayTimer = null;

    // Atualiza a posição e efeitos 3D dos cards de depoimento
    const updateCarousel = () => {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // No mobile, desliza o contêiner flexível linearmente
            depoimentosGrid.style.transform = `translateX(-${currentSlide * 100}%)`;
            cards.forEach(card => {
                card.classList.remove("active", "prev-card", "next-card", "hidden-card");
            });
        } else {
            // No desktop, centraliza o ativo e afasta/aplica blur/escala nos adjacentes
            depoimentosGrid.style.transform = "none";
            cards.forEach((card, idx) => {
                card.classList.remove("active", "prev-card", "next-card", "hidden-card");

                if (idx === currentSlide) {
                    card.classList.add("active");
                } else if (idx === (currentSlide + 1) % totalSlides) {
                    card.classList.add("next-card");
                } else if (idx === (currentSlide - 1 + totalSlides) % totalSlides) {
                    card.classList.add("prev-card");
                } else {
                    card.classList.add("hidden-card");
                }
            });
        }

        // Atualiza a classe ativa nos indicadores (dots)
        dots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === currentSlide);
        });
    };

    // Navegar para depoimento anterior
    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        resetAutoplay();
    };

    // Navegar para próximo depoimento
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        resetAutoplay();
    };

    // Inicia o Autoplay
    const startAutoplay = () => {
        if (!autoplayTimer) {
            autoplayTimer = setInterval(nextSlide, 5000); // Roda a cada 5 segundos
        }
    };

    // Pausa o Autoplay
    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };

    // Reseta o tempo do autoplay quando há interação manual
    const resetAutoplay = () => {
        stopAutoplay();
        startAutoplay();
    };

    // Cliques nos botões de navegação lateral (prev/next)
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);

    // Cliques diretos nos cards laterais no desktop para navegar
    cards.forEach((card, index) => {
        card.addEventListener("click", () => {
            if (window.innerWidth > 768 && index !== currentSlide) {
                currentSlide = index;
                updateCarousel();
                resetAutoplay();
            }
        });
    });

    // Cliques nos indicadores (Dots)
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentSlide = index;
            updateCarousel();
            resetAutoplay();
        });
    });

    // Pausar autoplay ao passar o mouse por cima
    if (viewportWrapper) {
        viewportWrapper.addEventListener("mouseenter", stopAutoplay);
        viewportWrapper.addEventListener("mouseleave", startAutoplay);
    }

    // Detecção de Gestos de Toque (Swipe no Mobile)
    depoimentosGrid.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    depoimentosGrid.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
    };

    // Inicialização do carrossel e ativação do autoplay
    updateCarousel();
    startAutoplay();

    // Redimensionamento de janela adaptativo (com debounce)
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateCarousel, 150);
    });

    // === 4. MÁSCARA DINÂMICA E VALIDAÇÃO DO WHATSAPP ===
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
            
            // Remove o prefixo DDI "+55" se o usuário colar o número completo
            if (value.startsWith("55") && value.length > 10) {
                value = value.slice(2);
            }
            
            // Limita a 11 dígitos
            if (value.length > 11) value = value.slice(0, 11);
            
            // Formata o valor dinamicamente
            if (value.length > 10) {
                e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            } else if (value.length > 6) {
                e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
            } else if (value.length > 2) {
                e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length > 0) {
                e.target.value = `(${value}`;
            } else {
                e.target.value = "";
            }
        });
    }
    // === 5. TRATAMENTO DO FORMULÁRIO (Core Web Vitals & Fricção Zero) ===
    const leadForm = document.getElementById("leadForm");
    const formFeedback = document.getElementById("formFeedback");
    const formSubmitBtn = document.getElementById("formSubmitBtn");

    if (leadForm && formFeedback && formSubmitBtn) {
        leadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Coloca o botão em estado de carregamento
            formSubmitBtn.disabled = true;
            const originalText = formSubmitBtn.innerText;
            formSubmitBtn.innerHTML = '<span class="spinner-loader"></span> Processando...';
            
            // Simula processamento assíncrono (1.5 segundos)
            setTimeout(() => {
                // Exibe mensagem de sucesso na tela sem congelar a thread do navegador
                formFeedback.style.display = "block";
                formFeedback.className = "form-feedback-message success";
                formFeedback.innerHTML = "<strong>Cadastro Realizado!</strong> Mapeamento iniciado. Redirecionando para o questionário...";
                
                formSubmitBtn.innerText = "Sucesso!";
                
                // Simulação do redirecionamento após 2.5 segundos
                setTimeout(() => {
                    formFeedback.innerHTML = "<strong>Tudo Pronto!</strong> Se você não for redirecionado automaticamente, <a href='#' style='color: var(--white); text-decoration: underline; font-weight: 700;'>clique aqui para iniciar o teste</a>.";
                    leadForm.reset();
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerText = originalText;
                }, 2500);
                
            }, 1500);
        });
    }

    // === 6. LIGHTBOX MODAL ===
    const imageLightbox = document.getElementById("imageLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    const solutionImg = document.querySelector(".solution-img");

    if (imageLightbox && lightboxImage && lightboxClose && solutionImg) {
        solutionImg.addEventListener("click", () => {
            lightboxImage.src = solutionImg.src;
            lightboxImage.alt = solutionImg.alt;
            imageLightbox.classList.add("active");
            imageLightbox.setAttribute("aria-hidden", "false");
        });

        const closeLightbox = () => {
            imageLightbox.classList.remove("active");
            imageLightbox.setAttribute("aria-hidden", "true");
            setTimeout(() => { lightboxImage.src = ""; }, 300);
        };

        lightboxClose.addEventListener("click", closeLightbox);

        imageLightbox.addEventListener("click", (e) => {
            if (e.target === imageLightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && imageLightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }
});
