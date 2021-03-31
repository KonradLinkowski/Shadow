import { getSightPolygon } from "./math.js";

const segments = [
  // Border
  { a: { x: 0, y: 0 }, b: { x: 640, y: 0 } },
  { a: { x: 640, y: 0 }, b: { x: 640, y: 360 } },
  { a: { x: 640, y: 360 }, b: { x: 0, y: 360 } },
  { a: { x: 0, y: 360 }, b: { x: 0, y: 0 } },

  // Polygon #1
  { a: { x: 100, y: 150 }, b: { x: 120, y: 50 } },
  { a: { x: 120, y: 50 }, b: { x: 200, y: 80 } },
  { a: { x: 200, y: 80 }, b: { x: 140, y: 210 } },
  { a: { x: 140, y: 210 }, b: { x: 100, y: 150 } },

  // Polygon #2
  { a: { x: 100, y: 200 }, b: { x: 120, y: 250 } },
  { a: { x: 120, y: 250 }, b: { x: 60, y: 300 } },
  { a: { x: 60, y: 300 }, b: { x: 100, y: 200 } },

  // Polygon #3
  { a: { x: 200, y: 260 }, b: { x: 220, y: 150 } },
  { a: { x: 220, y: 150 }, b: { x: 300, y: 200 } },
  { a: { x: 300, y: 200 }, b: { x: 350, y: 320 } },
  { a: { x: 350, y: 320 }, b: { x: 200, y: 260 } },

  // Polygon #4
  { a: { x: 340, y: 60 }, b: { x: 360, y: 40 } },
  { a: { x: 360, y: 40 }, b: { x: 370, y: 70 } },
  { a: { x: 370, y: 70 }, b: { x: 340, y: 60 } },

  // Polygon #5
  { a: { x: 450, y: 190 }, b: { x: 560, y: 170 } },
  { a: { x: 560, y: 170 }, b: { x: 540, y: 270 } },
  { a: { x: 540, y: 270 }, b: { x: 430, y: 290 } },
  { a: { x: 430, y: 290 }, b: { x: 450, y: 190 } },

  // Polygon #6
  { a: { x: 400, y: 95 }, b: { x: 580, y: 50 } },
  { a: { x: 580, y: 50 }, b: { x: 480, y: 150 } },
  { a: { x: 480, y: 150 }, b: { x: 400, y: 95 } }
];

export class World {
  constructor({ selector, width, height }) {
    this.$root = document.querySelector(selector)
    this.$el = document.createElement('canvas')
    this.$el.width = width
    this.$el.height = height
    this.$root.appendChild(this.$el)

    this.ctx = this.$el.getContext('2d')
  }

  draw(player) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  
    // Draw segments
    this.ctx.strokeStyle = "#999";
    for (const segment of segments) {
      this.ctx.beginPath();
      this.ctx.moveTo(segment.a.x, segment.a.y);
      this.ctx.lineTo(segment.b.x, segment.b.y);
      this.ctx.stroke();
    }
  
    // Sight Polygons
    const fuzzyRadius = 10;
    const polygons = [getSightPolygon(player.x, player.y, segments)];
    for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 10) {
      const dx = Math.cos(angle) * fuzzyRadius;
      const dy = Math.sin(angle) * fuzzyRadius;
      polygons.push(getSightPolygon(player.x + dx, player.y + dy, segments));
    };
  
    // DRAW AS A GIANT POLYGON
    for (var i = 1; i < polygons.length; i++) {
      this.drawPolygon(polygons[i], "rgba(255,255,255,0.2)");
    }
    this.drawPolygon(polygons[0], "#fff");
  
    // Draw red dots
    this.ctx.fillStyle = "#dd3838";
    this.ctx.beginPath();
    this.ctx.arc(player.x, player.y, 2, 0, 2 * Math.PI, false);
    this.ctx.fill();
    for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 10) {
      const dx = Math.cos(angle) * fuzzyRadius;
      const dy = Math.sin(angle) * fuzzyRadius;
      this.ctx.beginPath();
      this.ctx.arc(player.x + dx, player.y + dy, 2, 0, 2 * Math.PI, false);
      this.ctx.fill();
    }
  
  }

  drawPolygon(polygon, fillStyle) {
    this.ctx.fillStyle = fillStyle;
    this.ctx.beginPath();
    this.ctx.moveTo(polygon[0].x, polygon[0].y);
    for (let i = 1; i < polygon.length; i++) {
      const intersect = polygon[i];
      this.ctx.lineTo(intersect.x, intersect.y);
    }
    this.ctx.fill();
  }

  bindEvents(events) {
    for (const event in events) {
      this.$el.addEventListener(event, events[event])
    }
  }
}
