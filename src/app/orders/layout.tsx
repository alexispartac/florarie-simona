

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="min-h-screen bg-[var(--secondary)] relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/25 via-[var(--primary)]/15 to-[var(--primary)]/30"
          style={{ backgroundBlendMode: 'overlay' }}
        />
        <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-18 sm:py-20 md:py-24 relative z-10">
          {children}
        </div>
      </div>
  );
}