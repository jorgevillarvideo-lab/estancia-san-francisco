// Página principal: renderiza el HTML estructural de la app.
// Toda la lógica está en /public/app.js (vanilla JS) que se carga desde layout.js
export default function Home() {
  return (
    <>
      {/* VISTA BIENVENIDA */}
      <section className="vista vista-bienvenida" data-vista="bienvenida">
        <div className="bienvenida-wrap">
          <div className="bienvenida-logo">
            <img src="/logo.png" alt="Estancia San Francisco" className="logo-img" />
          </div>
          <div className="bienvenida-card" id="bienvenida-contenido"></div>
          <p className="bienvenida-sucursal" id="bienvenida-sucursal">
            Sucursal El Cano · Av. El Cano 3202
          </p>
        </div>
      </section>

      {/* VISTA LANDING */}
      <section className="vista vista-landing" data-vista="landing" hidden>
        <header className="header-membrete">
          <span>Desde 1987</span>
          <span id="fecha-hoy">Fiambrería</span>
        </header>

        <div className="hero">
          <div className="logo-marca">
            <img src="/logo.png" alt="Estancia San Francisco" className="logo-img" />
            <span className="marca-sucursal" id="sucursal-nombre">
              Sucursal El Cano · Av. El Cano 3202
            </span>
          </div>

          <p className="saludo-personal" id="saludo-personal" hidden></p>

          <p className="kicker">Pedí desde donde estés · Retirá sin hacer cola</p>
          <h1 className="titulo-principal">
            Armá tu<br />
            <span className="acento">sándwich</span>
          </h1>
          <p className="bajada">
            Elegí pan, fiambres y quesos. Confirmá el pedido y pasalo a buscar en 15 minutos.
            Lo pagás por peso al retirar.
          </p>
          <div className="acciones">
            <button className="btn-stamp" data-ir-a="menu" type="button">Empezar mi pedido →</button>
            <button className="btn-stamp btn-ghost" data-ir-a="historial" type="button">Mis pedidos</button>
          </div>
          <div id="landing-favoritos"></div>
        </div>

        <div className="pasos-info">
          <div className="paso-info">
            <div className="paso-num">01</div>
            <h3>Elegí ingredientes</h3>
            <p>Cuatro panes, veinte fiambres, cinco quesos, vegetales y condimentos de nuestra fiambrería.</p>
          </div>
          <div className="paso-info">
            <div className="paso-num">02</div>
            <h3>Confirmá el pedido</h3>
            <p>Dejás tu nombre y teléfono. En 15 minutos lo tenés listo para retirar. Sin hacer fila.</p>
          </div>
          <div className="paso-info">
            <div className="paso-num">03</div>
            <h3>Retirá y pagá</h3>
            <p>Pesamos delante tuyo. Efectivo, débito, crédito o transferencia.</p>
          </div>
        </div>

        <footer className="footer-sello">
          <span id="footer-sucursal">Estancia San Francisco · El Cano</span>
          <button
            className="link-cerrar-sesion"
            id="btn-cerrar-sesion"
            type="button"
            hidden
          >
            Cerrar sesión
          </button>
        </footer>
      </section>

      {/* VISTA WIZARD */}
      <section className="vista vista-wizard" data-vista="wizard" hidden>
        <header className="header-app">
          <button className="logo-link" data-ir-a="landing" type="button" aria-label="Inicio">
            <img src="/logo.png" alt="Estancia San Francisco" className="logo-img-mini" />
          </button>
          <button className="link-historial" data-ir-a="historial" type="button">Mis pedidos →</button>
        </header>

        <div className="wizard-wrap">
          <div className="progreso" id="progreso"></div>
          <div className="paso-contenido" id="paso-contenido"></div>
          <div className="error-box" id="error-box" hidden></div>
          <div className="nav-wizard">
            <button className="btn-stamp btn-ghost" id="btn-atras" type="button">← Atrás</button>
            <button className="btn-stamp" id="btn-adelante" type="button">Siguiente →</button>
          </div>
        </div>
      </section>

      {/* VISTA TICKET */}
      <section className="vista vista-ticket" data-vista="ticket" hidden>
        <button className="logo-link logo-ticket" data-ir-a="landing" type="button">
          <img src="/logo.png" alt="Estancia San Francisco" className="logo-img-mini" />
        </button>

        <article className="ticket" id="ticket"></article>

        <div className="acciones-ticket">
          <button className="btn-stamp" id="btn-enviar-wa" type="button">Enviar pedido por WhatsApp</button>
          <div className="acciones-ticket-sec">
            <button className="btn-fav-ticket" id="btn-fav-ticket" type="button">
              <span className="fav-star">☆</span> Guardar favorito
            </button>
            <button className="btn-repetir" id="btn-repetir-ticket" type="button">Repetir pedido →</button>
          </div>
          <div className="acciones-ticket-sec">
            <button className="btn-stamp btn-ghost" data-ir-a="landing" type="button">Inicio</button>
            <button className="btn-stamp btn-ghost" data-ir-a="menu" type="button">Otro pedido</button>
          </div>
        </div>

        <p className="aviso-ticket">
          Guardá este ticket o tomale captura. Tocá <strong>Enviar por WhatsApp</strong> para confirmar el pedido al local.
        </p>
      </section>

      {/* VISTA HISTORIAL */}
      <section className="vista vista-historial" data-vista="historial" hidden>
        <header className="header-app">
          <button className="logo-link" data-ir-a="landing" type="button">
            <img src="/logo.png" alt="Estancia San Francisco" className="logo-img-mini" />
          </button>
        </header>

        <div className="historial-wrap">
          <span className="kicker">Tus pedidos anteriores</span>
          <h2 className="titulo-medio">Historial</h2>
          <div id="favoritos-historial"></div>
          <div id="lista-historial"></div>
        </div>
      </section>
    </>
  );
}
