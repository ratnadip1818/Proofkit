export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
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
