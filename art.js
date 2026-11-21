/* Original Canvas artwork for the Moonlit Rose Court. */
'use strict';

const CourtArt = (() => {
  const colors = ['#a2e4f5', '#ffd07c', '#ebb0fa', '#95e9b5', '#ff889f', '#c3ceff'];

  function ellipse(ctx, x, y, rx, ry, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function polygon(ctx, points, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath();
    ctx.fill();
  }

  function tile(width, height, paint) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    paint(canvas.getContext('2d'));
    return canvas;
  }

  function crown(ctx, color) {
    polygon(ctx, [[-18,-13],[-19,-29],[-9,-22],[0,-34],[9,-22],[19,-29],[18,-13]], color);
    ellipse(ctx, 0, -20, 3, 4, '#b63365');
  }

  function guardian(ctx, type) {
    ctx.translate(40, 42);
    const color = colors[type];
    const skin = ['#e9f7f7','#ffe0ba','#b975cc','#f5cda1','#f5ccbf','#dfdafe'][type];
    const coat = ['#2a8ea8','#2b788a','#653882','#177059','#9f2c50','#4a59a2'][type];
    ctx.lineJoin = 'round';
    ellipse(ctx, 0, 22, 24, 12, '#130e24');
    const fabric = ctx.createLinearGradient(-18, 10, 17, 29);
    fabric.addColorStop(0, color);
    fabric.addColorStop(.35, coat);
    fabric.addColorStop(1, '#21152e');
    ellipse(ctx, 0, 20, 22, 11, fabric);
    if (type === 0) {
      for (const x of [-10, 10]) {
        ellipse(ctx, x, -22, 6, 15, '#171428');
        ellipse(ctx, x, -22, 4, 13, skin);
        ellipse(ctx, x, -24, 2, 9, '#e7a1bc');
      }
    }
    if (type === 1 || type === 4) {
      ellipse(ctx, 0, 1, 21, 23, '#21152e');
      ellipse(ctx, 0, 0, 19, 21, type === 1 ? '#c98739' : '#642044');
    }
    if (type === 2) {
      polygon(ctx, [[-18,4],[-23,-24],[-4,-14],[5,-14],[23,-24],[18,4]], '#351c48');
      polygon(ctx, [[-17,-6],[-19,-18],[-8,-12],[8,-12],[19,-18],[17,-6]], '#ee9cca');
    }
    ellipse(ctx, 0, 2, 19, 16, '#23162e');
    const face = ctx.createLinearGradient(-10,-12,13,17);
    face.addColorStop(0, '#fff0ce');
    face.addColorStop(.65, skin);
    face.addColorStop(1, type === 2 ? '#86469c' : '#c5879b');
    ellipse(ctx, 0, 1, 17, 14, face);
    if (type === 1) {
      polygon(ctx, [[-19,-6],[-15,-18],[8,-21],[17,-15],[19,-4],[5,-13],[-8,-5]], color);
      ellipse(ctx, 5, -17, 8, 3, '#372548');
    }
    if (type === 3) {
      polygon(ctx, [[-17,-9],[-22,-33],[15,-34],[15,-11]], '#124d49');
      polygon(ctx, [[-18,-17],[16,-20],[16,-12],[-17,-9]], '#c58b51');
      ellipse(ctx, 0, -10, 24, 4, '#153c3c');
      polygon(ctx, [[4,-28],[13,-28],[13,-16],[4,-16]], '#f6d7a1');
    }
    if (type >= 4) crown(ctx, type === 4 ? '#ffc478' : '#c4e9ff');
    for (const x of [-7, 7]) {
      ellipse(ctx, x, 1, 2.5, 3.2, '#211321');
      ellipse(ctx, x-.5, 0, .85, .9, '#fff5df');
      ellipse(ctx, x*1.58, 6, 3, 1.4, '#ed9cae');
    }
    if (type === 0) ellipse(ctx, 0, 6, 2.5, 1.6, '#ac5075');
    else {
      ellipse(ctx, 0, 8, type === 2 ? 8 : 3.4, type === 2 ? 3.2 : 1.6, '#5f294f');
      if (type === 2) ellipse(ctx, 0, 7, 6, 1.3, '#fff4da');
    }
    polygon(ctx, [[-10,16],[0,19],[10,16],[8,25],[0,21],[-8,25]], color);
    ellipse(ctx, 0, 20, 2, 2, '#ffdf91');
  }

  const sprites = colors.map((_, type) => tile(80, 80, ctx => guardian(ctx, type)));
  function portrait(type) {
    return sprites[type].toDataURL();
  }

  function enemy(ctx, boss) {
    ctx.translate(40, 42);
    polygon(ctx, [[-17,26],[-15,9],[14,9],[18,26],[8,26],[5,16],[-5,16],[-8,26]], '#21152e');
    ctx.rotate(boss ? 0 : .14);
    const paper = ctx.createLinearGradient(-22,-23,19,20);
    paper.addColorStop(0, boss ? '#ed9fc1' : '#fff1c4');
    paper.addColorStop(.6, boss ? '#9c3159' : '#e6ba8e');
    paper.addColorStop(1, boss ? '#511f46' : '#a96878');
    ctx.beginPath();
    ctx.roundRect(-17,-23,34,44,5);
    ctx.fillStyle = paper;
    ctx.fill();
    ctx.strokeStyle = boss ? '#ffd986' : '#4b2844';
    ctx.lineWidth = 2;
    ctx.stroke();
    ellipse(ctx, -6, -6, 2.5, 4, '#391931');
    ellipse(ctx, 6, -6, 2.5, 4, '#391931');
    const mark = boss ? '#ffc27f' : '#542344';
    polygon(ctx, [[0,2],[8,10],[0,17],[-8,10]], mark);
    if (boss) crown(ctx, '#ffd887');
  }
  const enemies = [false, true].map(boss => tile(80, 80, ctx => enemy(ctx, boss)));

  function trace(ctx, route) {
    ctx.beginPath();
    route.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  }

  function terrain(width, height, route, scale) {
    return tile(Math.round(width*scale), Math.round(height*scale), ctx => {
      ctx.scale(scale, scale);
      let seed = 461;
      const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
      const garden = ctx.createRadialGradient(width*.47,height*.36,15,width*.5,height*.45,width*.67);
      garden.addColorStop(0,'#43595b');
      garden.addColorStop(.5,'#203d42');
      garden.addColorStop(1,'#121c2e');
      ctx.fillStyle = garden;
      ctx.fillRect(0,0,width,height);
      for (let y = 0; y < height; y += 18) {
        for (let x = 0; x < width; x += 24) {
          if ((x/24+y/18)%2 === 0) {
            polygon(ctx, [[x,y-9],[x+12,y],[x,y+9],[x-12,y]], '#b9adc00f');
          }
        }
      }
      for (let i = 0; i < 150; i++) {
        const x = random()*width, y = random()*height, radius = 2+random()*8;
        if (x>width*.11 && x<width*.89 && y>height*.17 && y<height*.72) continue;
        ellipse(ctx,x,y+3,radius+2,radius*.75,'#10222d');
        ellipse(ctx,x,y,radius,radius*.7,i%2 ? '#2d6155' : '#255046');
        ellipse(ctx,x-2,y-2,radius*.54,radius*.44,'#547859');
        if (i%3 === 0) {
          ellipse(ctx,x+1,y-1,3.3,3,i%2 ? '#e38b9d' : '#9f466c');
          ellipse(ctx,x,y-2,1.2,1.2,'#f9beac');
        }
      }
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      trace(ctx,route);
      for (const [lineWidth, strokeStyle] of [[39,'#101c2c'],[33,'#66756d'],[29,'#3e464e'],[23,'#67626a']]) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
      }
      ctx.setLineDash([1,10]);
      ctx.lineWidth = 22;
      ctx.strokeStyle = '#302d4859';
      ctx.lineCap = 'butt';
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#e5b8848c';
      ctx.stroke();
      const exit = route.at(-2)[0];
      const y = height-13;
      for (const side of [-1,1]) {
        const x = exit+side*17;
        ellipse(ctx,x,y,9,7,'#171b32');
        polygon(ctx, [[x-5,y+6],[x-5,y-12],[x,y-21],[x+5,y-12],[x+5,y+6]], '#6b6a80');
        ellipse(ctx,x,y-11,3,4,'#ffcc87');
      }
      ellipse(ctx,exit,y-17,12,5,'#53466b');
      polygon(ctx, [[exit,y-24],[exit+4,y-19],[exit,y-14],[exit-4,y-19]], '#ffc299');
    });
  }

  return { sprites, enemies, portrait, terrain };
})();
