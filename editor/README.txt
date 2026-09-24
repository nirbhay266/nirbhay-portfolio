PORTFOLIO EDITOR

Open editor.html in your browser to manage your portfolio without editing HTML. Existing starter projects are loaded into the Projects tab automatically.

Workflow:
1. Basic Info: enter name, title, contact details, about text, photo, and resume.
2. Skills & Exp: enter comma-separated skills and add as many experience records as needed.
3. Projects: click Add project. Complete type, domain, tools, title, short info, description, three screenshot paths and descriptions, video, Power BI, LinkedIn, GitHub, platform and project links. Choose whether it appears publicly.
4. Certificates: add certificate name, provider, year, and verification URL.
5. Save changes, then use View portfolio.
6. Use Export backup to save a JSON copy. Import it on another browser.

Managing existing projects:
- Open the Projects tab.
- Existing projects appear as a compact list with title, type, domain and status.
- Use the pencil button to open a focused Edit Project form.
- Use the duplicate button to copy a project as a starting point for a new one.
- Use the delete button to remove a project.
- Use Show Project on Portfolio = No to keep a project as a draft without displaying it.
- Click Save changes inside the project form. The list and public portfolio update immediately.

The project form follows the reference workflow: type, domain/function, other tools, title, short info, thumbnail, full description, three screenshots plus descriptions, video URL, Power BI URL, LinkedIn URL, GitHub URL, platform name, project link and active/draft status.

The editor stores content in browser localStorage. This works without a server but is browser-specific. For a public deployment, copy image/PDF files into the assets folder and publish the project with a static host.

Owner access:
- The editor asks you to create an owner PIN the first time it is opened in a browser.
- The PIN prevents casual access to the editor on that browser and remains separate from the public portfolio.
- The editor asks for the PIN each time the editor page is opened or revisited. Use “Lock editor” before leaving the computer.
- This is not server authentication. Anyone who can edit the site files or clear browser storage can bypass a browser-only lock. For real owner-only permissions on a hosted site, use a backend or CMS with server-side authentication.
- If you forget the PIN, click “Forgot PIN?” and confirm the reset. This removes only the PIN from this browser; it does not delete portfolio content. A hosted backend would be required for email-based password recovery.

Photo and resume:
- Choose the real photo and PDF in Basic Info, then click Save changes.
- Uploaded files are retained in the saved portfolio data; the public page uses the saved photo and resume download.
- A placeholder remains visible until a real photo is selected.
