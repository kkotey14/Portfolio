const title = document.querySelector(".hero-title");
const image = document.querySelector(".hero-image");
const subtitle = document.querySelector(".hero-subtitle");
const codeSnippets = document.querySelector(".code-snippets");
const heroSection = document.querySelector(".hero-section");
const heroHome = document.querySelector("[data-hero-home]");
const aboutPanel = document.querySelector("[data-about-panel]");
const navHome = document.querySelector("[data-nav-home]");
const navAbout = document.querySelector("[data-nav-about]");
const navWork = document.querySelector("[data-nav-work]");
const navContact = document.querySelector("[data-nav-contact]");
const workGrid = document.querySelector("[data-work-grid]");
const contactSection = document.querySelector("[data-contact-section]");

let heroView = "home";
const heroTextPieces = [title, codeSnippets, subtitle].filter(Boolean);
const navigationEntry = performance.getEntriesByType("navigation")[0];

if (navigationEntry?.type === "reload" && window.location.hash) {
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}

const hideGatedSections = () => {
  workGrid?.classList.add("is-hidden");
  contactSection?.classList.add("is-hidden");
};

const setNavState = (view) => {
  navHome?.classList.toggle("is-current", view === "home");
  navAbout?.classList.toggle("is-current", view === "about");
  navWork?.classList.toggle("is-current", view === "work");
  navContact?.classList.toggle("is-current", view === "contact");
};

const syncNavFromHash = () => {
  if (window.location.hash === "#experience") {
    heroView = "about";
    heroSection?.classList.add("is-about-active");
    workGrid?.classList.remove("is-hidden");
    contactSection?.classList.remove("is-hidden");
    setNavState("work");
    return;
  }

  if (window.location.hash === "#contact") {
    heroView = "about";
    heroSection?.classList.add("is-about-active");
    contactSection?.classList.remove("is-hidden");
    setNavState("contact");
    return;
  }

  if (window.location.hash === "#about") {
    setNavState("about");
    return;
  }

  setNavState("home");
};

const animateAboutAvatar = () => {
  if (!image) {
    return;
  }

  image.getAnimations?.().forEach((animation) => animation.cancel());

  const settleAvatar = () => {
    image.style.opacity = "1";
    image.style.transform = "translate3d(0, 0, 0) scale(1)";
    image.style.filter = "drop-shadow(0 18px 28px rgba(0, 0, 0, 0.12))";
  };

  const keyframes = [
    {
      opacity: 0,
      transform: "translate3d(190px, 22px, 0) scale(0.88)",
      filter: "drop-shadow(0 34px 44px rgba(0, 0, 0, 0.08))",
    },
    {
      opacity: 1,
      transform: "translate3d(0, 0, 0) scale(1)",
      filter: "drop-shadow(0 18px 28px rgba(0, 0, 0, 0.12))",
    },
  ];

  if (typeof image.animate === "function") {
    const animation = image.animate(keyframes, {
      duration: 920,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    });
    animation.onfinish = settleAvatar;
    window.setTimeout(settleAvatar, 940);
    return;
  }

  settleAvatar();
};

if (window.gsap && title && image && subtitle) {
  gsap.set(title, {
    clipPath: "inset(0 100% 0 0)",
    opacity: 0.45,
  });

  gsap.set(subtitle, {
    clipPath: "inset(0 100% 0 0)",
    opacity: 0.35,
  });

  gsap.set(image, {
    x: 0,
    y: 112,
    opacity: 0,
    scale: 0.97,
    filter: "drop-shadow(0 32px 42px rgba(0, 0, 0, 0.08))",
  });

  const heroTimeline = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  heroTimeline
    .to(title, {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      duration: 1.85,
      ease: "power2.out",
    })
    .to(
      image,
      {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "drop-shadow(0 18px 28px rgba(0, 0, 0, 0.12))",
        duration: 2.15,
        ease: "expo.out",
      },
      "-=0.6"
    )
    .to(
      subtitle,
      {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: 1.7,
        ease: "power2.out",
      },
      "-=1.1"
    );

  const showAbout = () => {
    if (!aboutPanel) {
      return;
    }

    if (heroView === "about") {
      setNavState("about");
      hideGatedSections();
      window.history.replaceState(null, "", "#about");
      return;
    }

    heroView = "about";
    setNavState("about");
    heroTimeline.pause();
    hideGatedSections();
    heroSection?.classList.add("is-about-active");
    gsap.killTweensOf([aboutPanel, image]);
    gsap.set(aboutPanel, {
      clearProps: "all",
    });
    animateAboutAvatar();
  };

  const showHome = () => {
    if (heroView === "home" || !aboutPanel) {
      return;
    }

    heroView = "home";
    setNavState("home");
    hideGatedSections();
    heroSection?.classList.remove("is-about-active");
    gsap.set(aboutPanel, {
      clearProps: "all",
    });
    gsap.set(heroTextPieces, {
      x: 0,
      opacity: 1,
      clipPath: "inset(0 0% 0 0)",
    });
    gsap.set(image, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "drop-shadow(0 18px 28px rgba(0, 0, 0, 0.12))",
    });
  };

  setNavState("home");

  if (navAbout) {
    navAbout.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      showAbout();
    });
  }

  if (navHome) {
    navHome.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      showHome();
    });
  }

  if (window.location.hash === "#about") {
    window.scrollTo({ top: 0 });
    showAbout();
  }
}

if (!window.gsap && heroHome && aboutPanel) {
  const showFallbackAbout = () => {
    heroView = "about";
    hideGatedSections();
    heroSection?.classList.add("is-about-active");
    setNavState("about");
    animateAboutAvatar();
  };

  const showFallbackHome = () => {
    title.style.opacity = "1";
    subtitle.style.opacity = "1";
    if (codeSnippets) {
      codeSnippets.style.opacity = "1";
    }
    image.style.transform = "translateX(0)";
    hideGatedSections();
    heroSection?.classList.remove("is-about-active");
    setNavState("home");
  };

  setNavState("home");

  navAbout?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    showFallbackAbout();
  });

  navHome?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    showFallbackHome();
  });

  if (window.location.hash === "#about") {
    window.scrollTo({ top: 0 });
    showFallbackAbout();
  }
}

if (workGrid || contactSection) {
  const gatedSections = [workGrid, contactSection].filter(Boolean);

  const revealGatedSections = () => {
    gatedSections.forEach((section) => section.classList.remove("is-hidden"));
  };

  const revealAndScrollToWorkGrid = (event) => {
    event.preventDefault();
    heroView = "about";
    setNavState("work");
    heroSection?.classList.add("is-about-active");
    revealGatedSections();
    window.history.replaceState(null, "", "#experience");

    const target = document.querySelector("#projects") || workGrid;
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const revealAndScrollToContact = (event) => {
    event.preventDefault();
    heroView = "about";
    setNavState("contact");
    heroSection?.classList.add("is-about-active");
    contactSection?.classList.remove("is-hidden");
    window.history.replaceState(null, "", "#contact");

    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  navWork?.addEventListener("click", revealAndScrollToWorkGrid, { capture: true });
  navContact?.addEventListener("click", revealAndScrollToContact, { capture: true });
}

window.addEventListener("hashchange", syncNavFromHash);
syncNavFromHash();

const projectStack = document.querySelector("[data-project-stack]");
const projectCards = Array.from(document.querySelectorAll(".stack-card"));
const projectOverlay = document.querySelector(".project-overlay");
const projectThumbs = Array.from(document.querySelectorAll(".stack-thumb"));
const projectLightbox = document.querySelector("[data-project-lightbox]");
const projectLightboxTitle = document.querySelector("[data-lightbox-title]");
const projectLightboxImage = document.querySelector("[data-lightbox-image]");
const projectLightboxCounter = document.querySelector("[data-lightbox-counter]");
const projectLightboxCloseButtons = Array.from(
  document.querySelectorAll("[data-lightbox-close]")
);
const projectLightboxNavButtons = Array.from(
  document.querySelectorAll("[data-lightbox-direction]")
);
const projectsHint = document.querySelector(".projects-hint");
const roadmapHint = document.querySelector(".roadmap-hint");
const roadmapStops = Array.from(document.querySelectorAll(".stop"));
let activeLightboxThumb = null;
let activeLightboxIndex = 0;

const isLightboxOpen = () =>
  Boolean(projectLightbox && !projectLightbox.hasAttribute("hidden"));

const syncLightboxImage = () => {
  if (!activeLightboxThumb || !projectLightboxImage || !projectLightboxCounter) {
    return;
  }

  const images = JSON.parse(activeLightboxThumb.dataset.images || "[]");
  const title =
    activeLightboxThumb.closest(".stack-card")?.querySelector("h3")?.textContent?.trim() ||
    "Project Preview";

  if (!images.length) {
    return;
  }

  projectLightboxImage.src = images[activeLightboxIndex];
  projectLightboxImage.alt = `${title} preview ${activeLightboxIndex + 1}`;
  projectLightboxCounter.textContent = `${activeLightboxIndex + 1}/${images.length}`;

  if (projectLightboxTitle) {
    projectLightboxTitle.textContent = title;
  }
};

const openProjectLightbox = (thumb, imageIndex = 0) => {
  if (!projectLightbox || !projectLightboxImage) {
    return;
  }

  activeLightboxThumb = thumb;
  activeLightboxIndex = imageIndex;
  syncLightboxImage();
  projectLightbox.removeAttribute("hidden");
  document.body.classList.add("is-lightbox-open");
  projectLightbox
    .querySelector(".project-lightbox-close")
    ?.focus({ preventScroll: true });
};

const closeProjectLightbox = () => {
  if (!projectLightbox || !isLightboxOpen()) {
    return;
  }

  projectLightbox.setAttribute("hidden", "");
  document.body.classList.remove("is-lightbox-open");
  activeLightboxThumb = null;
};

const moveProjectLightbox = (direction) => {
  if (!activeLightboxThumb) {
    return;
  }

  const images = JSON.parse(activeLightboxThumb.dataset.images || "[]");

  if (!images.length) {
    return;
  }

  activeLightboxIndex =
    direction === "next"
      ? (activeLightboxIndex + 1) % images.length
      : (activeLightboxIndex - 1 + images.length) % images.length;

  syncLightboxImage();
};

if (window.gsap && projectStack && projectCards.length) {
  let frontIndex = 0;
  let expandedIndex = null;
  let touchStartX = 0;
  let touchStartY = 0;

  const isCompactStack = () => window.matchMedia("(max-width: 640px)").matches;

  const getBaseStack = (isCompact) =>
    isCompact
      ? [
          { x: 0, y: 0, rotate: 0, scale: 1 },
          { x: 12, y: 18, rotate: -1.2, scale: 0.99 },
          { x: 24, y: 36, rotate: -2.4, scale: 0.98 },
        ]
      : [
          { x: 0, y: 0, rotate: 0, scale: 1 },
          { x: 22, y: 24, rotate: -1.8, scale: 0.985 },
          { x: 44, y: 48, rotate: -3.6, scale: 0.97 },
        ];

  const getExpandedDepth = (isCompact) =>
    isCompact
      ? [
          { x: 0, y: 0, rotate: 0, scale: 1 },
          { x: 10, y: 24, rotate: -1, scale: 0.985 },
          { x: 20, y: 48, rotate: -2, scale: 0.97 },
        ]
      : [
          { x: 0, y: 0, rotate: 0, scale: 1 },
          { x: 18, y: 30, rotate: -1.5, scale: 0.98 },
          { x: 36, y: 60, rotate: -3, scale: 0.96 },
        ];

  const getLayerOffsets = (layers, layerIndex, isCompact) => {
    if (layers[layerIndex]) {
      return layers[layerIndex];
    }

    const last = layers[layers.length - 1];
    const extraDepth = layerIndex - (layers.length - 1);
    const xStep = isCompact ? 8 : 20;
    const yStep = isCompact ? 14 : 24;
    const rotateStep = isCompact ? 0.8 : 1.6;
    const scaleStep = isCompact ? 0.01 : 0.015;
    const minScale = isCompact ? 0.94 : 0.9;

    return {
      x: last.x + extraDepth * xStep,
      y: last.y + extraDepth * yStep,
      rotate: last.rotate - extraDepth * rotateStep,
      scale: Math.max(last.scale - extraDepth * scaleStep, minScale),
    };
  };

  const getStackHeight = (isExpanded) => {
    const extraCards = Math.min(Math.max(0, projectCards.length - 3), 2);
    const baseHeight = isExpanded ? 640 : 540;
    const extraHeight = extraCards * 84;

    return `${baseHeight + extraHeight}px`;
  };

  const getOrder = (leadIndex) =>
    projectCards.map((_, index) => (leadIndex + index) % projectCards.length);

  const cycleFrontCard = (direction) => {
    const nextIndex =
      direction === "next"
        ? (frontIndex + 1) % projectCards.length
        : (frontIndex - 1 + projectCards.length) % projectCards.length;

    layoutCards(nextIndex, null);
  };

  const setOverlayState = (isExpanded) => {
    if (!projectOverlay) {
      return;
    }

    gsap.to(projectOverlay, {
      opacity: isExpanded ? 1 : 0,
      duration: 0.2,
      ease: "power2.out",
      onStart: () => {
        projectOverlay.style.pointerEvents = isExpanded ? "auto" : "none";
      },
      onComplete: () => {
        projectOverlay.style.pointerEvents = isExpanded ? "auto" : "none";
      },
    });
  };

  const layoutCards = (leadIndex = 0, activeIndex = null) => {
    frontIndex = leadIndex;
    expandedIndex = activeIndex;
    const order = getOrder(leadIndex);
    const compact = isCompactStack();
    const layers =
      activeIndex === null ? getBaseStack(compact) : getExpandedDepth(compact);

    projectCards.forEach((card) => {
      const cardIndex = Number(card.dataset.card);
      const layerIndex = order.indexOf(cardIndex);
      const isActive = cardIndex === activeIndex;
      const offsets = getLayerOffsets(layers, layerIndex, compact);
      const details = card.querySelector(".stack-details");

      card.classList.toggle("is-active", isActive);

      gsap.to(card, {
        x: offsets.x,
        y: offsets.y,
        rotate: offsets.rotate,
        scale: isActive ? 1.015 : offsets.scale,
        zIndex: projectCards.length - layerIndex,
        duration: 0.7,
        ease: "power3.out",
      });

      if (details) {
        gsap.to(details, {
          height: isActive ? "auto" : 0,
          opacity: isActive ? 1 : 0,
          marginTop: isActive ? 6 : 0,
          duration: 0.32,
          ease: "power3.out",
        });
      }
    });

    projectStack.style.height = getStackHeight(activeIndex !== null);
    setOverlayState(activeIndex !== null);
  };

  window.addEventListener("resize", () => {
    layoutCards(frontIndex, expandedIndex);
  });

  projectCards.forEach((card, index) => {
    const details = card.querySelector(".stack-details");
    const thumbButton = card.querySelector(".thumb-scroll");
    const settleProjectsHint = () => {
      projectsHint?.classList.add("is-settled");
    };

    if (details) {
      gsap.set(details, {
        height: 0,
        opacity: 0,
      });
    }

    const compact = isCompactStack();
    const offsets = getLayerOffsets(getBaseStack(compact), index, compact);

    gsap.set(card, {
      x: offsets.x,
      y: offsets.y,
      rotate: offsets.rotate,
      scale: offsets.scale,
      zIndex: projectCards.length - index,
    });

    card.addEventListener("click", () => {
      settleProjectsHint();

      if (isCompactStack() && expandedIndex === null) {
        cycleFrontCard("next");
        return;
      }

      layoutCards(index, index);
    });

    if (thumbButton) {
      thumbButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const thumb = card.querySelector(".stack-thumb");
        const currentIndex = Number(thumb?.dataset.currentIndex || 0);

        if (thumb) {
          openProjectLightbox(thumb, currentIndex);
        }
      });
    }

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        settleProjectsHint();
        layoutCards(index, index);
      }
    });
  });

  if (projectOverlay) {
    projectOverlay.addEventListener("click", () => {
      if (expandedIndex !== null) {
        layoutCards(frontIndex, null);
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (
      expandedIndex !== null &&
      !isLightboxOpen() &&
      projectStack &&
      !projectStack.contains(event.target)
    ) {
      layoutCards(frontIndex, null);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && expandedIndex !== null && !isLightboxOpen()) {
      layoutCards(frontIndex, null);
    }
  });

  layoutCards(frontIndex, null);

  projectStack.addEventListener(
    "touchstart",
    (event) => {
      if (!event.touches.length || expandedIndex !== null) {
        return;
      }

      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  projectStack.addEventListener(
    "touchend",
    (event) => {
      if (!event.changedTouches.length || expandedIndex !== null) {
        return;
      }

      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;

      if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY)) {
        return;
      }

      cycleFrontCard(deltaX < 0 ? "next" : "prev");
    },
    { passive: true }
  );
}

projectThumbs.forEach((thumb) => {
  const images = JSON.parse(thumb.dataset.images || "[]");
  const image = thumb.querySelector(".thumb-image");
  const counter = thumb.querySelector(".thumb-counter");
  const navButtons = thumb.querySelectorAll(".thumb-nav");
  let imageIndex = 0;

  const renderImage = () => {
    if (!image || !images.length) {
      return;
    }

    image.src = images[imageIndex];
    thumb.dataset.currentIndex = String(imageIndex);

    if (counter) {
      counter.textContent = `${imageIndex + 1}/${images.length}`;
    }
  };

  renderImage();

  navButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!images.length) {
        return;
      }

      imageIndex =
        button.dataset.direction === "next"
          ? (imageIndex + 1) % images.length
          : (imageIndex - 1 + images.length) % images.length;

      renderImage();
    });
  });
});

projectLightboxCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeProjectLightbox();
  });
});

projectLightboxNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    moveProjectLightbox(button.dataset.lightboxDirection || "next");
  });
});

document.addEventListener("keydown", (event) => {
  if (!isLightboxOpen()) {
    return;
  }

  if (event.key === "Escape") {
    closeProjectLightbox();
  }

  if (event.key === "ArrowRight") {
    moveProjectLightbox("next");
  }

  if (event.key === "ArrowLeft") {
    moveProjectLightbox("prev");
  }
});

if (roadmapHint && roadmapStops.length) {
  const settleRoadmapHint = () => {
    roadmapHint.classList.add("is-settled");
  };

  const activateRoadmapStop = (activeStop) => {
    roadmapStops.forEach((stop) => {
      stop.classList.toggle("is-active", stop === activeStop);
    });
  };

  roadmapStops.forEach((stop) => {
    stop.tabIndex = 0;
    stop.setAttribute("role", "button");
    stop.setAttribute("aria-label", stop.querySelector(".tip-title")?.textContent?.trim() || "Experience detail");
    stop.addEventListener("mouseenter", settleRoadmapHint, { once: true });
    stop.addEventListener("focusin", settleRoadmapHint, { once: true });
    stop.addEventListener("touchstart", () => {
      settleRoadmapHint();
      activateRoadmapStop(stop);
    }, { passive: true });
    stop.addEventListener("click", (event) => {
      event.stopPropagation();
      settleRoadmapHint();
      activateRoadmapStop(stop);
    });
    stop.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      settleRoadmapHint();
      activateRoadmapStop(stop);
    });
  });

  document.addEventListener("click", () => {
    roadmapStops.forEach((stop) => stop.classList.remove("is-active"));
  });
}

const contactForm = document.querySelector("[data-contact-form]");
const contactFeedback = document.querySelector("[data-contact-feedback]");

if (contactForm && contactFeedback) {
  const submitButton = contactForm.querySelector(".contact-submit");
  const defaultButtonText = submitButton ? submitButton.textContent : "Send Message";

  const setContactFeedback = (message, state) => {
    contactFeedback.textContent = message;
    contactFeedback.classList.remove("is-success", "is-error");

    if (state) {
      contactFeedback.classList.add(state);
    }
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setContactFeedback("");

    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setContactFeedback("Please fill out your name, email, and message.", "is-error");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
      submitButton.classList.remove("is-sent");
      submitButton.classList.add("is-loading");
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Message failed to send.");
      }

      contactForm.reset();
      setContactFeedback("Your message has been sent successfully.", "is-success");

      if (submitButton) {
        submitButton.textContent = "Message Sent";
        submitButton.classList.remove("is-loading");
        submitButton.classList.add("is-sent");
      }

      window.setTimeout(() => {
        if (submitButton) {
          submitButton.textContent = defaultButtonText;
          submitButton.classList.remove("is-sent");
        }
      }, 1500);
    } catch (error) {
      setContactFeedback(
        error instanceof Error ? error.message : "Message failed to send. Please try again.",
        "is-error"
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove("is-loading");
        if (!submitButton.classList.contains("is-sent")) {
          submitButton.textContent = defaultButtonText;
        }
      }
    }
  };

  contactForm.addEventListener("submit", handleContactSubmit);
}
