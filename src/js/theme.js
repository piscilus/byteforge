/* https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f */
document.addEventListener('DOMContentLoaded', () => {
    function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
        if (localStorageTheme !== null) {
            return localStorageTheme;
        }
        if (systemSettingDark.matches) {
            return "dark";
        }
        return "light";
    }
    function updateButton({ buttonEl, isDark }) {
        const newCta = isDark ? "\u263C" : "\u263E";
        buttonEl.setAttribute("aria-label", newCta);
        buttonEl.innerText = newCta;
    }
    function updateThemeOnHtmlEl({ theme }) {
        document.querySelector("html").setAttribute("data-theme", theme);
    }

    const button = document.querySelector("[data-theme-toggle]");
    const localStorageTheme = localStorage.getItem("theme");
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
    let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });
    updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
    updateThemeOnHtmlEl({ theme: currentThemeSetting });
    button.addEventListener("click", (event) => {
        const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        updateButton({ buttonEl: button, isDark: newTheme === "dark" });
        updateThemeOnHtmlEl({ theme: newTheme });
        currentThemeSetting = newTheme;
        callUpdateAll();
    });

    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
        coll[i].click();
    }
});
