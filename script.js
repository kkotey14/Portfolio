const title = document.querySelector(".hero-title");
const image = document.querySelector(".hero-image");
const subtitle = document.querySelector(".hero-subtitle");
const codeSnippets = document.querySelector(".code-snippets");
const heroHome = document.querySelector("[data-hero-home]");
const aboutPanel = document.querySelector("[data-about-panel]");
const navHome = document.querySelector("[data-nav-home]");
const navAbout = document.querySelector("[data-nav-about]");

let heroView = "home";
const heroTextPieces = [title, codeSnippets, subtitle].filter(Boolean);

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
    x: -40,
    y: 78,
    opacity: 0,
    scale: 0.985,
    filter: "drop-shadow(0 24px 34px rgba(0, 0, 0, 0.08))",
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
      duration: 1.2,
    })
    .to(
      image,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "drop-shadow(0 18px 28px rgba(0, 0, 0, 0.12))",
        duration: 1.35,
        ease: "expo.out",
      },
      "-=0.55"
    )
    .to(
      subtitle,
      {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: 1.1,
      },
      "-=0.9"
    );

  if (aboutPanel) {
    gsap.set(aboutPanel, {
      x: -120,
      opacity: 0,
      pointerEvents: "none",
    });
  }

  const setNavState = (view) => {
    if (navHome) {
      navHome.classList.toggle("is-current", view === "home");
    }

    if (navAbout) {
      navAbout.classList.toggle("is-current", view === "about");
    }
  };

  const showAbout = () => {
    if (heroView === "about" || !aboutPanel) {
      return;
    }

    heroView = "about";
    setNavState("about");

    gsap.timeline({
      defaults: {
        ease: "power3.inOut",
      },
    })
      .to(heroTextPieces, {
        x: 220,
        opacity: 0,
        duration: 0.6,
        stagger: 0.03,
      }, 0)
      .to(image, {
        x: 150,
        opacity: 1,
        duration: 0.68,
      }, 0.02)
      .to(heroHome, {
        pointerEvents: "none",
        duration: 0.01,
      }, 0.2)
      .to(aboutPanel, {
        x: 0,
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.62,
      }, 0.08);
  };

  const showHome = () => {
    if (heroView === "home" || !aboutPanel) {
      return;
    }

    heroView = "home";
    setNavState("home");

    gsap.timeline({
      defaults: {
        ease: "power3.inOut",
      },
    })
      .to(aboutPanel, {
        x: -120,
        opacity: 0,
        pointerEvents: "none",
        duration: 0.5,
      }, 0)
      .to(heroHome, {
        pointerEvents: "auto",
        duration: 0.01,
      }, 0.05)
      .to(heroTextPieces, {
        x: 0,
        opacity: 1,
        duration: 0.62,
        stagger: 0.03,
      }, 0.06);
      gsap.to(image, {
        x: -40,
        opacity: 1,
        duration: 0.62,
        ease: "power3.inOut",
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
}

if (!window.gsap && heroHome && aboutPanel) {
  const setFallbackNavState = (view) => {
    navHome?.classList.toggle("is-current", view === "home");
    navAbout?.classList.toggle("is-current", view === "about");
  };

  const showFallbackAbout = () => {
    title.style.opacity = "0";
    subtitle.style.opacity = "0";
    if (codeSnippets) {
      codeSnippets.style.opacity = "0";
    }
    image.style.transform = "translateX(150px)";
    aboutPanel.style.opacity = "1";
    aboutPanel.style.pointerEvents = "auto";
    aboutPanel.style.transform = "translateX(0)";
    heroHome.style.pointerEvents = "none";
    setFallbackNavState("about");
  };

  const showFallbackHome = () => {
    title.style.opacity = "1";
    subtitle.style.opacity = "1";
    if (codeSnippets) {
      codeSnippets.style.opacity = "1";
    }
    image.style.transform = "translateX(0)";
    heroHome.style.pointerEvents = "auto";
    aboutPanel.style.opacity = "0";
    aboutPanel.style.pointerEvents = "none";
    aboutPanel.style.transform = "translateX(-120px)";
    setFallbackNavState("home");
  };

  setFallbackNavState("home");

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
}

const projectStack = document.querySelector("[data-project-stack]");
const projectCards = Array.from(document.querySelectorAll(".stack-card"));
const projectOverlay = document.querySelector(".project-overlay");
const projectThumbs = Array.from(document.querySelectorAll(".stack-thumb"));
const experienceFlip = document.querySelector("[data-exp-flip]");
const experienceToggleButtons = Array.from(document.querySelectorAll("[data-exp-toggle]"));
const experienceHint = document.querySelector("[data-exp-hint]");

if (window.gsap && projectStack && projectCards.length) {
  let frontIndex = 0;
  let expandedIndex = null;

  const baseStack = [
    { x: 0, y: 0, rotate: 0, scale: 1 },
    { x: 22, y: 24, rotate: -1.8, scale: 0.985 },
    { x: 44, y: 48, rotate: -3.6, scale: 0.97 },
  ];

  const expandedDepth = [
    { x: 0, y: 0, rotate: 0, scale: 1 },
    { x: 18, y: 30, rotate: -1.5, scale: 0.98 },
    { x: 36, y: 60, rotate: -3, scale: 0.96 },
  ];

  const getOrder = (leadIndex) => [
    leadIndex,
    ...projectCards.map((_, index) => index).filter((index) => index !== leadIndex),
  ];

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

    projectCards.forEach((card) => {
      const cardIndex = Number(card.dataset.card);
      const layerIndex = order.indexOf(cardIndex);
      const isActive = cardIndex === activeIndex;
      const offsets = activeIndex === null ? baseStack[layerIndex] : expandedDepth[layerIndex];
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

    projectStack.style.height = activeIndex === null ? "540px" : "640px";
    setOverlayState(activeIndex !== null);
  };

  projectCards.forEach((card, index) => {
    const details = card.querySelector(".stack-details");
    const thumbButton = card.querySelector(".thumb-scroll");

    if (details) {
      gsap.set(details, {
        height: 0,
        opacity: 0,
      });
    }

    const offsets = baseStack[index] || baseStack[baseStack.length - 1];

    gsap.set(card, {
      x: offsets.x,
      y: offsets.y,
      rotate: offsets.rotate,
      scale: offsets.scale,
      zIndex: projectCards.length - index,
    });

    card.addEventListener("click", () => {
      layoutCards(index, index);
    });

    if (thumbButton) {
      thumbButton.addEventListener("click", (event) => {
        event.stopPropagation();
        layoutCards(index, index);
        card.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
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
      projectStack &&
      !projectStack.contains(event.target)
    ) {
      layoutCards(frontIndex, null);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && expandedIndex !== null) {
      layoutCards(frontIndex, null);
    }
  });

  layoutCards(frontIndex, null);
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

if (experienceFlip && experienceToggleButtons.length) {
  const setExperienceView = (view) => {
    experienceFlip.classList.toggle("is-skills", view === "skills");

    if (experienceHint) {
      experienceHint.textContent =
        view === "skills"
          ? "Click Experience to view experience"
          : "Click Skills to view skills";
    }

    experienceToggleButtons.forEach((button) => {
      const isActive = button.dataset.expToggle === view;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
  };

  experienceToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setExperienceView(button.dataset.expToggle || "experience");
    });
  });

  setExperienceView("experience");
}

const contactForm = document.querySelector("[data-contact-form]");
const contactFeedback = document.querySelector("[data-contact-feedback]");

if (contactForm && contactFeedback) {
  const submitButton = contactForm.querySelector(".contact-submit");

  const handleContactSubmit = (event) => {
    event.preventDefault();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Message Sent";
      submitButton.classList.add("is-sent");
    }

    contactFeedback.textContent = "Your message has been sent successfully.";
    contactForm.reset();

    window.setTimeout(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
        submitButton.classList.remove("is-sent");
      }
    }, 1200);
  };

  contactForm.addEventListener("submit", handleContactSubmit);
}
