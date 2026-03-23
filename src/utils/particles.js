// utils/particles.js — Lightweight canvas particle background animation

/**
 * Initialise a particle network on the given canvas element.
 * @param {HTMLCanvasElement} canvas
 * @param {boolean} isDark  - initial theme state
 * @returns {{ setDark(v: boolean): void, destroy(): void }}
 */
export function initParticles(canvas, isDark) {
  const ctx = canvas.getContext('2d');
  let animId;
  let particles = [];
  let dark = isDark;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.4,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.08,
    };
  }

  function init() {
    particles = Array.from({ length: 55 }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dark
        ? `rgba(139,124,248,${p.alpha})`
        : `rgba(91,79,207,${p.alpha * 0.45})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    }

    // Draw faint connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = Math.hypot(
          particles[i].x - particles[j].x,
          particles[i].y - particles[j].y
        );
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = dark
            ? `rgba(139,124,248,${0.07 * (1 - d / 110)})`
            : `rgba(91,79,207,${0.03 * (1 - d / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  const resizeHandler = () => { resize(); init(); };
  window.addEventListener('resize', resizeHandler);

  resize();
  init();
  draw();

  return {
    setDark(val) { dark = val; },
    destroy() {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeHandler);
    },
  };
}
