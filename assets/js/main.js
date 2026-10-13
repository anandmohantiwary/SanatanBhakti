(() => {
  const depth = Number(document.body.dataset.depth || 0);
  const base = depth ? "../" : "";
  const navItems = [
    ["Home", "index.html"],
    ["Puja Vidhi", "puja/index.html"],
    ["Samagri & Mantras", "library/index.html"],
    ["Bhajan & Path", "bhajan/index.html"],
    ["Gallery", "gallery/index.html"],
    ["Enquiry", "enquiry/index.html"]
  ];
  const nav = document.querySelector(".site-nav");
  if (nav) {
    nav.innerHTML = navItems.map(([label, href]) => `<a href="${base}${href}">${label}</a>`).join("");
    const current = location.pathname.replace(/\/+$/, "");
    nav.querySelectorAll("a").forEach(a => {
      const target = new URL(a.href, location.href).pathname.replace(/\/+$/, "");
      if (target === current || (a.textContent === "Puja Vidhi" && current.endsWith("/puja/satyanarayan-puja.html"))) a.setAttribute("aria-current", "page");
    });
  }
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  const toggle = document.querySelector(".menu-toggle");
  if (toggle && nav) toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "✕" : "☰";
  });

  document.querySelectorAll("[data-search-form]").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const query = new FormData(form).get("q").toString().trim();
      const localList = document.querySelector(".searchable-list");
      if (localList) {
        filterList(query);
      } else {
        location.href = `${base}puja/index.html?q=${encodeURIComponent(query)}`;
      }
    });
  });

  function filterList(query) {
    const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    document.querySelectorAll(".searchable-item").forEach(item => {
      const text = `${item.textContent} ${item.dataset.search || ""}`.toLocaleLowerCase();
      const matches = terms.every(term => text.includes(term));
      item.hidden = !matches;
      if (matches) count++;
    });
    const empty = document.querySelector("[data-empty-state]");
    if (empty) empty.hidden = count !== 0;
  }
  const query = new URLSearchParams(location.search).get("q");
  if (query && document.querySelector(".searchable-list")) {
    const input = document.querySelector("[data-search-form] input[name=q]");
    if (input) input.value = query;
    filterList(query);
  }

  const enquiry = document.querySelector("#enquiry-form");
  if (enquiry) enquiry.addEventListener("submit", event => {
    event.preventDefault();
    if (!enquiry.reportValidity()) return;
    const data = new FormData(enquiry);
    const subject = `Puja enquiry: ${data.get("puja")}`;
    const body = [
      "Namaste,",
      "",
      "I would like to enquire about a puja / ceremony.",
      "",
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Puja / ceremony: ${data.get("puja")}`,
      `Preferred date: ${data.get("date") || "Not specified"}`,
      `City / locality: ${data.get("location") || "Not specified"}`,
      "",
      "Message:",
      data.get("message") || "No additional message",
      "",
      "Thank you."
    ].join("\n");
    const mailto = `mailto:anandmohantiwary@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = document.querySelector("#form-status");
    status.textContent = "Opening your email app with a prepared draft. Please review and send it there.";
    location.href = mailto;
  });
})();