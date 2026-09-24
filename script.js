const grid = document.querySelector("#project-grid");
const modal = document.querySelector("#project-modal");
const modalContent = document.querySelector("#modal-content");
const filters = document.querySelectorAll(".filter");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");
const profileImage = document.querySelector("#profile-image");
const savedPortfolio = JSON.parse(localStorage.getItem("portfolioData") || "null");
if (savedPortfolio && savedPortfolio.profileSeedVersion !== 1) {
  Object.assign(savedPortfolio.basic, {
    name: "Nirbhay Kumar",
    title: "Data Aspirant & Data Engineer",
    email: "nirbhaykkr6@gmail.com",
    phone: "+91 9905882526",
    location: "East Champaran, India",
    tagline: "I build analytical solutions that turn raw data into meaningful business insights using SQL, Power BI, Python, DAX, and ETL.",
    linkedin: "https://www.linkedin.com/in/nirbhay-kumar-32b947262/",
    github: "https://github.com/nirbhay266",
    kaggle: "https://www.kaggle.com/nirbhaykkr6",
    about: "Hi, I’m Nirbhay Kumar, a Data Aspirant with a strong foundation in Data Analytics and Business Intelligence. I specialize in SQL, Power BI, Python, DAX, and ETL, and enjoy building end-to-end analytical solutions. I am pursuing a Master of Computer Applications from Lovely Professional University.",
    learning: "Advanced Power BI (DAX) · Apache Spark · PySpark · Databricks · Azure"
  });
  savedPortfolio.profileSeedVersion = 1;
  localStorage.setItem("portfolioData", JSON.stringify(savedPortfolio));
}
const storedProjects = savedPortfolio?.projects?.length && savedPortfolio.projects.every((project) => project && project.title && project.tool) ? savedPortfolio.projects : portfolioProjects;
const configuredProjects = storedProjects.map((project) => ({
  ...project,
  tool: project.tool || "Other",
  title: project.title || "Untitled project",
  domain: project.domain || "Data & Business Analytics",
  summary: project.summary || "",
  description: project.description || "",
  images: Array.isArray(project.images) ? project.images : [],
  visible: project.visible !== false
}));

function projectCard(project, index) {
  const tone = project.tool.toLowerCase().replace(/\s+/g, "-");
  const thumbnail = project.thumbnail || project.images?.[0] || "assets/profile-placeholder.svg";
  const workLink = project.projectUrl || project.live || project.github || project.linkedin || "#";
  return `<article class="project-card" data-tool="${project.tool}" data-index="${index}" tabindex="0">
    <div class="project-thumb ${tone}"><img src="${thumbnail}" alt="${project.title} project thumbnail"><span class="tool-tag">${technologyBadge(project.tool)}${project.tool}</span></div>
    <div class="project-body"><h3>${project.title}</h3><p class="project-domain"><b>Domain/Function:</b> ${project.domain || "Data & Business Analytics"}</p><p>${project.summary || ""}</p><div class="project-footer"><a class="project-link" href="${workLink}" target="_blank" rel="noreferrer">See My Work ↗</a><span class="project-tool">${project.tool} Project</span></div></div>
  </article>`;
}

function technologyBadge(name) {
  const key = technologyKey(name);
  const labels = { python: "Py", sql: "SQL", excel: "X", "power-bi": "BI", adf: "ADF", generic: "•" };
  const colors = { python: "#3776ab", sql: "#1479b8", excel: "#217346", "power-bi": "#f2c811", adf: "#087cd1", generic: "#54645c" };
  const icon = labels[key] ? key : "generic";
  return `<svg class="technology-logo" viewBox="0 0 32 32" role="img" aria-label="${name} logo"><rect width="32" height="32" rx="7" fill="${colors[icon]}"></rect><text x="16" y="20" fill="${icon === "power-bi" ? "#624d00" : "#fff"}" font-size="${icon === "adf" ? "7" : "9"}" text-anchor="middle" font-family="Arial" font-weight="700">${labels[icon]}</text></svg>`;
}

function technologyKey(name) {
  return String(name || "other").toLowerCase().replace(/power bi/g, "power-bi").replace(/azure data factory/g, "adf").replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function renderProjects(filter = "all") {
  const visible = configuredProjects.filter((project) => project.visible !== false && (filter === "all" || project.tool === filter));
  grid.innerHTML = visible.map((project) => projectCard(project, configuredProjects.indexOf(project))).join("");
  document.querySelector("#project-count").textContent = String(configuredProjects.filter((project) => project.visible !== false).length).padStart(2, "0");
  grid.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", (event) => { if (!event.target.closest("a")) openProject(Number(card.dataset.index)); });
    card.addEventListener("keydown", (event) => { if (event.key === "Enter") openProject(Number(card.dataset.index)); });
  });
}

function openProject(index) {
  const project = configuredProjects[index];
  modalContent.innerHTML = `<div class="modal-inner"><small class="kicker">${project.tool} · ${project.domain} · ${project.year}</small><h2>${project.title}</h2><p>${project.description}</p><div class="modal-meta"><span><b>Tool</b>${project.tool}</span><span><b>Domain</b>${project.domain}</span><span><b>Year</b>${project.year}</span></div><div class="modal-images">${project.images.map((image, imageIndex) => `<img src="${image}" alt="${project.title} screenshot ${imageIndex + 1}">`).join("")}</div><div class="modal-actions"><a class="button dark" href="${project.live}" target="_blank" rel="noreferrer">See my work ↗</a>${project.video ? `<a class="button light" href="${project.video}" target="_blank" rel="noreferrer">Watch video ↗</a>` : ""}</div></div>`;
  modal.showModal();
}

filters.forEach((filter) => filter.addEventListener("click", () => {
  filters.forEach((item) => item.classList.remove("active"));
  filter.classList.add("active");
  renderProjects(filter.dataset.filter);
}));
document.querySelector(".modal-close").addEventListener("click", () => modal.close());
menuButton.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => nav.classList.remove("open")));
profileImage.addEventListener("error", () => {
  profileImage.removeAttribute("src");
  profileImage.alt = "Nirbhay Kumar profile photo";
});
renderProjects();

if (savedPortfolio) {
  const basic = savedPortfolio.basic || {};
  if (basic.name) document.querySelector("#portfolio-name").textContent = basic.name;
  if (basic.title) document.querySelector("#portfolio-title").textContent = basic.title;
  if (basic.tagline) document.querySelector("#portfolio-tagline").textContent = basic.tagline;
  if (basic.about) document.querySelector("#about-text").textContent = basic.about;
  if (basic.location) document.querySelector("#location-text").textContent = basic.location;
  if (basic.photoData) document.querySelector("#profile-image").src = basic.photoData;
  if (basic.resumeData) {
    const resumeLink = document.querySelector("a[href*='assets/resume']");
    resumeLink.href = basic.resumeData;
    resumeLink.download = "resume.pdf";
  }
  const socialMap = { linkedin: ".socials a:nth-child(1)", github: ".socials a:nth-child(2)", kaggle: ".socials a:nth-child(3)", youtube: ".socials a:nth-child(4)" };
  Object.entries(socialMap).forEach(([key, selector]) => { if (basic[key]) document.querySelector(selector).href = basic[key]; });
  if (basic.email) document.querySelector(".contact-links a[href^='mailto:']").href = `mailto:${basic.email}`;
  if (basic.phone) { const phoneLink = document.querySelector(".contact-links a[href^='tel:']"); phoneLink.href = `tel:${basic.phone.replace(/[^\d+]/g, "")}`; phoneLink.textContent = basic.phone; }
  if (savedPortfolio.skills?.length) document.querySelector("#skills-list").innerHTML = `<div><h3>Skills</h3>${savedPortfolio.skills.map((skill) => `<span data-tech="${technologyKey(skill)}">${technologyBadge(skill)}${skill}</span>`).join("")}</div>`;
  if (savedPortfolio.experience?.length) document.querySelector("#experience-list").innerHTML = savedPortfolio.experience.map((item) => `<article><time>${item.period}</time><div><h3>${item.role}</h3><p>${item.company}</p><p>${item.description}</p></div></article>`).join("");
  if (savedPortfolio.certificates?.length) {
    document.querySelector("#certificate-count").textContent = String(savedPortfolio.certificates.length).padStart(2, "0");
    document.querySelector("#certificates-list").innerHTML = savedPortfolio.certificates.map((item) => `<article>${item.image ? `<img class="certificate-image" src="${item.image}" alt="${item.name} certificate">` : "<b>✦</b>"}<div><h3>${item.name}</h3><p>${item.provider} · ${item.year}</p></div><a href="${item.link || item.image || "#"}" target="_blank" rel="noreferrer">View ↗</a></article>`).join("");
  }
}
