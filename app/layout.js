export const metadata = {
  title: 'Estancia San Francisco — Armá tu sándwich',
  description: 'Armá tu sándwich con nuestros fiambres y quesos. Reservá horario y retiralo sin esperar.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-AR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0F0F0F" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js" async></script>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        {children}
        <script src="/app.js" defer></script>
      </body>
    </html>
  );
}
