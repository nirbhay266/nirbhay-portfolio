const authStorageKey = "portfolioEditorPin";
const authAttemptsKey = "portfolioEditorAttempts";
const maxAuthAttempts = 5;
const lockoutMs = 15 * 60 * 1000;
const authHash = async (value) => {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return btoa(value);
};
const authForm = document.querySelector("#auth-form");
const storedAuthPin = localStorage.getItem(authStorageKey);
const authAttempts = JSON.parse(localStorage.getItem(authAttemptsKey) || '{"count":0,"lockedUntil":0}');
if (storedAuthPin) {
  document.querySelector("#auth-message").textContent = "Enter the owner password saved in this browser.";
  document.querySelector("#auth-submit").textContent = "Unlock editor";
  document.querySelector("#owner-pin").autocomplete = "current-password";
}
authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (authAttempts.lockedUntil > Date.now()) {
    const minutes = Math.ceil((authAttempts.lockedUntil - Date.now()) / 60000);
    document.querySelector("#auth-message").textContent = `Too many failed attempts. Try again in ${minutes} minute(s).`;
    return;
  }
  const pin = document.querySelector("#owner-pin").value;
  if (pin.length < 8) {
    document.querySelector("#auth-message").textContent = "Use at least 8 characters.";
    return;
  }
  const storedPin = localStorage.getItem(authStorageKey);
  if (storedPin && storedPin !== await authHash(pin)) {
    authAttempts.count += 1;
    if (authAttempts.count >= maxAuthAttempts) {
      authAttempts.count = 0;
      authAttempts.lockedUntil = Date.now() + lockoutMs;
    }
    localStorage.setItem(authAttemptsKey, JSON.stringify(authAttempts));
    document.querySelector("#auth-message").textContent = "That password is not correct for this browser.";
    return;
  }
  if (!storedPin) {
    localStorage.setItem(authStorageKey, await authHash(pin));
  }
  localStorage.removeItem(authAttemptsKey);
  document.body.classList.remove("editor-locked");
  document.querySelector("#auth-message").textContent = "Editor unlocked.";
});
document.querySelector("#lock-editor").addEventListener("click", () => {
  document.body.classList.add("editor-locked");
  document.querySelector("#owner-pin").value = "";
  document.querySelector("#auth-message").textContent = "Enter the owner password saved in this browser.";
});
const storageKey = "portfolioData";
const defaults = { basic: { name: "Nirbhay Kumar", title: "Data Aspirant & Data Engineer", email: "nirbhaykkr6@gmail.com", phone: "+91 9905882526", location: "East Champaran, India", tagline: "I build analytical solutions that turn raw data into meaningful business insights using SQL, Power BI, Python, DAX, and ETL.", about: "Hi, I’m Nirbhay Kumar, a Data Aspirant with a strong foundation in Data Analytics and Business Intelligence. I specialize in SQL, Power BI, Python, DAX, and ETL, and enjoy building end-to-end analytical solutions. I am pursuing a Master of Computer Applications from Lovely Professional University.", learning: "Advanced Power BI (DAX) · Apache Spark · PySpark · Databricks · Azure", linkedin: "https://www.linkedin.com/in/nirbhay-kumar-32b947262/", github: "https://github.com/nirbhay266", kaggle: "https://www.kaggle.com/nirbhaykkr6", youtube: "https://www.youtube.com/" }, skills: ["Excel", "Power BI", "SQL", "Python", "Java", "NumPy", "Pandas", "Spark", "PySpark", "Snowflake", "Git"], experience: [], projects: window.portfolioProjects || [], certificates: [{ name: "Excel: Mother of Business Intelligence", provider: "Codebasics", year: "2026", link: "" }, { name: "Get Job Ready: Power BI Data Analytics", provider: "Codebasics", year: "2026", link: "" }, { name: "SQL Beginner to Advanced for Data Professionals", provider: "Codebasics", year: "2026", link: "" }] };
let data = JSON.parse(localStorage.getItem(storageKey) || "null") || defaults;
if (!Array.isArray(data.projects) || data.projects.some((project) => !project || !project.title || !project.tool)) {
  data.projects = window.portfolioProjects || [];
  localStorage.setItem(storageKey, JSON.stringify(data));
}
if (data.profileSeedVersion !== 1) {
  data.basic = { ...defaults.basic, photoData: data.basic.photoData, resumeData: data.basic.resumeData };
  data.skills = defaults.skills;
  data.certificates = defaults.certificates;
  data.profileSeedVersion = 1;
  localStorage.setItem(storageKey, JSON.stringify(data));
}
const $ = (selector, root = document) => root.querySelector(selector);
const esc = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
function field(label, name, value, type = "text", full = false) { return `<label class="${full ? "full" : ""}">${label}<input data-field="${name}" type="${type}" value="${esc(value)}"></label>`; }
function save() { localStorage.setItem(storageKey, JSON.stringify(data)); showToast("Changes saved in this browser."); }
function showToast(message) { const toast = $("#toast"); toast.textContent = message; toast.style.display = "block"; setTimeout(() => { toast.style.display = "none"; }, 2200); }
function renderBasic() { Object.entries(data.basic).forEach(([key, value]) => { const input = $(`#${key}`); if (input && input.type !== "file") input.value = value ?? ""; }); }
function renderExperiences() { $("#experience-editor").innerHTML = data.experience.map((item, index) => `<div class="repeat-card" data-index="${index}"><button class="remove" data-remove="experience">Remove</button><div class="form-grid">${field("Period", "period", item.period)}${field("Role", "role", item.role)}${field("Company / organization", "company", item.company)}${field("Description", "description", item.description, "text", true)}</div></div>`).join(""); }
function projectImage(label, key, item) { const imageIndex = Number(key.replace("image", "")) - 1; const current = item[key] || item.images?.[imageIndex] || ""; return `<label>${label} <span class="hint">Select an image or use a published URL</span><input data-field="${key}" data-file-field type="file" accept="image/*"><input data-field="${key}" value="${esc(current)}" placeholder="assets/projects/project-name/screenshot.png"></label>`; }
function renderProjects() { $("#project-editor").innerHTML = data.projects.map((item, index) => `<div class="repeat-card project-editor" data-index="${index}"><button class="remove" data-remove="project">Remove</button><div class="form-grid">${field("Project type", "tool", item.tool)}${field("Domain / function", "domain", item.domain)}${field("Other tools", "otherTools", item.otherTools)}${field("Project title", "title", item.title)}${field("Short info (150–300 characters)", "summary", item.summary, "text", true)}${field("Thumbnail path or URL", "thumbnail", item.thumbnail, "text", true)}${field("Full project description", "description", item.description, "text", true)}${projectImage("Screenshot 1", "image1", item)}${field("Screenshot 1 description", "image1Description", item.image1Description)}${projectImage("Screenshot 2", "image2", item)}${field("Screenshot 2 description", "image2Description", item.image2Description)}${projectImage("Screenshot 3", "image3", item)}${field("Screenshot 3 description", "image3Description", item.image3Description)}${field("Project video / YouTube URL", "video", item.video)}${field("Live Power BI dashboard URL", "live", item.live)}${field("LinkedIn post URL", "linkedin", item.linkedin)}${field("GitHub URL", "github", item.github)}${field("Project platform name", "platform", item.platform)}${field("Project URL", "projectUrl", item.projectUrl)}<label>Show project on portfolio<select data-field="visible"><option value="true" ${item.visible !== false ? "selected" : ""}>Yes</option><option value="false" ${item.visible === false ? "selected" : ""}>No</option></select></label></div></div>`).join(""); }
function certificateImage(item) { return `<label class="full">Certificate image <span class="hint">Choose an image or use a hosted/assets URL</span><input data-file-field="certificateImage" type="file" accept="image/*"><input data-field="image" value="${esc(item.image || "")}" placeholder="assets/certificates/certificate-name.png"></label>`; }
function renderCertificates() { $("#certificate-editor").innerHTML = data.certificates.map((item, index) => `<div class="repeat-card" data-index="${index}"><button class="remove" data-remove="certificate">Remove</button><div class="form-grid">${field("Certificate name", "name", item.name)}${field("Provider", "provider", item.provider)}${field("Year", "year", item.year)}${field("Verification URL", "link", item.link, "url")}${certificateImage(item)}${item.image ? `<img class="certificate-editor-preview" src="${item.image}" alt="${esc(item.name)} preview">` : ""}</div></div>`).join(""); }
function render() { renderBasic(); $("#skills").value = data.skills.join(", "); renderExperiences(); renderProjects(); renderCertificates(); }
function collectRepeat(container, keys) { return [...$(container).children].map((card) => { const item = {}; keys.forEach((key) => { const input = $(`[data-field="${key}"]:not([type="file"])`, card); if (input) item[key] = input.dataset.value || input.value; }); return item; }); }
function collect() { const savedAssets = { photoData: data.basic.photoData, resumeData: data.basic.resumeData }; data.basic = { ...savedAssets }; ["name", "title", "email", "phone", "location", "tagline", "about", "learning", "linkedin", "github", "kaggle", "youtube"].forEach((key) => data.basic[key] = $(`#${key}`).value); data.skills = $("#skills").value.split(",").map((skill) => skill.trim()).filter(Boolean); data.experience = collectRepeat("#experience-editor", ["period", "role", "company", "description"]); data.certificates = collectRepeat("#certificate-editor", ["name", "provider", "year", "link", "image"]); }
document.querySelectorAll(".tabs button").forEach((button) => button.addEventListener("click", () => { document.querySelectorAll(".tabs button").forEach((item) => item.classList.remove("active")); document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active")); button.classList.add("active"); $(`#tab-${button.dataset.tab}`).classList.add("active"); }));
$("#save-all").addEventListener("click", () => { collect(); save(); });
$("#add-experience").addEventListener("click", () => { data.experience.push({ period: "", role: "", company: "", description: "" }); renderExperiences(); });
$("#add-project").addEventListener("click", () => openProjectForm());
$("#add-certificate").addEventListener("click", () => { data.certificates.push({ name: "", provider: "", year: "", link: "" }); renderCertificates(); });
document.addEventListener("click", (event) => { const button = event.target.closest("[data-remove]"); if (!button) return; const card = button.closest(".repeat-card"); const index = Number(card.dataset.index); const target = button.dataset.remove === "project" ? "projects" : button.dataset.remove === "experience" ? "experience" : "certificates"; data[target].splice(index, 1); render(); });
$("#export-data").addEventListener("click", () => { collect(); const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "portfolio-backup.json"; link.click(); });
$("#import-data").addEventListener("change", async (event) => { const [file] = event.target.files; if (!file) return; data = JSON.parse(await file.text()); render(); save(); });
document.addEventListener("change", (event) => {
  const input = event.target;
  if (!input.matches("[data-file-field], #photo, #resume")) return;
  const [file] = input.files;
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (input.id === "photo") { data.basic.photoData = reader.result; save(); }
    else if (input.id === "resume") data.basic.resumeData = reader.result;
    else {
      const fieldInput = input.closest("label").querySelector("input:not([type='file'])");
      fieldInput.dataset.value = reader.result;
      if (input.dataset.fileField === "certificateImage") {
        const card = input.closest(".repeat-card");
        data.certificates[Number(card.dataset.index)].image = reader.result;
        renderCertificates();
        save();
      }
    }
    showToast(`${file.name} ready. Click Save changes.`);
  };
  reader.readAsDataURL(file);
});
render();
renderProjects = function () {
  $("#project-editor").innerHTML = data.projects.map((item, index) => `<div class="project-row" data-index="${index}"><div class="project-row-title"><strong>${esc(item.title || "Untitled project")}</strong><small>${esc(item.tool || "Other")} · ${esc(item.domain || "No domain added")}</small></div><button type="button" class="status-toggle ${item.visible !== false ? "active" : "draft"}" data-toggle-project="${index}" aria-pressed="${item.visible !== false}" title="Click to ${item.visible !== false ? "unpublish" : "publish"} this project">${item.visible !== false ? "Active" : "Inactive"}</button><div class="project-actions"><button type="button" data-edit-project="${index}" title="Edit project">✎</button><button type="button" data-duplicate-project="${index}" title="Duplicate project">⧉</button><button type="button" class="delete" data-delete-project="${index}" title="Delete project">⌫</button></div></div>`).join("");
};
renderProjects();
const projectFormKeys = ["tool", "domain", "otherTools", "title", "summary", "thumbnail", "description", "image1", "image1Description", "image2", "image2Description", "image3", "image3Description", "video", "live", "linkedin", "github", "platform", "projectUrl", "visible"];
let editingProjectIndex = -1;
function openProjectForm(index = -1) {
  editingProjectIndex = index;
  const item = index >= 0 ? data.projects[index] : { tool: "Excel", visible: true, images: [] };
  $("#project-form-title").textContent = index >= 0 ? "Edit Project" : "New Project";
  projectFormKeys.forEach((key) => {
    const input = $(`[data-form="${key}"]`);
    const imageIndex = Number(key.replace("image", "")) - 1;
    input.value = key.startsWith("image") && item[key] === undefined ? item.images?.[imageIndex] || "" : item[key] ?? "";
  });
  $("#project-form-modal").showModal();
}
function readProjectForm() {
  const item = {};
  projectFormKeys.forEach((key) => { item[key] = $(`[data-form="${key}"]`).value; });
  item.visible = item.visible !== "false";
  item.images = [item.image1, item.image2, item.image3].filter(Boolean);
  item.year = editingProjectIndex >= 0 ? data.projects[editingProjectIndex].year : new Date().getFullYear().toString();
  return item;
}
$("#project-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const item = readProjectForm();
  if (editingProjectIndex >= 0) data.projects[editingProjectIndex] = item;
  else data.projects.push(item);
  renderProjects();
  save();
  $("#project-form-modal").close();
});
$("#close-project").addEventListener("click", () => $("#project-form-modal").close());
$("#cancel-project").addEventListener("click", () => $("#project-form-modal").close());
document.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-toggle-project]");
  const edit = event.target.closest("[data-edit-project]");
  const duplicate = event.target.closest("[data-duplicate-project]");
  const remove = event.target.closest("[data-delete-project]");
  if (toggle) { const index = Number(toggle.dataset.toggleProject); data.projects[index].visible = data.projects[index].visible === false; renderProjects(); save(); showToast(data.projects[index].visible ? "Project published." : "Project unpublished."); }
  if (edit) openProjectForm(Number(edit.dataset.editProject));
  if (duplicate) { data.projects.splice(Number(duplicate.dataset.duplicateProject) + 1, 0, { ...data.projects[Number(duplicate.dataset.duplicateProject)], title: `${data.projects[Number(duplicate.dataset.duplicateProject)].title} (Copy)` }); renderProjects(); }
  if (remove && window.confirm("Delete this project from your portfolio?")) { data.projects.splice(Number(remove.dataset.deleteProject), 1); renderProjects(); save(); }
});
