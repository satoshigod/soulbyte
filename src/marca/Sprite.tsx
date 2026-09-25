/** Íconos del sitio (símbolos SVG referenciados con <use href="#i-…" />). Se pinta una vez en el layout. */
export function Sprite() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }} aria-hidden="true">
      <symbol id="i-bandera" viewBox="0 0 24 24"><path d="M5.5 21V3.5" /><path d="M5.5 4.5h12l-2.6 4.25L17.5 13h-12" /></symbol>
<symbol id="i-globo" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5z" /></symbol>
<symbol id="i-camion" viewBox="0 0 24 24"><path d="M4.8 16H3.5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1V16h-5.2" /><path d="M13.5 9h3.9l3.1 3.6V15a1 1 0 0 1-1 1h-.7M13.5 16h1.7" /><circle cx="6.5" cy="16.5" r="1.8" /><circle cx="17" cy="16.5" r="1.8" /></symbol>
<symbol id="i-tienda" viewBox="0 0 24 24"><path d="M4 9.5L5.5 4h13L20 9.5" /><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" /><path d="M5 11.5V20h14v-8.5" /><path d="M10 20v-4.5h4V20" /></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.3-4.6A7.5 7.5 0 1 1 20 11.5z" /><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" /></symbol>
<symbol id="i-grafico" viewBox="0 0 24 24"><path d="M4 4v16h16" /><path d="M7.5 14.5l3.5-4 3 3 5-6" /></symbol>
<symbol id="i-imagen" viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5l-4.8-4.8L6 19.5" /></symbol>
<symbol id="i-buscar" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.3" /><path d="M20 20l-4.4-4.4" /></symbol>
<symbol id="i-cajas" viewBox="0 0 24 24"><path d="M3.5 7.5L12 3.5l8.5 4-8.5 4z" /><path d="M3.5 7.5v9l8.5 4 8.5-4v-9" /><path d="M12 11.5v9" /></symbol>
<symbol id="i-datos" viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" /><path d="M4.5 5.5v6.2c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8V5.5" /><path d="M4.5 11.7v6.5c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8v-6.5" /></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></symbol>
<symbol id="i-check-circulo" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8.2 12.3l2.6 2.6 5-5.6" /></symbol>
<symbol id="i-escudo" viewBox="0 0 24 24"><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z" /><path d="M8.8 12l2.2 2.2 4.3-4.4" /></symbol>
<symbol id="i-flecha" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></symbol>
<symbol id="i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></symbol>
<symbol id="i-rayo" viewBox="0 0 24 24"><path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" /></symbol>
<symbol id="i-capas" viewBox="0 0 24 24"><path d="M12 3.5l8.5 4.5L12 12.5 3.5 8z" /><path d="M3.5 12.5L12 17l8.5-4.5" /><path d="M3.5 16.5L12 21l8.5-4.5" /></symbol>
<symbol id="i-carrito" viewBox="0 0 24 24"><circle cx="9.5" cy="19.5" r="1.4" /><circle cx="17" cy="19.5" r="1.4" /><path d="M3 4h2.2l2.3 11h10.2l2.1-7.5H6.4" /></symbol>
<symbol id="i-porcentaje" viewBox="0 0 24 24"><path d="M18.5 5.5l-13 13" /><circle cx="7.5" cy="7.5" r="2.4" /><circle cx="16.5" cy="16.5" r="2.4" /></symbol>
<symbol id="i-llave" viewBox="0 0 24 24"><circle cx="8" cy="15.5" r="3.6" /><path d="M10.6 12.9L19.5 4M16.3 7.2l2.4 2.4M14 9.5l2 2" /></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></symbol>
<symbol id="i-calendario" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></symbol>
<symbol id="i-campana" viewBox="0 0 24 24"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></symbol>
<symbol id="i-usuarios" viewBox="0 0 24 24"><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5" /><path d="M16 5.6a3 3 0 0 1 0 5.8M18.3 14.6c1.5.8 2.4 2.4 2.7 4.9" /></symbol>
<symbol id="i-avion" viewBox="0 0 24 24"><path d="M21 3.5L10.5 14" /><path d="M21 3.5l-6.5 17-4-6.5-6.5-4z" /></symbol>
<symbol id="i-pausa" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M10 9v6M14 9v6" /></symbol>
<symbol id="i-chevron" viewBox="0 0 24 24"><path d="M6.5 9.5l5.5 5.5 5.5-5.5" /></symbol>
<symbol id="i-documento" viewBox="0 0 24 24"><path d="M14 3.5H7a1.5 1.5 0 0 0-1.5 1.5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8z" /><path d="M14 3.5V8h4.5" /><path d="M9 12.5h6M9 16h4" /></symbol>
    </svg>
  );
}
