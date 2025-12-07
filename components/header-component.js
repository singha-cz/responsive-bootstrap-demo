class SiteHeader extends HTMLElement {
  connectedCallback() {
    if (!document.querySelector("link[data-bootstrap-icons]")) {
      const bi = document.createElement("link");
      bi.rel = "stylesheet";
      bi.href =
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css";
      bi.setAttribute("data-bootstrap-icons", "true");
      document.head.appendChild(bi);
    }

    // Zobrazení záhlaví a navigace bez iframe.
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg">
        <div class="container">
          <a class="navbar-brand fw-bold" href="/index.html">🍦 Zmrzlio</a>
          <button class="navbar-toggler" type="button" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item"><a class="nav-link" href="/index.html">Úvod</a></li>
              <li class="nav-item"><a class="nav-link" href="/about-us.html#about-us">O nás</a></li>
              <li class="nav-item"><a class="nav-link" href="/gallery.html#gallery">Galerie</a></li>
              <li class="nav-item"><a class="nav-link" href="/blog.html#blog">Blog</a></li>
              <li class="nav-item"><a class="nav-link" href="/offer.html#offer">Naše zmrzliny</a></li>
              <li class="nav-item"><a class="nav-link" href="/contact.html#contact">Kontakt</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <nav class="container mt-3 breadcrumbs" aria-label="breadcrumb" id="breadcrumb-nav">
        <ol class="breadcrumb">
          <li class="breadcrumb-item" id="home"><a href="/index.html"><i class="bi bi-house"></i></a></li>
          <li class="breadcrumb-item crumbs" aria-current="page" id="contact">Kontakt</li>
          <li class="breadcrumb-item crumbs" aria-current="page" id="about-us">O nás</li>
          <li class="breadcrumb-item crumbs" aria-current="page" id="gallery">Galerie</li>
          <li class="breadcrumb-item crumbs" aria-current="page" id="blog">Blog</li>
          <li class="breadcrumb-item active crumbs" aria-current="page" id="offer">Naše zmrzliny</li>
        </ol>
      </nav>
    `;

    // Základní chování collapse bez závislosti na Bootstrap JS
    const toggler = this.querySelector(".navbar-toggler");
    const collapse = this.querySelector(".navbar-collapse");

    function openCollapse() {
      collapse.classList.add("show");
      toggler.setAttribute("aria-expanded", "true");
      document.documentElement.classList.add("header-menu-open");
      document.body.style.overflow = "hidden";
    }

    function closeCollapse() {
      collapse.classList.remove("show");
      toggler.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("header-menu-open");
      document.body.style.overflow = "";
    }

    toggler.addEventListener("click", (e) => {
      e.stopPropagation();
      if (collapse.classList.contains("show")) closeCollapse();
      else openCollapse();
    });

    // Zavři po kliknutí na odkaz v menu
    this.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        closeCollapse();
      });
    });

    // Kliknutí mimo (na dokument) zavře menu
    document.addEventListener("click", (ev) => {
      if (!collapse.classList.contains("show")) return;
      const rect = collapse.getBoundingClientRect();
      // if click is outside the collapse element, close
      if (
        ev.clientY < rect.top ||
        ev.clientY > rect.bottom ||
        ev.clientX < rect.left ||
        ev.clientX > rect.right
      ) {
        closeCollapse();
      }
    });

    // Zavři po stisku Escape
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && collapse.classList.contains("show"))
        closeCollapse();
    });

    // Support hash-preserving navigation: default browser behavior is OK (no iframe)
    // Breadcrumbs: show only the crumb that matches the current hash (robust when pages
    // also contain elements with the same id). We can't rely on CSS :target because
    // the page content may capture the target; handle it in JS instead.
    const breadcrumbNav = this.querySelector("#breadcrumb-nav");
    const crumbs = Array.from(this.querySelectorAll(".crumbs"));

    function updateBreadcrumbs() {
      const hash = (window.location.hash || "").replace("#", "");
      if (!hash) {
        breadcrumbNav.style.display = "none";
        crumbs.forEach((c) => (c.style.display = ""));
        return;
      }

      // find matching crumb inside this component
      const match = crumbs.find((c) => c.id === hash);
      if (match) {
        breadcrumbNav.style.display = "block";
        crumbs.forEach((c) => {
          if (c === match) {
            c.style.display = "";
            c.classList.add("active");
          } else {
            c.style.display = "none";
            c.classList.remove("active");
          }
        });
      } else {
        // No matching crumb inside header (hide breadcrumbs)
        breadcrumbNav.style.display = "none";
        crumbs.forEach((c) => (c.style.display = ""));
      }
    }

    // Init and listen to hash changes
    updateBreadcrumbs();
    window.addEventListener("hashchange", updateBreadcrumbs);
  }
}

customElements.define("site-header", SiteHeader);

export default SiteHeader;
