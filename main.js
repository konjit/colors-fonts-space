document.addEventListener("DOMContentLoaded", function () {
  // Theme Toggle Functionality
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  // Check if dark theme is saved in localStorage
  if (localStorage.getItem("darkTheme") === "true") {
    body.classList.add("dark-theme");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", function () {
    body.classList.toggle("dark-theme");

    if (body.classList.contains("dark-theme")) {
      themeToggle.textContent = "☀️";
      localStorage.setItem("darkTheme", "true");
    } else {
      themeToggle.textContent = "🌙";
      localStorage.setItem("darkTheme", "false");
    }
  });

  // Font Picker Functionality
  const fontSelect = document.getElementById("fontSelect");

  fontSelect.addEventListener("change", function () {
    document.body.style.fontFamily = this.value;
  });

  // Color Picker Functionality
  const colorInputs = document.querySelectorAll('input[type="color"]');
  const hexInputs = document.querySelectorAll(".hex-input");

  // Sync color inputs with hex inputs
  colorInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const varName = this.dataset.var;
      const hexInput = document.querySelector(
        `.hex-input[data-var="${varName}"]`
      );

      document.documentElement.style.setProperty(varName, this.value);
      hexInput.value = this.value;
    });
  });

  // Sync hex inputs with color inputs
  hexInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const varName = this.dataset.var;
      const colorInput = document.querySelector(
        `input[type="color"][data-var="${varName}"]`
      );

      // Make sure input is a valid hex color
      if (/^#[0-9A-F]{6}$/i.test(this.value)) {
        document.documentElement.style.setProperty(varName, this.value);
        colorInput.value = this.value;
      }
    });
  });

  // Reset button functionality
  const resetButton = document.getElementById("resetColors");

  resetButton.addEventListener("click", function () {
    // Default colors for light theme
    const defaultColors = {
      "--bg-color": "#f5f5f9",
      "--surface-color": "#ffffff",
      "--primary-color": "#696cff",
      "--primary-color-dark": "#5659cc",
      "--secondary-color": "#10B981",
      "--accent-color": "#F59E0B",
      "--text-color": "#788089",
      "--hover-color": "#e7e7ff",
      "--success-color": "#38A169",
      "--error-color": "#E53E3E",
      "--warning-color": "#F6AD55",
      "--info-color": "#4299E1",
      "--success-bg-color": "#38A1691A",
      "--warning-bg-color": "#F6AD551A",
      "--error-bg-color": "#E53E3E1A",
    };

    // Reset each color to default
    for (const [variable, value] of Object.entries(defaultColors)) {
      document.documentElement.style.setProperty(variable, value);

      const colorInput = document.querySelector(
        `input[type="color"][data-var="${variable}"]`
      );
      const hexInput = document.querySelector(
        `.hex-input[data-var="${variable}"]`
      );

      if (colorInput) colorInput.value = value;
      if (hexInput) hexInput.value = value;
    }
  });

  // Demo elements for interactive features
  const focusDemo = document.querySelector(".focus-demo");
  if (focusDemo) {
    focusDemo.addEventListener("focus", function () {
      this.placeholder = "This is focused state!";
    });

    focusDemo.addEventListener("blur", function () {
      this.placeholder = "Click me!";
    });
  }

  // Function to get and export current color theme
  window.exportColorTheme = function () {
    const theme = {};
    const cssVars = [
      "--bg-color",
      "--surface-color",
      "--primary-color",
      "--primary-color-dark",
      "--secondary-color",
      "--accent-color",
      "--text-color",
      "--text-secondary-color",
      "--heading-color",
      "--hover-color",
      "--border-color",
      "--success-color",
      "--error-color",
      "--warning-color",
      "--info-color",
      "--disabled-bg",
      "--disabled-text",
    ];

    cssVars.forEach((varName) => {
      theme[varName] = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
    });

    const isDarkMode = body.classList.contains("dark-theme");
    const themeString = JSON.stringify(
      {
        isDarkMode,
        colors: theme,
      },
      null,
      2
    );

    console.log("Current Theme:");
    console.log(themeString);

    // Create a "download" of the theme
    const blob = new Blob([themeString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isDarkMode ? "dark-theme.json" : "light-theme.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return theme;
  };

  // Add keyboard shortcut to export theme (Ctrl+E)
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "e") {
      e.preventDefault();
      window.exportColorTheme();
    }
  });
});
