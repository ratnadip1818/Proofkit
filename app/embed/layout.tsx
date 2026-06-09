export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        html, body {
          background: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
        }
        * { box-sizing: border-box; }
      `}</style>
      {children}
    </>
  );
}
