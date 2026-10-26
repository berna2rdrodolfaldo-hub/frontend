import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "8px 14px",
        borderRadius: "20px",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-card)",
        color: "var(--text-primary)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontWeight: 600,
        transition: "all 0.2s ease"
      }}
    >
      {theme === "light" ? "Modo Oscuro" : " Modo Claro"}
    </button>
  );
}

export default ThemeToggle;