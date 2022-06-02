let shaderTexture;
let shaders = [];
let waves = [];
let total = 50;
let incoFont;

let hw, qw, hh;
let fps = 0;

function preload() {
  incoFont = loadFont('fonts/Roboto-Regular.ttf');
  sineShader = loadShader('shaders/waves.vert', 'shaders/sine.frag');
  addSynthShader = loadShader('shaders/waves.vert', 'shaders/addSynth.frag');
  ampModShader = loadShader('shaders/waves.vert', 'shaders/ampMod.frag');
  freqModShader = loadShader('shaders/waves.vert', 'shaders/freqMod.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // blendMode(SCREEN)
  
  hw = width * 0.5;
  qw = hw * 0.5;
  hh = height * 0.5;

  noStroke();

  shaderTexture = createGraphics(600, 300, WEBGL);
  shaderTexture.background(0, 0);
  shaderTexture.noStroke();

  shaders = [sineShader, addSynthShader, ampModShader, freqModShader];
  
  textFont(incoFont, 32);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  noStroke();
  
  for (const sh of shaders) {
    sh.setUniform('u_time', frameCount * 0.2);
    sh.setUniform('u_resolution', [600, 400]);    
  }

  background(0);
  texture(shaderTexture);
  
  let remove = [];
  for (const w of waves) {
    w.draw();
    w.advance();
    let offset = 2 * w.width;
    if (w.entered) {
      if (w.pos.x > hw + offset || w.pos.y > hh + offset || w.pos.x < -hw - offset || w.pos.y < -hh - offset) {
        remove.push(waves.indexOf(w));
      }      
    } else {
      if (w.pos.x < hw + offset && w.pos.y < hh + offset && w.pos.x > -hw - offset && w.pos.y > -hh - offset) {
        w.entered = true;
      }
    }
  }
  
  for (let i = remove.length - 1; i >= 0; i--) {
    waves.splice(remove[i], 1);
  }
  
  let i = total - waves.length;
  while(i-- > 0) {
    waves.push(new Wave());
  }
  
  if (frameCount % 10 == 0) {
    fps = frameRate();
    if (fps > 61) {
      total += 6;
    } else if (total > 12 && fps < 50) {
      total -= 6;
    }
  }
  
  fill(225);
  // strokeWeight(6)
  stroke(10);
  text(nf(fps, 3, 1), -hw + 10, -hh + 30);
  text(total, -hw + 10, -hh + 60);
}

class Wave {

  constructor() {
    this.shader = shaders[floor(random(0, shaders.length))];
    this.freq = random(24.0, 36.0);
    this.harm = pow(2, floor(random(0, 3)));
    this.width = random(120, 220);
    this.height = random(120, 220);
    this.entered = false;
    this.speed = random(3, 6);
    this.orientation = createVector(random(-1, 1), random(-1, 1)).normalize();
    
    let offset = this.height //incorrect, but works and it's fast
    if (this.orientation.x < 0 && this.orientation.y < 0) {
      this.pos = createVector(random(-qw, qw), hh + offset);
    } else if (this.orientation.x < 0 && this.orientation.y > 0) {
      this.pos = createVector(random(-qw, qw), -hh - offset);
    } else if (this.orientation.x > 0 && this.orientation.y > 0) {
      this.pos = createVector(random(-qw, qw), -hh - offset);
    } else {
      this.pos = createVector(random(-qw, qw), hh + offset);
    }
    this.pos.sub(p5.Vector.mult(this.orientation, this.width));
  }
  
  advance() {
    this.pos.add(p5.Vector.mult(this.orientation, this.speed));
  }
  
  draw() {
    this.shader.setUniform('v_freq', this.freq);
    this.shader.setUniform('v_harm', this.harm);
    shaderTexture.shader(this.shader);
    shaderTexture.rect(0,0,10,10);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.orientation.heading());
    rect(0, 0, this.width, this.height);
    pop();
  }
}
