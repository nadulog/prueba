"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const EVENT_TIMESTAMP = Date.UTC(2026, 11, 13, 0, 0, 0);

type Countdown = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

function calculateCountdown(): Countdown {
  const difference = Math.max(0, EVENT_TIMESTAMP - Date.now());
  return {
    dias: Math.floor(difference / 86_400_000),
    horas: Math.floor((difference / 3_600_000) % 24),
    minutos: Math.floor((difference / 60_000) % 60),
    segundos: Math.floor((difference / 1_000) % 60),
  };
}

function useCountdown() {
  const [time, setTime] = useState<Countdown | null>(null);
  useEffect(() => {
    const tick = () => setTime(calculateCountdown());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);
  return time;
}

function Pad({ value }: { value: number | undefined }) {
  return <>{value === undefined ? "--" : String(value).padStart(2, "0")}</>;
}

export default function Home() {
  const countdown = useCountdown();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [panel, setPanel] = useState<"location" | "gift" | "trivia" | "keep" | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [toast, setToast] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState<number | null>(null);

  const calendarUrl = useMemo(() => {
    const query = new URLSearchParams({
      action: "TEMPLATE",
      text: "Mis XV de Alma",
      dates: "20261213T000000Z/20261213T090000Z",
      details: "Te espero para compartir una noche inolvidable.",
      location: "Salón El Carmen, Raquel Español 325, Wilde",
    });
    return `https://calendar.google.com/calendar/render?${query}`;
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  function submitMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const memory = String(data.get("memory") || "").trim();
    if (!memory) return;
    localStorage.setItem("alma-memory", memory);
    setPanel(null);
    notify("Tu mensaje quedó guardado para Alma ♡");
  }

  function checkTrivia() {
    if (!answer) return;
    setScore(answer === "b" ? 1 : 0);
  }

  async function copyAlias() {
    const alias = "alma.menghi";
    try {
      await navigator.clipboard.writeText(alias);
    } catch {
      const input = document.createElement("textarea");
      input.value = alias;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    notify("Alias copiado: alma.menghi");
  }

  async function copyAddress() {
    const address = "Salón El Carmen, Raquel Español 325, Wilde";
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      const input = document.createElement("textarea");
      input.value = address;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    notify("Dirección copiada");
  }

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        notify("Tocá nuevamente para reproducir la música");
      }
    } else {
      audio.pause();
    }
  }

  return (
    <main>
      <audio ref={audioRef} src="/alma/primadonna.mp3" loop preload="metadata" onPlay={() => setAudioPlaying(true)} onPause={() => setAudioPlaying(false)} />
      <button className={`audio-toggle${audioPlaying ? " is-playing" : ""}`} onClick={toggleAudio} aria-label={audioPlaying ? "Apagar música" : "Encender música"} aria-pressed={audioPlaying}>
        {audioPlaying ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path className="sound-wave" d="M17 9.2c.8.8 1.2 1.7 1.2 2.8s-.4 2-1.2 2.8M19.5 6.8c1.5 1.4 2.3 3.1 2.3 5.2s-.8 3.8-2.3 5.2"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path className="sound-wave" d="m17 9 5 6M22 9l-5 6"/></svg>
        )}
      </button>
      <section id="inicio" className="hero panel-image">
        <picture>
          <source media="(min-width: 840px)" srcSet="/alma/portada-horizontal.png" />
          <img src="/alma/portada.png" alt="Mis XV de Alma, una composición rosa con perlas y cintas" />
        </picture>
      </section>

      <section className="panel-image personal-invitation" aria-label="Invitación personalizada con espacios en blanco para invitados">
        <img src="/alma/invitacion-personalizada-fondo.png" alt="" aria-hidden="true" />
        <div className="personal-invitation__content">
          <p className="personal-invitation__intro">Esta invitación fue creada<br />especialmente para</p>
          <div className="personal-invitation__count" aria-label="Espacio para la cantidad de invitados" />
          <h2 aria-label="Espacio reservado para los nombres de los invitados" />
          <div className="personal-invitation__divider" aria-hidden="true"><i /></div>
          <p className="personal-invitation__places">Tenés <span className="personal-invitation__blank-count" aria-hidden="true" /> lugares reservados</p>
          <p className="personal-invitation__message">Me hace muy feliz compartir<br />este momento con ustedes.</p>
        </div>
      </section>

      <div className="hero-countdown-seam" aria-hidden="true">
        <svg viewBox="0 0 943 180" preserveAspectRatio="none">
          <defs>
            <linearGradient id="seamColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#edc7c3" stopOpacity="0" />
              <stop offset=".34" stopColor="#edc7c3" stopOpacity=".34" />
              <stop offset=".5" stopColor="#edc7c3" stopOpacity=".72" />
              <stop offset=".66" stopColor="#edc7c3" stopOpacity=".34" />
              <stop offset="1" stopColor="#edc7c3" stopOpacity="0" />
            </linearGradient>
            <mask id="decorationsCutout">
              <rect width="943" height="180" fill="white" />
              <path d="M610 -25C605 38 585 91 552 120C515 153 466 177 402 205" fill="none" stroke="black" strokeWidth="170" strokeLinecap="round" />
              <path d="M38 -15C52 44 62 104 76 198" fill="none" stroke="black" strokeWidth="155" strokeLinecap="round" />
            </mask>
          </defs>
          <rect width="943" height="180" fill="url(#seamColor)" mask="url(#decorationsCutout)" />
        </svg>
      </div>

      <section id="cuenta" className="panel-image countdown-panel" aria-label="Cuenta regresiva para el 12 de diciembre de 2026">
        <img src="/alma/countdown-seam-v2.png" alt="Falta muy poco: cuenta regresiva para los XV de Alma" />
        <div className="countdown-sparkles" aria-hidden="true">
          {Array.from({ length: 14 }, (_, index) => <i key={index} className={`sparkle count-sparkle-${index + 1}`} />)}
        </div>
        <div className="countdown-number countdown-days"><Pad value={countdown?.dias} /></div>
        <div className="countdown-number countdown-hours"><Pad value={countdown?.horas} /></div>
        <div className="countdown-number countdown-minutes"><Pad value={countdown?.minutos} /></div>
        <div className="countdown-number countdown-seconds"><Pad value={countdown?.segundos} /></div>
      </section>

      <section id="fecha" className="panel-image interactive-panel">
        <img src="/alma/fecha-seam.png" alt="12 de diciembre, de 21:00 a 06:00 horas" />
        <a className="hotspot calendar" href={calendarUrl} target="_blank" rel="noreferrer" aria-label="Agregar los XV de Alma a Google Calendar" />
      </section>

      <section id="ubicacion" className="panel-image interactive-panel">
        <img src="/alma/ubicacion.png" alt="Cómo llegar al Salón El Carmen, Raquel Español 325, Wilde" />
        <button className="hotspot map" onClick={() => setPanel("location")} aria-label="Ver cómo llegar al Salón El Carmen" />
      </section>

      <section id="dress-code" className="panel-image">
        <img src="/alma/dress-code-brillo.png" alt="Dress code elegante. Se reservan los colores claros" />
        <div className="dress-sparkles" aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => <i key={index} className={`sparkle dress-sparkle-${index + 1}`} />)}
        </div>
      </section>

      <section id="regalos" className="panel-image interactive-panel">
        <img src="/alma/regalos.png" alt="Regalos: tu presencia es mi mejor regalo" />
        <div className="section-wave section-wave--top" aria-hidden="true">
          <svg viewBox="0 0 943 180" preserveAspectRatio="none"><path d="M0 0H943V72C710 182 300 8 0 126Z" /></svg>
        </div>
        <div className="section-wave section-wave--bottom" aria-hidden="true">
          <svg viewBox="0 0 943 180" preserveAspectRatio="none"><path d="M0 122C245 5 690 178 943 68V180H0Z" /></svg>
        </div>
        <button className="hotspot gift" onClick={() => setPanel("gift")} aria-label="Ver datos para hacer un regalo" />
      </section>

      <section id="musica" className="panel-image interactive-panel">
        <img src="/alma/musica-brillo.png" alt="Música: qué canción no puede faltar" />
        <div className="headphone-sparkles" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} className={`sparkle sparkle-${index + 1}`} />)}
        </div>
        <a className="hotspot music" href="https://open.spotify.com/playlist/3NfM07qjhuHBChL3cYp8JE?si=dSZMrnlGRJaZaqhSeo5dyw&utm_source=whatsapp&pi=Qo-q4YZBSFubK&pt=da783e5b26487d01385bf68d7289ef00" target="_blank" rel="noreferrer" aria-label="Sumar una canción a la playlist de Alma en Spotify" />
      </section>

      <section id="bloomkeep" className="panel-image interactive-panel">
        <img src="/alma/bloomkeep-cable.png" alt="BloomKeep: compartí tus fotos y mensajes en tiempo real" />
        <button className="hotspot keep" onClick={() => setPanel("keep")} aria-label="Ingresar a BloomKeep" />
      </section>

      <section id="trivias" className="panel-image interactive-panel">
        <img src="/alma/trivias-no-wire.png" alt="BloomTrivias: respondé, votá y subí al ranking" />
        <button className="hotspot trivia" onClick={() => { setPanel("trivia"); setScore(null); setAnswer(""); }} aria-label="Empezar a jugar BloomTrivias" />
      </section>

      <section id="confirmar" className="panel-image interactive-panel closing">
        <img src="/alma/cierre-sin-fecha.png" alt="Alma te invita a celebrar sus quince años" />
        <a className="hotspot rsvp" href="https://bloomdate-rsvp.netlify.app/r/cumple-xv-almaa" target="_blank" rel="noreferrer" aria-label="Confirmar asistencia a los XV de Alma" />
      </section>

      <footer className="bloomdate-footer panel-image interactive-panel">
        <img src="/alma/footer-sin-cinta.png" alt="Hecho con amor por BloomDate" />
        <a className="footer-link footer-instagram" href="https://www.instagram.com/bloomdate.invitaciones/" target="_blank" rel="noreferrer" aria-label="Instagram de BloomDate" />
        <a className="footer-link footer-whatsapp" href="https://wa.me/5491140436324" target="_blank" rel="noreferrer" aria-label="WhatsApp de BloomDate" />
        <a className="footer-link footer-web" href="https://bloomdate-site.netlify.app/" target="_blank" rel="noreferrer" aria-label="Sitio web de BloomDate" />
      </footer>

      {panel && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setPanel(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setPanel(null)} aria-label="Cerrar">×</button>
            {panel === "location" && <>
              <p className="modal-kicker">CÓMO LLEGAR</p><h2 id="modal-title">Salón El Carmen</h2>
              <div className="location-card">
                <span>DIRECCIÓN</span>
                <strong>Raquel Español 325</strong>
                <small>Wilde, Buenos Aires</small>
              </div>
              <div className="modal-actions">
                <a className="primary map-choice" href="https://www.google.com/maps/search/?api=1&query=Sal%C3%B3n+El+Carmen%2C+Raquel+Espa%C3%B1ol+325%2C+Wilde" target="_blank" rel="noreferrer">ABRIR GOOGLE MAPS</a>
                <a className="primary map-choice map-choice--outline" href="https://www.waze.com/ul?q=Sal%C3%B3n%20El%20Carmen%2C%20Raquel%20Espa%C3%B1ol%20325%2C%20Wilde&navigate=yes" target="_blank" rel="noreferrer">ABRIR WAZE</a>
                <button className="copy-address" onClick={copyAddress}>COPIAR DIRECCIÓN</button>
              </div>
            </>}
            {panel === "gift" && <>
              <p className="modal-kicker">REGALOS</p><h2 id="modal-title">Datos para hacer un presente</h2>
              <dl className="gift-data">
                <div><dt>ALIAS</dt><dd>alma.menghi</dd></div>
                <div><dt>TITULAR</dt><dd>Alma Isabella Menghi</dd></div>
                <div><dt>ENTIDAD</dt><dd>Mercado Pago</dd></div>
              </dl>
              <button className="primary copy-alias" onClick={copyAlias}>COPIAR ALIAS</button>
            </>}
            {panel === "keep" && <>
              <p className="modal-kicker">BLOOMKEEP</p><h2 id="modal-title">Dejale algo lindo a Alma</h2>
              <form onSubmit={submitMemory}><label>Tu mensaje<textarea name="memory" placeholder="Un deseo, un recuerdo, unas palabras…" autoFocus /></label><button type="submit">GUARDAR MENSAJE</button></form>
            </>}
            {panel === "trivia" && <>
              <p className="modal-kicker">BLOOMTRIVIAS · 01/03</p><h2 id="modal-title">¿Cuál es el mes favorito de Alma?</h2>
              <div className="answers">
                {[['a','Enero'],['b','Diciembre'],['c','Julio']].map(([value,label]) => <button key={value} className={answer === value ? "selected" : ""} onClick={() => setAnswer(value)}><b>{value.toUpperCase()}</b>{label}</button>)}
              </div>
              {score === null ? <button className="primary" onClick={checkTrivia}>RESPONDER</button> : <p className={`result ${score ? "correct" : ""}`}>{score ? "¡Correcto! Conocés muy bien a Alma ✦" : "Casi… la respuesta era diciembre ♡"}</p>}
            </>}
          </div>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
