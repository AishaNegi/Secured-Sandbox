const codeForm = document.getElementById("codeForm");
const codeInput = document.getElementById("codeInput");
const outputText = document.getElementById("outputText");
const execTime = document.getElementById("execTime");
const toggleTheme = document.getElementById("toggleTheme");
const downloadBtn = document.getElementById("downloadCode");

let isDark = false;

// Load code from localStorage
window.addEventListener("DOMContentLoaded", () => {
  codeInput.value = localStorage.getItem("savedCode") || "";

  // Load theme preference
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    isDark = true;
  }
});

// Save code to localStorage
codeInput.addEventListener("input", () => {
  localStorage.setItem("savedCode", codeInput.value);
});

// Handle form submission
codeForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const code = codeInput.value.trim();
  if (!code) return;

  outputText.textContent = "🔄 Running your code...";
  execTime.textContent = "";

  const startTime = performance.now();

  try {
    const response = await fetch("http://127.0.0.1:5000/run", {  // Ensure this URL points to your Flask server
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    const result = await response.json();
    const endTime = performance.now();

    outputText.textContent = result.output || "✅ Code ran successfully, but there was no output.";
    execTime.textContent = `⏱️ Execution Time: ${((endTime - startTime) / 1000).toFixed(2)} sec`;
  } catch (err) {
    outputText.textContent = "❌ Error executing your code.";
    console.error(err);
  }
});

// Toggle dark/light theme
toggleTheme.addEventListener("click", () => {
  isDark = !isDark;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Download code as .py
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([codeInput.value], { type: "text/x-python" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sandbox_code.py";
  link.click();
});

// Run with Ctrl+Enter
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    e.preventDefault();
    codeForm.requestSubmit();
  }
});
