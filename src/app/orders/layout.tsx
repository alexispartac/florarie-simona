

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      >
        <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-18 sm:py-20 md:py-24">
          {children}
        </div>
      </div>
  );
}