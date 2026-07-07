const themeStorageKey = "tandcmc-color-theme";

const getStoredTheme = () => {
  try {
    return window.localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
};

const setStoredTheme = (theme) => {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // The selected theme still applies for the current visit.
  }
};

const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
document.documentElement.dataset.theme = getStoredTheme() || preferredTheme;
document.documentElement.classList.add("js");

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const pageMain = document.querySelector(".page-main");

const siteBannerMarkup = `
  <section class="hero site-banner page-banner">
    <div class="quantum-animation" aria-hidden="true">
      <div class="quantum-symbol">
        <span class="quantum-core"></span>
        <span class="quantum-ring ring-one"></span>
        <span class="quantum-ring ring-two"></span>
        <span class="quantum-ring ring-three"></span>
        <span class="electron-track track-one"><span class="quantum-electron"></span></span>
      </div>
      <div class="schrodinger-equation">i&hbar; &part;&Psi;/&part;t = &#292;&Psi;</div>
      <span class="orbital orbital-a"></span>
      <span class="orbital orbital-b"></span>
      <span class="orbital orbital-c"></span>
      <span class="wave-line wave-a"></span>
      <span class="wave-line wave-b"></span>
      <span class="quantum-node node-a"></span>
      <span class="quantum-node node-b"></span>
      <span class="quantum-node node-c"></span>
      <span class="quantum-node node-d"></span>
      <span class="quantum-bond bond-a"></span>
      <span class="quantum-bond bond-b"></span>
      <span class="quantum-bond bond-c"></span>
    </div>
    <div class="container hero-content">
      <div class="reveal">
        <div class="hero-lockup">
          <a class="hero-logo-link" href="index.html" aria-label="T&CMC Research Group home">
            <img class="hero-logo" src="assets/images/logo.jpeg" alt="T&CMC Research Group logo">
          </a>
          <div class="hero-title-stack">
            <p class="eyebrow">Department of Chemistry, SRM Institute of Science and Technology</p>
            <h1>T&CMC Research Group</h1>
            <p class="hero-subtitle">Theoretical and Computational Materials Chemistry</p>
          </div>
        </div>
        <nav class="banner-links" aria-label="Site sections">
          <a href="research.html"><span class="home-nav-icon icon-research" aria-hidden="true"></span><span>Research</span></a>
          <a href="publications.html"><span class="home-nav-icon icon-publications" aria-hidden="true"></span><span>Publications</span></a>
          <a href="team.html"><span class="home-nav-icon icon-team" aria-hidden="true"></span><span>Team</span></a>
          <a href="outreach.html"><span class="home-nav-icon icon-outreach" aria-hidden="true"></span><span>Outreach</span></a>
          <a href="contact.html"><span class="home-nav-icon icon-contact" aria-hidden="true"></span><span>Contact</span></a>
        </nav>
      </div>
    </div>
  </section>
`;

if (pageMain && !document.querySelector(".site-banner")) {
  pageMain.insertAdjacentHTML("afterbegin", siteBannerMarkup);
}

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const headerInner = document.querySelector(".header-inner");

const updateThemeToggle = (button) => {
  const isDark = document.documentElement.dataset.theme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  button.setAttribute("aria-pressed", String(isDark));
  button.querySelector(".theme-toggle-icon").textContent = isDark ? "☀" : "☾";
};

if (headerInner && navToggle) {
  const themeToggle = document.createElement("button");
  themeToggle.className = "theme-toggle";
  themeToggle.type = "button";
  themeToggle.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true"></span>';
  updateThemeToggle(themeToggle);
  headerInner.insertBefore(themeToggle, navToggle);

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    setStoredTheme(nextTheme);
    updateThemeToggle(themeToggle);
  });
}

const setupLogoSpotlight = () => {
  const logoPath = "assets/images/logo.jpeg";
  let previousFocus = null;
  const spotlight = document.createElement("div");
  spotlight.className = "logo-spotlight";
  spotlight.setAttribute("role", "dialog");
  spotlight.setAttribute("aria-modal", "true");
  spotlight.setAttribute("aria-label", "T&CMC Research Group logo preview");
  spotlight.hidden = true;
  spotlight.innerHTML = `
    <button class="logo-spotlight-close" type="button" aria-label="Close logo preview"></button>
    <div class="logo-spotlight-panel">
      <img src="${logoPath}" alt="T&CMC Research Group logo">
      <span class="logo-spotlight-title">T&CMC Research Group</span>
      <div class="logo-spotlight-actions">
        <a class="logo-home-link" href="index.html">
          <span class="nav-icon icon-home" aria-hidden="true"></span>
          <span>Go Home</span>
        </a>
        <button class="logo-spotlight-stay" type="button">Stay Here</button>
      </div>
    </div>
  `;

  document.body.appendChild(spotlight);

  const closeButton = spotlight.querySelector(".logo-spotlight-close");
  const stayButton = spotlight.querySelector(".logo-spotlight-stay");
  const homeLink = spotlight.querySelector(".logo-home-link");

  const closeSpotlight = () => {
    spotlight.classList.remove("is-open");
    document.body.classList.remove("logo-spotlight-open");
    window.setTimeout(() => {
      spotlight.hidden = true;
    }, 180);
    previousFocus?.focus?.();
  };

  const openSpotlight = () => {
    previousFocus = document.activeElement;
    spotlight.hidden = false;
    window.requestAnimationFrame(() => {
      spotlight.classList.add("is-open");
      document.body.classList.add("logo-spotlight-open");
      homeLink.focus();
    });
  };

  document.addEventListener("click", (event) => {
    const logo = event.target.closest(".brand-logo, .hero-logo, .theme-tree-core img, .theme-orbit-core img");
    if (!logo) return;

    event.preventDefault();
    openSpotlight();
  });

  spotlight.addEventListener("click", (event) => {
    if (event.target === spotlight || event.target === closeButton || event.target === stayButton) closeSpotlight();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !spotlight.hidden) closeSpotlight();
  });
};

setupLogoSpotlight();

document.querySelectorAll(".site-nav a, .banner-links a").forEach((link) => {
  const href = link.getAttribute("href");
  const isResearchSubpage = currentPage.startsWith("research-") && href === "research.html";

  if (href === currentPage || isResearchSubpage || (currentPage === "" && href === "index.html")) {
    link.setAttribute("aria-current", "page");
  }
});

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const updateHomeBanner = () => {
  if (!document.body.classList.contains("home-page")) return;

  const isDesktop = window.matchMedia("(min-width: 761px)").matches;
  document.body.classList.toggle("home-banner-compact", isDesktop && window.scrollY > 24);
};

updateHomeBanner();
window.addEventListener("scroll", updateHomeBanner, { passive: true });
window.addEventListener("resize", updateHomeBanner);

const roadmapSection = document.querySelector(".profile-roadmap-section");
const updateProfileRoadmap = () => {
  if (!roadmapSection) return;

  const isDesktop = window.matchMedia("(min-width: 761px)").matches;
  const compactAt = roadmapSection.offsetTop + 18;
  roadmapSection.classList.toggle("is-sticky", isDesktop && window.scrollY > compactAt);
};

updateProfileRoadmap();
window.addEventListener("scroll", updateProfileRoadmap, { passive: true });
window.addEventListener("resize", updateProfileRoadmap);

const setupProfileRoadmapLinks = () => {
  if (!roadmapSection) return;

  document.querySelectorAll(".roadmap-track a[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = targetId ? document.querySelector(targetId) : null;

      if (!target) return;

      event.preventDefault();

      const isDesktop = window.matchMedia("(min-width: 761px)").matches;
      roadmapSection.classList.toggle("is-sticky", isDesktop);

      window.requestAnimationFrame(() => {
        const stickyTop = isDesktop ? parseFloat(window.getComputedStyle(roadmapSection).top) || 0 : 0;
        const offset = isDesktop ? stickyTop + roadmapSection.offsetHeight + 34 : 24;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
        window.history.pushState(null, "", targetId);
      });
    });
  });
};

setupProfileRoadmapLinks();

const listMarkup = (items) => items.map((item) => `<li>${item}</li>`).join("");

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });

const doiLink = (doi) => `https://doi.org/${doi}`;

const researchPageLink = (theme) => `research-${theme.id}.html`;

const getResearchDetailByTitle = (title) =>
  window.siteData?.researchDetails?.find((detail) => detail.title === title);

const normalizeThemeReferences = (text, theme) => {
  const escaped = escapeHtml(text);
  if (!theme?.publications) return escaped;

  return escaped.replace(/\[([A-Z]+\d+(?:,\s*[A-Z]+\d+)*)\]/g, (match, codes) => {
    const numbers = codes.split(",").map((code) => {
      const index = theme.publications.findIndex((publication) => publication.code === code.trim());
      return index >= 0 ? String(index + 1) : "";
    });

    return numbers.every(Boolean) ? `[${numbers.join(", ")}]` : match;
  });
};

const researchPublicationMarkup = (theme) => `
  <section class="selected-publications" aria-label="Selected publications for ${escapeHtml(theme.title)}">
    <h3>Selected publications</h3>
    <ol class="research-publications">
      ${theme.publications
        .map(
          (publication, index) => `
            <li>
              <span class="research-pub-code">[${index + 1}]</span>
              <span class="research-pub-citation">${escapeHtml(publication.citation)}</span>
              <a class="doi-link" href="${doiLink(publication.doi)}" target="_blank" rel="noopener">DOI: ${escapeHtml(publication.doi)}</a>
            </li>
          `
        )
        .join("")}
    </ol>
  </section>
`;

const renderList = (selector, items, className = "data-list") => {
  const target = document.querySelector(selector);
  if (!target || !items) return;

  target.innerHTML = listMarkup(items);
  target.classList.add(className);
};

const renderThemes = () => {
  const target = document.querySelector("[data-research-themes]");
  if (!target || !window.siteData) return;

  const isOrbit = target.classList.contains("theme-orbit");
  const isShowcase = target.classList.contains("theme-showcase");
  const themeBadges = ["MAT", "DFT", "MD", "CAT", "GAS", "OPT", "ML", "2D", "BIO"];

  if (isShowcase) {
    const positions = [
      { x: 20, y: 10 },
      { x: 80, y: 10 },
      { x: 18, y: 32 },
      { x: 82, y: 32 },
      { x: 18, y: 54 },
      { x: 82, y: 54 },
      { x: 35, y: 75 },
      { x: 65, y: 75 },
      { x: 50, y: 23 },
    ];

    target.innerHTML = `
      <div class="theme-tree reveal" aria-label="T&CMC Research Group research themes">
        <svg class="theme-tree-svg" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">
          <path class="tree-trunk" d="M500 728 C492 610 508 500 500 390 C494 300 506 195 500 58" />
          <path class="tree-root root-left" d="M500 722 C440 724 385 736 322 750" />
          <path class="tree-root root-right" d="M500 722 C560 724 615 736 678 750" />
          <path class="tree-branch branch-one" d="M500 120 C390 112 324 82 205 98" />
          <path class="tree-branch branch-two" d="M500 120 C610 112 676 82 795 98" />
          <path class="tree-branch branch-three" d="M500 282 C382 266 285 245 175 286" />
          <path class="tree-branch branch-four" d="M500 282 C618 266 715 245 825 286" />
          <path class="tree-branch branch-five" d="M500 438 C380 414 284 424 178 452" />
          <path class="tree-branch branch-six" d="M500 438 C620 414 716 424 822 452" />
          <path class="tree-branch branch-seven" d="M500 578 C456 620 405 640 346 630" />
          <path class="tree-branch branch-eight" d="M500 578 C544 620 595 640 654 630" />
          <path class="tree-branch branch-nine" d="M500 210 C472 188 528 188 500 166" />
        </svg>
        <div class="theme-tree-core">
          <img src="assets/images/logo.jpeg" alt="">
          <strong>T&CMC</strong>
          <span>Research Themes</span>
        </div>
        ${siteData.researchThemes
          .map((theme, index) => {
            const position = positions[index] || { x: 50, y: 50 };
            const detail = getResearchDetailByTitle(theme);
            const href = detail ? researchPageLink(detail) : "research.html";

            return `
              <article class="theme-tree-item" style="--x: ${position.x}%; --y: ${position.y}%; --delay: ${index * 90}ms">
                <a class="theme-tree-card" href="${href}">
                  <span class="theme-tree-number">${String(index + 1).padStart(2, "0")}</span>
                  <h3>${theme}</h3>
                </a>
              </article>
            `;
          })
          .join("")}
      </div>
    `;
    return;
  }

  if (isOrbit) {
    const total = siteData.researchThemes.length;
    target.innerHTML = `
      <div class="theme-orbit-core">
        <img src="assets/images/logo.jpeg" alt="T&CMC Research Group logo">
        <strong>T&CMC</strong>
        <span>Research Themes</span>
      </div>
      ${siteData.researchThemes
        .map((theme, index) => {
          const angle = (360 / total) * index - 90;
          const detail = getResearchDetailByTitle(theme);
          const href = detail ? researchPageLink(detail) : "research.html";

          return `
            <a class="theme-node" href="${href}" style="--angle: ${angle}deg; --delay: ${index * 70}ms">
              <span class="theme-symbol">${themeBadges[index] || String(index + 1).padStart(2, "0")}</span>
              <span class="theme-index">${String(index + 1).padStart(2, "0")}</span>
              <h3>${theme}</h3>
            </a>
          `;
        })
        .join("")}
    `;
    return;
  }

  target.innerHTML = siteData.researchThemes
    .map((theme, index) => {
      const detail = getResearchDetailByTitle(theme);
      const href = detail ? researchPageLink(detail) : "research.html";

      return `
        <a class="theme-card reveal" href="${href}" style="--delay: ${index * 60}ms">
          <span class="theme-index">${String(index + 1).padStart(2, "0")}</span>
          <h3>${theme}</h3>
        </a>
      `;
    })
    .join("");
};

const renderResearchDetails = () => {
  const target = document.querySelector("[data-research-details]");
  if (!target || !window.siteData?.researchDetails) return;

  const details = siteData.researchDetails;

  target.innerHTML = details
    .map(
      (theme, index) => `
        <a class="research-overview-card reveal" href="${researchPageLink(theme)}" style="--delay: ${index * 70}ms">
          <span class="research-overview-number">${escapeHtml(theme.number)}</span>
          <span class="research-overview-content">
            <span class="research-number">Research Theme</span>
            <h2>${escapeHtml(theme.title)}</h2>
            <span>${escapeHtml(theme.paragraphs[1] || theme.paragraphs[0])}</span>
            <span class="text-link">Open research theme</span>
          </span>
        </a>
      `
    )
    .join("");
};

const renderResearchDetailPage = () => {
  const target = document.querySelector("[data-research-detail-page]");
  if (!target || !window.siteData?.researchDetails) return;

  const details = siteData.researchDetails;
  const requestedId = target.dataset.researchTheme;
  const theme = details.find((item) => item.id === requestedId);

  if (!theme) {
    target.innerHTML = `
      <article class="info-card reveal">
        <h2>Research theme not found</h2>
        <p>Please return to the research overview and choose a listed theme.</p>
        <a class="text-link" href="research.html">Back to research</a>
      </article>
    `;
    return;
  }

  const index = details.indexOf(theme);
  const previous = details[(index - 1 + details.length) % details.length];
  const next = details[(index + 1) % details.length];

  document.title = `${theme.title} | T&CMC Research Group`;

  target.innerHTML = `
    <nav class="research-page-nav reveal" aria-label="Research theme navigation">
      <a href="research.html">All research themes</a>
      <a href="${researchPageLink(previous)}">Previous theme</a>
      <a href="${researchPageLink(next)}">Next theme</a>
    </nav>
    <article class="research-detail research-detail-single reveal" id="${escapeHtml(theme.id)}">
      <div class="research-detail-content">
        <p class="research-number">Theme ${escapeHtml(theme.number)}</p>
        <h2>${escapeHtml(theme.title)}</h2>
        <div class="research-copy">
          ${theme.paragraphs.map((paragraph) => `<p>${normalizeThemeReferences(paragraph, theme)}</p>`).join("")}
        </div>
        ${researchPublicationMarkup(theme)}
      </div>
    </article>
  `;
};

const renderPI = () => {
  const target = document.querySelector("[data-principal-investigator]");
  if (!target || !window.siteData) return;

  const pi = siteData.team.principalInvestigator;
  target.innerHTML = `
    <div class="profile-photo">
      <img src="${pi.photo}" alt="${pi.name}">
    </div>
    <div>
      <p class="eyebrow">Principal Investigator</p>
      <h2>${pi.name}</h2>
      <p class="profile-role">${pi.role}</p>
      <p class="profile-affiliation">${pi.affiliation}</p>
      <p>${pi.profile}</p>
      ${pi.links?.length ? `
        <div class="profile-links" aria-label="Academic profiles">
          ${pi.links.map((link) => `<a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`).join("")}
        </div>
      ` : ""}
    </div>
  `;

  renderList("[data-pi-interests]", pi.interests);
};

const renderTeamDirectory = () => {
  const target = document.querySelector("[data-team-directory]");
  if (!target || !window.siteData) return;

  const pi = siteData.team.principalInvestigator;
  const personCard = (member, iconClass = "icon-graduate") => `
    <a class="person-card reveal" href="${member.page}" aria-label="${member.name}">
      <span class="person-photo">
        <span class="person-mini-icon ${iconClass}" aria-hidden="true"></span>
        <img src="${member.photo}" alt="${member.name}">
      </span>
      <span class="person-name">${member.name}</span>
      <span class="person-role">${member.role}</span>
      ${member.affiliation && member.role.includes("Alumni") ? `<span class="person-current">${member.affiliation}</span>` : ""}
    </a>
  `;

  target.innerHTML = `
    <section class="people-section">
      <h2 class="people-heading"><span class="nav-icon icon-team" aria-hidden="true"></span> Principal Investigator</h2>
      <div class="people-grid pi-grid">
        ${personCard(pi, "icon-presenter")}
      </div>
    </section>
    ${siteData.team.groups
      .map(
        (group) => `
          <section class="people-section">
            <h2 class="people-heading"><span class="nav-icon icon-team" aria-hidden="true"></span> ${group.title}</h2>
            <div class="people-grid">
              ${group.members.map((member) => personCard(member)).join("")}
            </div>
          </section>
        `
      )
      .join("")}
  `;
};

const timelineHeadingMarkup = (item) => {
  const heading = item.title || item.degree || item.heading || item.role || "";
  const safeHeading = escapeHtml(heading);

  if (!item.page) return safeHeading;
  return `<a class="timeline-title-link" href="${item.page}">${safeHeading}</a>`;
};

const timelineMarkup = (items) =>
  items
    .map(
      (item) => `
        <article class="timeline-item reveal">
          <span class="timeline-period">${item.period || ""}</span>
          <h3>${timelineHeadingMarkup(item)}</h3>
          ${item.institution ? `<p>${item.institution}</p>` : ""}
          ${item.place ? `<p>${item.place}</p>` : ""}
          ${item.advisor ? `<p><strong>Advisor:</strong> ${item.advisor}</p>` : ""}
          ${item.details ? `<p>${item.details}</p>` : ""}
          ${item.items ? `<ul class="data-list compact">${listMarkup(item.items)}</ul>` : ""}
          ${item.projects ? `<ul class="data-list compact">${listMarkup(item.projects)}</ul>` : ""}
        </article>
      `
    )
    .join("");

const renderTimeline = (selector, items) => {
  const target = document.querySelector(selector);
  if (!target || !items) return;
  target.innerHTML = timelineMarkup(items);
};

const profileLinkBrand = (link) => {
  const url = link.href.toLowerCase();
  const label = link.textContent.trim();

  if (url.includes("linkedin.com")) return { brand: "linkedin", icon: "in", label: label || "LinkedIn" };
  if (url.includes("scholar.google.com")) return { brand: "scholar", icon: "GS", label: label || "Google Scholar" };
  if (url.includes("researchgate.net")) return { brand: "researchgate", icon: "RG", label: label || "ResearchGate" };
  if (url.includes("orcid.org")) return { brand: "orcid", icon: "iD", label: label || "ORCID" };
  return { brand: "website", icon: "WWW", label: label || "Website" };
};

const enhanceProfileLinks = () => {
  document.querySelectorAll(".profile-links a").forEach((link) => {
    const { brand, icon, label } = profileLinkBrand(link);
    link.dataset.brand = brand;
    link.dataset.icon = icon;
    link.setAttribute("aria-label", label);
    link.setAttribute("title", label);
  });
};

const renderTeamPlaceholders = () => {
  const target = document.querySelector("[data-team-placeholders]");
  if (!target || !window.siteData) return;

  target.innerHTML = siteData.team.placeholders
    .map(
      (section) => `
        <article class="info-card reveal">
          <h3>${section}</h3>
          <p>${siteData.team.placeholderNote}</p>
        </article>
      `
    )
    .join("");
};

const renderComingSoonCards = (selector, items) => {
  const target = document.querySelector(selector);
  if (!target || !items) return;

  target.innerHTML = items
    .map(
      (item) => `
        <article class="info-card reveal">
          <span class="status-pill">${item.type}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </article>
      `
    )
    .join("");
};

const renderPublications = () => {
  const target = document.querySelector("[data-publications]");
  if (!target || !window.siteData) return;

  const searchInput = document.querySelector("[data-publication-search]");
  const countTarget = document.querySelector("[data-publication-count]");

  const publicationMatches = (publication, query) =>
    [
      publication.title,
      publication.authors,
      publication.journal,
      publication.year,
      publication.doi,
      publication.theme
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);

  const renderList = (items) => {
    if (countTarget) {
      countTarget.textContent = `${items.length} publication${items.length === 1 ? "" : "s"}`;
    }

    if (!items.length) {
      target.innerHTML = `<p class="empty-state">No publications match your search.</p>`;
      return;
    }

    target.innerHTML = items
    .map(
      (publication) => `
        <a class="publication-card reveal is-visible" href="${publication.link}" target="_blank" rel="noopener">
          <span class="publication-body">
            <span class="publication-year">${publication.year}</span>
            <span class="publication-title">${publication.title}</span>
            <span class="publication-authors">${publication.authors}</span>
            <span class="publication-journal">${publication.journal}</span>
            <span class="publication-theme">${publication.theme}</span>
            <span class="publication-doi">DOI: ${publication.doi}</span>
          </span>
        </a>
      `
    )
    .join("");
  };

  renderList(siteData.publications);

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      const items = query
        ? siteData.publications.filter((publication) => publicationMatches(publication, query))
        : siteData.publications;

      renderList(items);
    });
  }
};

const renderScholarDashboard = () => {
  const metricsTarget = document.querySelector("[data-scholar-metrics]");
  const chartTarget = document.querySelector("[data-publication-year-chart]");
  const statusTarget = document.querySelector("[data-scholar-status]");
  const profileLink = document.querySelector("[data-scholar-link]");
  const profile = window.siteData?.scholarProfile;
  const publications = window.siteData?.publications;

  if (!metricsTarget || !chartTarget || !profile || !publications) return;

  const metricRows = [
    { label: "Citations", all: profile.metrics.citations.all, since: profile.metrics.citations.since },
    { label: "h-index", all: profile.metrics.hIndex.all, since: profile.metrics.hIndex.since },
    { label: "i10-index", all: profile.metrics.i10Index.all, since: profile.metrics.i10Index.since }
  ];

  metricsTarget.innerHTML = `
    <div class="scholar-publication-total">
      <span class="scholar-metric-label">Verified publications</span>
      <strong>${publications.length}</strong>
      <span>Website record</span>
    </div>
    <div class="scholar-metric-table" role="table" aria-label="Citation metrics">
      <div class="scholar-metric-row scholar-metric-head" role="row">
        <span role="columnheader">Metric</span>
        <span role="columnheader">All</span>
        <span role="columnheader">Since ${escapeHtml(profile.sinceYear)}</span>
      </div>
      ${metricRows
        .map(
          (metric) => `
            <div class="scholar-metric-row" role="row">
              <strong role="rowheader">${metric.label}</strong>
              <span role="cell">${Number(metric.all).toLocaleString("en-IN")}</span>
              <span role="cell">${Number(metric.since).toLocaleString("en-IN")}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  if (statusTarget) {
    statusTarget.textContent = `Google Scholar metrics verified ${profile.lastVerified}.`;
  }

  if (profileLink) {
    profileLink.href = profile.url;
  }

  const countsByYear = publications.reduce((counts, publication) => {
    const year = String(publication.year || "").trim();
    if (/^\d{4}$/.test(year)) counts[year] = (counts[year] || 0) + 1;
    return counts;
  }, {});
  const recordedYears = Object.keys(countsByYear).map(Number).sort((yearA, yearB) => yearA - yearB);
  const yearData = recordedYears.length
    ? Array.from(
        { length: recordedYears[recordedYears.length - 1] - recordedYears[0] + 1 },
        (_, index) => {
          const year = String(recordedYears[0] + index);
          return [year, countsByYear[year] || 0];
        }
      )
    : [];
  const maximum = Math.max(...yearData.map(([, count]) => count), 1);

  chartTarget.innerHTML = yearData
    .map(([year, count]) => {
      const height = count ? Math.max((count / maximum) * 100, 8) : 0;
      return `
        <div class="publication-year-column" aria-label="${year}: ${count} publication${count === 1 ? "" : "s"}" title="${year}: ${count} publication${count === 1 ? "" : "s"}">
          <span class="publication-year-value">${count}</span>
          <span class="publication-year-track">
            <span class="publication-year-bar" style="--bar-height: ${height}%"></span>
          </span>
          <span class="publication-year-label">${year}</span>
        </div>
      `;
    })
    .join("");
};

const renderHomeNews = () => {
  const target = document.querySelector("[data-home-news]");
  if (!target || !window.siteData?.homeNews) return;

  target.innerHTML = siteData.homeNews
    .map((item) => {
      const tagName = item.link ? "a" : "article";
      const href = item.link ? ` href="${item.link}" target="_blank" rel="noopener"` : "";
      const source = item.cta || (item.link ? "View source" : "Source link to be added");
      const variant = item.variant ? ` is-${item.variant}` : "";

      return `
        <${tagName} class="news-card reveal${variant}"${href}>
          <span class="news-image">
            <img src="${item.image}" alt="${item.imageAlt || item.title}" loading="lazy">
          </span>
          <span class="news-card-body">
            <span class="news-meta">${item.date}</span>
            <span class="status-pill">${item.type}</span>
            <h3 class="news-title">${item.title}</h3>
            <p class="news-description">${item.description}</p>
            <span class="text-link">${source}</span>
          </span>
        </${tagName}>
      `;
    })
    .join("");
};

renderThemes();
renderResearchDetails();
renderResearchDetailPage();
renderPI();
renderTeamDirectory();
renderTeamPlaceholders();

if (window.siteData) {
  const pi = siteData.team.principalInvestigator;
  renderTimeline("[data-pi-education]", pi.education);
  renderTimeline("[data-pi-professional-experience]", pi.professionalExperience);
  renderTimeline("[data-pi-teaching-experience]", pi.teachingExperience);
  renderTimeline("[data-pi-awards]", pi.awards);
  renderList("[data-pi-academic-activities]", pi.academicActivities);
  renderScholarDashboard();
  renderPublications();
  renderHomeNews();
  renderComingSoonCards("[data-videos]", siteData.videos);
}

enhanceProfileLinks();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
