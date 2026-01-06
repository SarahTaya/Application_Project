// src/component/SectionIcon.jsx
export default function SectionIcon({ Icon, color = "#1fb91fff", size = 22 }) {
  return (
    <Icon
      style={{
        color,
        fontSize: size,
      }}
    />
  );
}
