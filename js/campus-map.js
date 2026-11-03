/**
 * Takdah Grace Academy - Mountain Campus Vector Blueprint Canvas (Light Theme)
 * Location: 6th Mile, Naya Busty, Dist. Darjeeling, West Bengal
 */

function initArchitecturalCampusMap() {
  const canvas = document.getElementById('campus-vector-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 420;
  }
  resize();
  window.addEventListener('resize', resize);

  // Campus Zones in Takdah 6th Mile
  const zones = [
    { id: 1, name: "Main Academic Building", x: 0.30, y: 0.36, radius: 26, color: "#C2410C", sub: "Terracotta 2-Storey Block" },
    { id: 2, name: "ICSE Science & IT Labs", x: 0.70, y: 0.32, radius: 24, color: "#047857", sub: "Practical Science & Computers" },
    { id: 3, name: "Assembly & Sports Ground", x: 0.74, y: 0.72, radius: 26, color: "#D97706", sub: "Morning Prayers & Sports Field" },
    { id: 4, name: "Administrative Office", x: 0.50, y: 0.50, radius: 28, color: "#0369A1", sub: "Director & Principal Chambers" },
    { id: 5, name: "Grace Residential Hostel", x: 0.22, y: 0.74, radius: 22, color: "#7C3AED", sub: "Boarding Dorms & Dining" }
  ];

  let mouseX = -100;
  let mouseY = -100;
  let hoveredZone = null;
  let pulse = 0;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    hoveredZone = null;
    zones.forEach(z => {
      const zx = z.x * canvas.width;
      const zy = z.y * canvas.height;
      if (Math.hypot(mouseX - zx, mouseY - zy) < z.radius + 12) {
        hoveredZone = z;
        canvas.style.cursor = 'pointer';
      }
    });
    if (!hoveredZone) canvas.style.cursor = 'default';
  });

  canvas.addEventListener('click', () => {
    if (hoveredZone) {
      const pinBtn = document.querySelector(`.map-pin[data-id="${hoveredZone.id}"]`);
      if (pinBtn) pinBtn.click();
    }
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pulse += 0.035;

    // 1. Light Himalayan Greenery Background Gradient
    const grad = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.5, 40,
      canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.6
    );
    grad.addColorStop(0, '#F0FDF4');
    grad.addColorStop(1, '#DCFCE7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Architectural Contour Grid Lines
    ctx.strokeStyle = 'rgba(4, 120, 87, 0.12)';
    ctx.lineWidth = 1;
    const gridStep = 34;
    for (let x = 0; x < canvas.width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Mountain Road: 6th Mile Naya Busty Pathway
    ctx.strokeStyle = 'rgba(194, 65, 12, 0.35)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2.5;
    const admin = zones[3];
    const ax = admin.x * canvas.width;
    const ay = admin.y * canvas.height;

    zones.forEach(z => {
      if (z.id !== 4) {
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(z.x * canvas.width, z.y * canvas.height);
        ctx.stroke();
      }
    });
    ctx.setLineDash([]);

    // Pine Forest Canopies (Soft Emerald)
    ctx.fillStyle = 'rgba(5, 150, 105, 0.15)';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.12, canvas.height * 0.25, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.88, canvas.height * 0.20, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.48, canvas.height * 0.85, 50, 0, Math.PI * 2);
    ctx.fill();

    // 5. Draw Zones & Hotspot Nodes
    zones.forEach(z => {
      const zx = z.x * canvas.width;
      const zy = z.y * canvas.height;
      const isHovered = hoveredZone && hoveredZone.id === z.id;

      // Pulse ring
      const ringScale = isHovered ? 1.4 + Math.sin(pulse) * 0.2 : 1 + Math.sin(pulse + z.id) * 0.1;
      ctx.beginPath();
      ctx.arc(zx, zy, z.radius * ringScale, 0, Math.PI * 2);
      ctx.strokeStyle = isHovered ? z.color : 'rgba(4, 120, 87, 0.25)';
      ctx.lineWidth = isHovered ? 2.5 : 1.2;
      ctx.stroke();

      // Main Zone Core
      ctx.beginPath();
      ctx.arc(zx, zy, z.radius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? z.color : '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#FFFFFF' : z.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Number in center
      ctx.fillStyle = isHovered ? '#FFFFFF' : z.color;
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(z.id.toString(), zx, zy);

      // Label beneath
      ctx.fillStyle = isHovered ? '#064E3B' : '#1E293B';
      ctx.font = isHovered ? '700 12px "Plus Jakarta Sans", sans-serif' : '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(z.name, zx, zy + z.radius + 16);

      ctx.fillStyle = '#047857';
      ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(z.sub, zx, zy + z.radius + 28);
    });

    requestAnimationFrame(draw);
  }

  draw();
}

window.addEventListener('load', () => {
  setTimeout(initArchitecturalCampusMap, 150);
});
