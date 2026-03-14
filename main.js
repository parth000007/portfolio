/* =============================================
   DIVYANSHU KAUSHIK PORTFOLIO — MAIN SCRIPT
   Neural Network Canvas, Particles, CLI, Anim
   ============================================= */

// =============================================
// PROFILE PHOTO — graceful fallback
// =============================================
(function initPhoto() {
  const img = document.getElementById('profilePhoto');
  const fallback = document.getElementById('photoFallback');
  if (!img || !fallback) return;
  img.addEventListener('error', () => {
    img.classList.add('error');
    fallback.style.display = 'flex';
  });
  img.addEventListener('load', () => {
    fallback.style.display = 'none';
  });
})();


// =============================================
// PARTICLE BACKGROUND
// =============================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animFrame;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.5 + 0.3;
      this.life = Math.random();
      this.type = Math.random() < 0.5 ? 'cyan' : 'uv';
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.type === 'cyan' ? '#00f0ff' : '#7b00ff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.type === 'cyan' ? '#00f0ff' : '#7b00ff';
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticlePool() {
    particles = Array.from({ length: 140 }, () => new Particle());
  }
  
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) {
          ctx.save();
          ctx.globalAlpha = (1 - d / 90) * 0.07;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animFrame = requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  initParticlePool();
  animate();
})();

// =============================================
// NEURAL NETWORK + BLOCKCHAIN GRAPH CANVAS
// =============================================
(function initNeuralGraph() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], edges = [], tick = 0;

  const TOTAL_NODES = 22;
  const CHAIN_NODES = 7;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Node {
    constructor(x, y, isChain) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = isChain ? 7 : 5;
      this.isChain = isChain;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.03 + Math.random() * 0.02;
      this.label = isChain ? `#${Math.floor(Math.random()*99999).toString(16).toUpperCase().padStart(5,'0')}` : null;
      this.active = false;
      this.activeTimer = 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Soft boundary
      if (this.x < this.r) { this.x = this.r; this.vx *= -1; }
      if (this.x > W - this.r) { this.x = W - this.r; this.vx *= -1; }
      if (this.y < this.r) { this.y = this.r; this.vy *= -1; }
      if (this.y > H - this.r) { this.y = H - this.r; this.vy *= -1; }
      this.pulse += this.pulseSpeed;
      if (this.active) { this.activeTimer--; if (this.activeTimer <= 0) this.active = false; }
    }
  }

  function initGraph() {
    resize();
    nodes = [];
    const margin = 30;
    for (let i = 0; i < TOTAL_NODES; i++) {
      const isChain = i < CHAIN_NODES;
      const x = margin + Math.random() * (W - margin * 2);
      const y = margin + Math.random() * (H - margin * 2);
      nodes.push(new Node(x, y, isChain));
    }
    edges = [];
    const maxDist = Math.min(W, H) * 0.55;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist && Math.random() < 0.35) {
          edges.push({ a: i, b: j, progress: 0, speed: 0.01 + Math.random() * 0.015, active: false, timer: 0 });
        }
      }
    }
    // Update stats
    document.getElementById('nodeCount').textContent = TOTAL_NODES;
    document.getElementById('connCount').textContent = edges.length;
    document.getElementById('blockCount').textContent = CHAIN_NODES;
  }

  function drawNode(node) {
    const glow = Math.sin(node.pulse) * 0.5 + 0.5;
    const extra = glow * 4;
    const color = node.isChain ? '#9b30ff' : '#00f0ff';
    const glowColor = node.isChain ? 'rgba(123,0,255,0.4)' : 'rgba(0,240,255,0.4)';

    // Glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r + extra, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r + extra + 10);
    grad.addColorStop(0, node.isChain ? 'rgba(123,0,255,0.3)' : 'rgba(0,240,255,0.3)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // Core
    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fillStyle = node.isChain ? `rgba(123,0,255,${0.4 + glow * 0.4})` : `rgba(0,240,255,${0.4 + glow * 0.4})`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 15 + glow * 10;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Chain block label
    if (node.isChain && node.label && W > 300) {
      ctx.save();
      ctx.font = '6px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(155,48,255,0.8)';
      ctx.fillText(node.label, node.x - 12, node.y + node.r + 10);
      ctx.restore();
    }

    // Active flash
    if (node.active) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r + 8, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.globalAlpha = node.activeTimer / 30;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawEdge(edge) {
    const a = nodes[edge.a];
    const b = nodes[edge.b];
    const color = (a.isChain || b.isChain) ? 'rgba(123,0,255,' : 'rgba(0,240,255,';

    if (edge.active) {
      edge.progress += edge.speed;
      if (edge.progress >= 1) {
        edge.progress = 0;
        edge.active = false;
        nodes[edge.b].active = true;
        nodes[edge.b].activeTimer = 30;
      }
      // Traveling dot
      const tx = a.x + (b.x - a.x) * edge.progress;
      const ty = a.y + (b.y - a.y) * edge.progress;
      ctx.save();
      ctx.beginPath();
      ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = (a.isChain || b.isChain) ? '#9b30ff' : '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = (a.isChain || b.isChain) ? '#9b30ff' : '#00f0ff';
      ctx.fill();
      ctx.restore();
      // Draw line up to current point
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = (a.isChain || b.isChain) ? 'rgba(123,0,255,0.6)' : 'rgba(0,240,255,0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = color + '0.12)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    }
  }

  function animateGraph() {
    if (!canvas.offsetParent && canvas.offsetWidth === 0) {
      requestAnimationFrame(animateGraph);
      return;
    }
    if (canvas.offsetWidth !== W || canvas.offsetHeight !== H) {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    ctx.clearRect(0, 0, W, H);
    // Occasionally fire a signal along a random edge
    tick++;
    if (tick % 40 === 0) {
      const e = edges[Math.floor(Math.random() * edges.length)];
      if (e && !e.active) { e.active = true; }
    }
    edges.forEach(drawEdge);
    nodes.forEach(n => { n.update(); drawNode(n); });
    requestAnimationFrame(animateGraph);
  }

  // Wait for layout
  window.addEventListener('load', () => {
    initGraph();
    animateGraph();
  });
  window.addEventListener('resize', () => {
    initGraph();
  });
})();

// =============================================
// HERO ROLE TYPER
// =============================================
(function initTyper() {
  const el = document.getElementById('roleTyper');
  if (!el) return;
  const roles = [
    'AI/ML Engineer',
    'Blockchain Architect',
    'LLM Systems Builder',
    'Smart Contract Dev',
    'DApp Developer',
    'Full-Stack Engineer',
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;
  const DELAY_CHAR = 70, DELAY_DEL = 40, DELAY_PAUSE = 1800;

  function type() {
    const role = roles[roleIdx];
    if (!deleting) {
      el.textContent = role.slice(0, ++charIdx);
      if (charIdx === role.length) { deleting = true; setTimeout(type, DELAY_PAUSE); return; }
    } else {
      el.textContent = role.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    }
    setTimeout(type, deleting ? DELAY_DEL : DELAY_CHAR);
  }
  setTimeout(type, 600);
})();

// =============================================
// LIVE CLI
// =============================================
(function initCLI() {
  const liveCmd = document.getElementById('liveCmd');
  const liveOutput = document.getElementById('liveOutput');
  const cliBody = document.getElementById('cliBody');
  if (!liveCmd || !liveOutput) return;

  const commands = [
    {
      cmd: 'ls -la ./projects/',
      out: 'ai-healthcare-chatbot/\nrent-karo-marketplace/\nllm-diagnostic-system/'
    },
    {
      cmd: 'git log --oneline -5',
      out: '3fa21b0 feat: integrate FAISS vector search\n8c2d914 fix: blockchain consent verification\na1f3e02 feat: Gemini API integration\n55bc002 perf: optimize RAG pipeline (-40%)\n9e1a2d7 init: project scaffold'
    },
    {
      cmd: 'node --eval "console.log(process.version)"',
      out: 'v20.11.0'
    },
    {
      cmd: 'python3 -c "import langchain; print(langchain.__version__)"',
      out: '0.2.6'
    },
    {
      cmd: 'curl -s api/health | jq .status',
      out: '"healthy" ✓ uptime: 99.9%'
    },
    {
      cmd: 'truffle compile --all',
      out: 'Compiling ./contracts/DiagnosticConsent.sol\nCompiling ./contracts/DataAccess.sol\n> Artifacts written to ./build/contracts'
    },
    {
      cmd: 'npm run dev',
      out: 'ready - started server on 0.0.0.0:3000'
    },
  ];

  let idx = 0;

  function typeCmd(cmd, out, callback) {
    liveCmd.textContent = '';
    liveOutput.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      liveCmd.textContent += cmd[i++];
      if (i >= cmd.length) {
        clearInterval(interval);
        setTimeout(() => {
          liveOutput.textContent = out;
          cliBody.scrollTop = cliBody.scrollHeight;
          setTimeout(callback, 1800);
        }, 300);
      }
    }, 55);
  }

  function runNext() {
    const c = commands[idx % commands.length];
    idx++;
    typeCmd(c.cmd, c.out, runNext);
  }

  setTimeout(runNext, 1200);
})();

// =============================================
// SCROLL REVEAL & COUNTER ANIMATION
// =============================================
(function initReveal() {
  // Reveal
  const revealEls = document.querySelectorAll('.glass-card, .section-label');
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));

  // Skill bars
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.classList.add('animating');
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));

  // Counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(numEl => {
          const target = parseInt(numEl.dataset.target);
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;
          const t = setInterval(() => {
            current = Math.min(current + step, target);
            numEl.textContent = Math.floor(current);
            if (current >= target) clearInterval(t);
          }, 16);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stats-card').forEach(el => counterObserver.observe(el));
})();

// =============================================
// NAVBAR ACTIVE STATE
// =============================================
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// =============================================
// AI AVATAR INTERACTION
// =============================================
(function initAvatar() {
  const avatar = document.getElementById('aiAvatar');
  if (!avatar) return;
  const msgs = [
    'System online. Ready to architect.',
    'LLM diagnostic accuracy: 85%.',
    'Smart contracts: compiled & verified.',
    'RAG pipeline: optimized.',
    'NIT Rourkela · AI/ML + Blockchain.',
    'Rank 231 / 63,000+ · CreaTech 2025.',
  ];
  let mi = 0;
  avatar.addEventListener('click', () => {
    const tip = document.createElement('div');
    tip.style.cssText = `
      position:fixed; bottom:6rem; right:2.5rem; z-index:300;
      background:rgba(6,8,18,0.95); border:1px solid rgba(0,240,255,0.25);
      backdrop-filter:blur(20px); border-radius:10px; padding:0.75rem 1rem;
      font-family:'JetBrains Mono',monospace; font-size:0.68rem; color:#00f0ff;
      max-width:220px; line-height:1.5;
      animation:fadeInUp 0.3s ease;
      box-shadow: 0 0 20px rgba(0,240,255,0.15);
    `;
    tip.textContent = `> ${msgs[mi % msgs.length]}`;
    mi++;
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 2500);
  });
})();

// =============================================
// FOLDING 3D TILT EFFECT
// =============================================
(function initTilt() {
  document.querySelectorAll('.folding-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
