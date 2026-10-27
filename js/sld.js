/* ElectroLoad Pro | sld.js
 * Single line diagram (SVG) generator.
 * Classic script: shares one global scope with the other files, so keep the load order from index.html.
 */

// Interactive SVG Single-Line Diagram Generator
function renderSLD(mainMccbRating, totalCurrent) {
    const svg = document.getElementById('sldSvg');
    svg.innerHTML = ''; // Clear existing drawing

    const NS = "http://www.w3.org/2000/svg";
    const g = document.createElementNS(NS, "g");
    svg.appendChild(g);

    const PC = { R: '#ef4444', Y: '#eab308', B: '#3b82f6' };
    const OFF = { R: 0, Y: 8, B: 16 };

    // Helper to build SVG Elements
    function drawLine(x1, y1, x2, y2, stroke="#38bdf8", strokeWidth=2, dash=false) {
        const line = document.createElementNS(NS, "line");
        line.setAttribute("x1", x1); line.setAttribute("y1", y1);
        line.setAttribute("x2", x2); line.setAttribute("y2", y2);
        line.setAttribute("stroke", stroke);
        line.setAttribute("stroke-width", strokeWidth);
        if(dash) line.setAttribute("stroke-dasharray", "4,4");
        g.appendChild(line);
    }

    function drawRect(x, y, w, h, fill="#0f172a", stroke="#38bdf8", rx=4) {
        const rect = document.createElementNS(NS, "rect");
        rect.setAttribute("x", x); rect.setAttribute("y", y);
        rect.setAttribute("width", w); rect.setAttribute("height", h);
        rect.setAttribute("fill", fill); rect.setAttribute("stroke", stroke);
        rect.setAttribute("stroke-width", "1.5");
        rect.setAttribute("rx", rx);
        g.appendChild(rect);
    }

    function drawText(text, x, y, fill="#f8fafc", fontSize="11", anchor="middle", fontMono=true) {
        const txt = document.createElementNS(NS, "text");
        txt.setAttribute("x", x); txt.setAttribute("y", y);
        txt.setAttribute("fill", fill);
        txt.setAttribute("font-size", fontSize);
        txt.setAttribute("text-anchor", anchor);
        if (fontMono) txt.setAttribute("font-family", "JetBrains Mono, monospace");
        txt.textContent = text;
        g.appendChild(txt);
    }

    // One branch circuit: tap from bus -> branch MCB with phase tag -> red quantity node -> load details
    function drawCircuit(ckt, bx, busY, b3) {
        const tp = ckt.sup === 3;
        const color = tp ? '#94a3b8' : PC[ckt.phase];
        if (tp) ['R', 'Y', 'B'].forEach((p, i) => drawLine(bx - 6 + 6 * i, busY + OFF[p], bx - 6 + 6 * i, busY + 50, PC[p], 2));
        else drawLine(bx, busY + (b3 ? OFF[ckt.phase] : 0), bx, busY + 50, color, 2);

        drawRect(bx - 35, busY + 50, 70, 35, "#0f172a", color, 4);
        drawText(`${ckt.mcb}A ${tp ? '3P ' : ''}MCB`, bx, busY + 65, "#f8fafc", "9");
        drawText(tp ? '3-Phase' : `Phase ${ckt.phase}`, bx, busY + 77, color, "8");

        drawLine(bx, busY + 85, bx, busY + 120, color, 1.5);

        const circle = document.createElementNS(NS, "circle");
        circle.setAttribute("cx", bx); circle.setAttribute("cy", busY + 130);
        circle.setAttribute("r", "12");
        circle.setAttribute("fill", "#1e293b");
        circle.setAttribute("stroke", "#ef4444");
        circle.setAttribute("stroke-width", "2");
        g.appendChild(circle);

        const first = ckt.items[0];
        const loadLabel = ckt.items.length > 1 ? first.name.substring(0, 9) + ' +' + (ckt.items.length - 1) : first.name.substring(0, 13);
        const roomLabel = ckt.rooms[0].substring(0, 12) + (ckt.rooms.length > 1 ? ' +' + (ckt.rooms.length - 1) : '');
        drawText(`${ckt.qty}`, bx, busY + 134, "#ffffff", "9");
        drawText(ckt.id, bx, busY + 155, "#e2e8f0", "9");
        drawText(loadLabel, bx, busY + 167, "#94a3b8", "9");
        drawText(roomLabel, bx, busY + 179, "#64748b", "8");
        drawText(`${Math.round(ckt.watts)}W`, bx, busY + 191, "#38bdf8", "8");
    }

    // A board: its circuits, its sub-boards (feeder MCB + board node + sub-bus), and its R-Y-B-N bus
    function drawBoard(b, x0, busY, isRoot) {
        const b3 = bSup(b) === 3;
        const own = circuits.filter(c => c.board === b.id);
        const kids = boards.filter(k => k !== b && k.par === b.id);
        const xs = [];
        let cx = x0, bottom = busY + 200;

        own.forEach(c => { const bx = cx + 45; drawCircuit(c, bx, busY, b3); xs.push(bx); cx += 90; });

        kids.forEach(k => {
            const r = drawBoard(k, cx, busY + 160, false);
            const kx = r.cx, kt = bSup(k) === 3;
            const col = kt ? '#94a3b8' : PC[k.e || 'R'];
            if (kt) ['R', 'Y', 'B'].forEach((p, i) => drawLine(kx - 6 + 6 * i, busY + (b3 ? OFF[p] : 0), kx - 6 + 6 * i, busY + 30, PC[p], 2));
            else drawLine(kx, busY + (b3 ? OFF[k.e || 'R'] : 0), kx, busY + 30, col, 2);
            drawRect(kx - 35, busY + 30, 70, 30, "#0f172a", col, 4);
            drawText(`${k.s.cb}A ${kt ? '3P ' : ''}MCB`, kx, busY + 43, "#f8fafc", "9");
            drawText(kt ? '3-Phase' : `Phase ${k.e || 'R'}`, kx, busY + 54, col, "8");
            drawLine(kx, busY + 60, kx, busY + 112, col, 1.5);
            xs.push(kx); cx += r.w; bottom = Math.max(bottom, r.bottom);
        });

        if (!xs.length) { xs.push(x0 + 50); cx = x0 + 100; drawText('(no loads)', x0 + 50, busY + 50, "#64748b", "9"); }
        const w = Math.max(cx - x0, 100);
        const mid = (xs[0] + xs[xs.length - 1]) / 2;
        const bx1 = xs[0] - 35, bx2 = xs[xs.length - 1] + 35;

        if (!isRoot) {
            // board node sitting between the feeder MCB and the sub-bus
            drawRect(mid - 60, busY - 48, 120, 28, "#0f172a", "#38bdf8", 6);
            drawText(`${b.name} \u00B7 ${b.type}`, mid, busY - 36, "#f8fafc", "9");
            drawText(`${b3 ? '3' : '1'}-Phase \u00B7 ${b.s.mx.toFixed(1)}A`, mid, busY - 25, "#94a3b8", "8");
            drawLine(mid, busY - 20, mid, busY, "#38bdf8", 2);
        } else {
            drawText(`${b.name} \u00B7 ${b.type}`, bx1, busY - 8, "#38bdf8", "9", "start");
        }

        if (b3) {
            drawLine(bx1, busY, bx2, busY, "#ef4444", 4);          // Phase R
            drawLine(bx1, busY + 8, bx2, busY + 8, "#eab308", 4);  // Phase Y
            drawLine(bx1, busY + 16, bx2, busY + 16, "#3b82f6", 4); // Phase B
            drawLine(bx1, busY + 24, bx2, busY + 24, "#64748b", 2, true); // Neutral
            if (isRoot) {
                drawText("R-BUS", bx1 - 8, busY + 4, "#ef4444", "9", "end");
                drawText("Y-BUS", bx1 - 8, busY + 12, "#eab308", "9", "end");
                drawText("B-BUS", bx1 - 8, busY + 20, "#3b82f6", "9", "end");
            }
        } else {
            const pc = PC[b.e || 'R'];
            drawLine(bx1, busY, bx2, busY, pc, 4);
            drawLine(bx1, busY + 8, bx2, busY + 8, "#64748b", 2, true);
            if (isRoot) drawText(`${b.e || 'R'}-BUS`, bx1 - 8, busY + 4, pc, "9", "end");
        }
        return { w, cx: mid, bottom };
    }

    const busY = 210;
    const root = boards[0];
    const r = drawBoard(root, 0, busY, true);
    const sx = r.cx;
    const rootThree = bSup(root) === 3;

    // 1. Grid / Transformer Supply Top Node
    drawLine(sx, 20, sx, 60, "#38bdf8", 3);
    drawRect(sx - 90, 15, 180, 30, "#0284c7", "#38bdf8", 8);
    drawText(`${rootThree ? '3-PHASE' : '1-PHASE'} GRID SUPPLY (${rootThree ? config.voltageLL : config.voltageLN}V)`, sx, 34, "#ffffff", "10", "middle");

    // 2. Main Incomer MCCB Circuit Breaker
    drawLine(sx, 45, sx, 90, "#38bdf8", 2);
    drawRect(sx - 65, 80, 130, 35, "#0f172a", "#ef4444", 6);
    drawText(`MAIN MCCB: ${mainMccbRating}A`, sx, 97, "#f8fafc", "10");
    drawText(`Load: ${totalCurrent.toFixed(1)}A`, sx, 109, "#94a3b8", "9");

    // 3. ELCB / RCCB Earth Leakage Protection
    drawLine(sx, 115, sx, 145, "#38bdf8", 2);
    drawRect(sx - 60, 145, 120, 25, "#0f172a", "#10b981", 6);
    drawText(rootThree ? `RCCB 30mA 4P` : `RCCB 30mA 2P`, sx, 161, "#10b981", "10");

    // 4. Link down to the root bus
    drawLine(sx, 170, sx, busY, "#38bdf8", 2);

    // Size the canvas to the diagram and centre it
    const avail = (svg.parentElement.clientWidth || 900) - 32;
    const W = Math.max(avail, r.w + 260, 800);
    const dx = (W - r.w) / 2;
    g.setAttribute('transform', `translate(${dx},0)`);
    svg.style.width = W + 'px';
    svg.style.height = Math.max(480, r.bottom + 40) + 'px';
}
