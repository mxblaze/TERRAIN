
let w; 
let h; 
let minScl; // Scale, min of w and h
let asp = 1 / 1.45; 
let c; // Canvas
let pixelMapper; 
let seed;

let canvasExtent = [-1, 1, -1 / asp, 1 / asp];
let artExtent ;
let extentWidth = canvasExtent[1] - canvasExtent[0];

let pointsPerFrame = 111 ;
let pds;

let canvasSize;
let pxswap;

/////////Color stuff//////////////
const palettes = [
    
    //0 Coral Serenity
    ['#DB4F54','#FCD265','#F7B1A1','#29A691','#B8D9CE','#1F3359','#315F8C','#7CA9BF'],
    //1 Iceberge
    ['#7CA9BF','#CFE6DE','#ffffff','#5a868c','#4a7fb5','#d2f5ff'],
    //2 Rose Blooming
    ['#A63A4C','#BF7E89','#D97C8B','#a53b4d','#ec9daa','#942436'],
    //3 Summer Vibe
    ['#DB4F54','#D12A2F','#ED8F4C','#FCD265','#FCBC19','#a58e7e','#bc9880'],
    //4 Mystic Meadows
    ['#FCD265','#C1C8E0','#29A691','#CFE6DE','#B8D9CE','#121A33','#1F3359','#315F8C','#7CA9BF','#543E2E','#3B2B20','#211812'],
    //5 Midnight Garden
    ['#2C2933','#3e3e59','#807380','#3d4d4d','#8fb395','#ccb9b8','#e6918a','#e6d2ac'],
    //6 Ember Glow
    ['#212121','#404040','#eabf48','#f0d456','#ff8a05','##f34a16'],
    //7 Earth
    ['#344b33','#b78d6a','#c5ae96','#ffffff','#7f886e','#0e4425'],
    //8 Sakura
    ['#e6c6d6','#F2D7E2','#F8EBF1','#D8A3AB','#E3B4BF','#edc4d2','#FADEE9','#C7E9C0','#B2D4CA'],
    //9 Enchanted Lavender
    ['#BEADFA','#D0BFFF','#DFCCFB','#fff5b3'],
    //10 Oceanic Twilight
    ['#222831','#393E46','#00ADB5','#b8b7b7'],
    //11 Golden Forest 
    ['#5F6F52','#A9B388','#d5dfb3','#fff08f','#faedcd','#B99470'],
    //12 Faded Glory
    ['#EAC7C7','#D5E3E8','#E8A2A2','#F7F5EB','#A0C3D2','#EAE0DA'],
    //13 Black Shadow
    ['#747474','#4b4b4b','#3e3e3e','#313131','#e0e0e0'],
    //14 Space Convention
    ['#561e6c','#43486f','#000754','#340054','#48006c'],
    //15 Gryffin
    ['#740001','#ae0001','#eeba30','#d3a625','#000000']
  ];
   
  const PalNames = [
    "Coral Serenity",
    "Iceberge",
    "Rose Blooming",
    "Summer Vibe",
    "Mystic Meadows",
    "Mignight Garden",
    "Ember Glow",
    "Earthy Vitality",
    "Sakura",
    "Enchanted Lavender",
    "Oceanic Twilight",
    "Golden Forest ",
    "Faded Glory",
    "Black Shadow",
    "Space Convention",
    "Gryffin"
  ];
  const BackGrd = [['#f6f3ef'],['#e9e0d3'],['#c9c0b0']];
  const BGName ={'#f6f3ef': 'Light','#e9e0d3': 'Mid','#c9c0b0': 'Tan'};
  let Theme;
  let BG;
////////////////////////////////

function setup() {
	randomSeed(hl.random());
	noiseSeed(hl.random());
  
  Pal =Math.floor(palettes.length*hl.random());
  Bground =Math.floor(BackGrd.length*hl.random());
  Theme = palettes[Pal];
  Theme= Theme.slice(0,Theme.length);
  PalName = PalNames[Pal]; 
	Theme.sort((a, b) => hl.random() - 0.5);

  [w, h] = CanvasSize(windowWidth, windowHeight, asp);
  w = Math.round(w);
  h = Math.round(h);
  minScl = Math.min(w, h);

  pixelMapper = new PixelMapper(w, h);
  pixelMapper.setExtentWidth(extentWidth);

  c = createCanvas(w,h, WEBGL);
  canvasSize = createVector(w,h);
  
  let M = hl.randomInt(11);
  let Margin_Name ;
  if(M<4){
    Margin_Name="Large";
    margin =0.1;
  }else if (M<=8){
    Margin_Name= "Medium";
    margin= 0.06;
  }else{
    Margin_Name= "Small";
    margin= 0.03;
  }
  artExtent = addMargin(canvasExtent, margin);

  const style=[
    [0.2,1],[0.3,1],[0.4,1],[0.5,1],[0.6,1],
    [0.2,2],[0.3,2],[0.4,2],[0.5,2],[0.6,2],
    [0.2,3],[0.3,3],[0.4,3],[0.5,3],
    [0.3,4],[0.4,4],[0.5,4],
    [0.3,5],[0.4,5],[0.5,5],[0.6,5],[0.7,5],
    [0.3,6],[0.4,6],[0.5,6],[0.6,6],[0.7,6],
    [0.3,7],[0.4,7],[0.5,7],[0.6,7],[0.7,7],
    [0.4,8],[0.5,8],[0.6,8],[0.7,8],
    [0.4,9],[0.5,9],[0.6,9],[0.7,9]
  ];
  let styleRnd = hl.randomElement(style);
  console.log("rand:"+styleRnd)
  let styleName;
  if (
  [0.2, 1].every((value, index) => styleRnd[index] === value) ||
  [0.3, 1].every((value, index) => styleRnd[index] === value) ||
  [0.2, 2].every((value, index) => styleRnd[index] === value) ||
  [0.3, 2].every((value, index) => styleRnd[index] === value) ||
  [0.2, 3].every((value, index) => styleRnd[index] === value) ||
  [0.3, 3].every((value, index) => styleRnd[index] === value)
  ) {
  styleName = "Rolling";
  } else if (
  [0.4, 1].every((value, index) => styleRnd[index] === value) ||
  [0.5, 1].every((value, index) => styleRnd[index] === value) ||
  [0.6, 1].every((value, index) => styleRnd[index] === value) ||
  [0.4, 2].every((value, index) => styleRnd[index] === value) ||
  [0.5, 2].every((value, index) => styleRnd[index] === value) ||
  [0.6, 2].every((value, index) => styleRnd[index] === value) ||
  [0.4, 3].every((value, index) => styleRnd[index] === value) ||
  [0.5, 3].every((value, index) => styleRnd[index] === value)
  ) {
  styleName = "Serene";
  } else if (
  [0.3, 4].every((value, index) => styleRnd[index] === value) ||
  [0.4, 4].every((value, index) => styleRnd[index] === value) ||
  [0.5, 4].every((value, index) => styleRnd[index] === value) ||
  [0.3, 5].every((value, index) => styleRnd[index] === value) ||
  [0.4, 5].every((value, index) => styleRnd[index] === value) ||
  [0.5, 5].every((value, index) => styleRnd[index] === value) ||
  [0.6, 5].every((value, index) => styleRnd[index] === value) ||
  [0.3, 6].every((value, index) => styleRnd[index] === value) ||
  [0.4, 6].every((value, index) => styleRnd[index] === value) ||
  [0.5, 6].every((value, index) => styleRnd[index] === value) ||
  [0.6, 6].every((value, index) => styleRnd[index] === value) ||
  [0.3, 7].every((value, index) => styleRnd[index] === value) ||
  [0.4, 7].every((value, index) => styleRnd[index] === value) ||
  [0.5, 7].every((value, index) => styleRnd[index] === value) ||
  [0.6, 7].every((value, index) => styleRnd[index] === value) ||
  [0.4, 8].every((value, index) => styleRnd[index] === value) ||
  [0.5, 8].every((value, index) => styleRnd[index] === value) ||
  [0.6, 8].every((value, index) => styleRnd[index] === value) ||
  [0.4, 9].every((value, index) => styleRnd[index] === value) ||
  [0.5, 9].every((value, index) => styleRnd[index] === value) ||
  [0.6, 9].every((value, index) => styleRnd[index] === value)
  ) {
  styleName = "Craggy";
  } else if (
  [0.7, 5].every((value, index) => styleRnd[index] === value) ||
  [0.7, 6].every((value, index) => styleRnd[index] === value) ||
  [0.7, 7].every((value, index) => styleRnd[index] === value) ||
  [0.7, 8].every((value, index) => styleRnd[index] === value) ||
  [0.7, 9].every((value, index) => styleRnd[index] === value)
  ) {
  styleName = "Majestic";
  }
 
xyNoise = new Perlin(seed*321, styleRnd[0],styleRnd[1], 0.5);
  //increase range will result in bubble style, perfect range is between 0.1-0.6
  //increase octaves increase the complexcity
  const circles = generateCircles(artExtent, 0.01, hl.random(0.25,0.40), hl.random);
  const nCircles = circles.length;
	const warpSizeX = hl.random(0.1, 1);
	const warpSizeY = hl.random(0.1, 1);
	const numWarps = floor(hl.random(1, 15));

  function distanceFunction(p) {
    let [x, y] = p;
		let warpScale = 1;
		for (let i = 0; i < numWarps; i++) {
			const dx = -1 + 2*xyNoise.ev(x, y);
    	const dy = -1 + 2*xyNoise.ev(x, y);
    	x += warpScale*warpSizeX*dx;
    	y += warpScale*warpSizeY*dy;
			warpScale *= 0.4;
		}
    
    for (let i = 0; i < nCircles; i++) {
      const circ = circles[i];
      const [cX, cY] = circ.center;
      if (Math.hypot(cX - x, cY - y) < circ.radius) return circ.dist;
    }
    return 1;
  }
	const minDistance = hl.random(0.003, 0.005);
	const maxDistance = minDistance*hl.random(5, 10);
	
  pds = new Poisson2D({
    extent: artExtent,
    minDistance: minDistance,
    maxDistance: maxDistance,
    distanceFunction,
    tries: 15,
  }, hl.random);
  
  ///////bg setup/////
  pxswap = createShader(vert, frag);
  noStroke();
  BG = hl.randomElement(BackGrd[Bground]);
  background(BG);
  shader(pxswap);

  let randomBlend =hl.randomElement(['0.15','0.18','0.21','0.24','0.27']);
  let scaling = hl.randomElement(['1.0','5.0','10.0','50.0','100.0'])
  let unoise =hl.randomElement(['200.0','600.0','900.0','1400.0','1800.0']);
  let g1 = hl.random();
  let g2 = hl.random();
  let g3 = hl.random();

  console.log('randomBlend = '+randomBlend);
  console.log('Scaling = '+scaling);
  console.log('unoise = '+unoise);
  console.log('g1 = '+g1);
  console.log('g2 = '+g2);
  console.log('g3 = '+g3);
  
  pxswap.setUniform("u_resolution", [windowWidth, windowHeight]);
  pxswap.setUniform("u_canvasSize", [canvasSize.x, canvasSize.y]);
  pxswap.setUniform("u_randomBlend", randomBlend);
  pxswap.setUniform("u_scaling", scaling);
  pxswap.setUniform("u_noise", unoise);
  pxswap.setUniform("u_g1", g1);
  pxswap.setUniform("u_g2", g2);
  pxswap.setUniform("u_g3", g3);
  blendMode(MULTIPLY);
  noStroke();
  rect(0, 0, width, height);
  
  const colorCodes = BG.split(',');
  const BgNameSet = colorCodes.map(colorCode => BGName[colorCode]);
  
  /////hl setup////////
  hl.token.setName(`TΞRRAIN #${hl.tx.tokenId}`);
  hl.token.setDescription(
    `"TΞRRAIN" is not just a series or just long-form generative art; it's an exploration, a poetic voyage through the realms of generative art. Each piece, born from the intricate dance of Poisson disk sampling technique, unfurls like a flourishing canvas. Dynamic shapes and harmonious patterns evolve in real-time, revealing the profound blend of algorithms and creative spontaneity. In the quiet algorithmic symphony of TΞRRAIN, find pixelated mysteries that invite you to explore the emotional depth of this digital landscape.`
  );
  hl.token.setTraits({
    Theme: PalName,
    Paper : BgNameSet[0],
    Style : styleName,
    Margin : Margin_Name
  });
  console.log(hl.token.getTraits())
  console.log(hl.tx.hash)
}
 
////////////////////////////////////////////
function draw() {
  translate(-width/2, -height/2)
  strokeWeight(minScl / hl.random(275,400));
  
  for (let i = 0; i < pointsPerFrame; i++) {
    let p = pds.next();
		const D = pds.getLastDistance();
		const ColSet = Math.pow(D, 0.1);
    if (!p) {
      hl.token.capturePreview();
      noLoop();
      return;
    }
		const currentColor = Theme[Math.min(Math.floor(ColSet*Theme.length), Theme.length - 1)];
    stroke(currentColor);
    point(...pixelMapper.toPixel(...p));
    
  }
}

//////////////Sub-Function//////////
function addMargin(extent, margin) {
    
  let [xMin, xMax, yMin, yMax] = extent;
    const width = xMax - xMin;
    const height = yMax - yMin;

    const minScl = Math.min(width, height);

    xMin += margin*minScl;
    xMax -= margin*minScl;
    yMin += margin*minScl;
    yMax -= margin*minScl;
    return [xMin, xMax, yMin, yMax];
}
function CanvasSize(windowWidth, windowHeight, ASP) {
    let w, h;

    if (windowHeight*ASP <= windowWidth) {
        [w, h] = [windowHeight*ASP, windowHeight];
    } else {
        [w, h] = [windowWidth, windowWidth / ASP];
    }
    return [w,h];
}
function generateCircles(extent, minRadius, maxRadius, rng = hl.random) {
    const circles = [];

    const pds = new Poisson2D({ extent, minDistance:  0.09 }, rng);
    const centers = pds.fill();
    const n = centers.length;

    for (let i = 0; i < n; i++) {
        circles.push({ 
          center: centers[i],
            radius: minRadius + (maxRadius - minRadius)*rng(),
            dist: Math.pow(rng(), 5) // Using a power > 1 gives bias towards lower values
            
        });
    }
    return circles;
}
class Perlin {
    constructor(seed, range, octaves, falloff) {
      this.xOffset = hl.random();
      this.yOffset = hl.random();
      this.range = range;
      this.octaves = octaves;
      this.falloff = falloff;

      this.normConst = 0;
      let ampl = 0.5;
      for (let i = 0; i < octaves; i++) {
        this.normConst += ampl;
        ampl *= falloff;
      }
    }

    ev(x, y) {
      const r = this.range;
      noiseDetail(this.octaves, this.falloff);
      let v = noise((x + this.xOffset) / r, (y + this.yOffset) / r);
      return v / this.normConst;
    }
}
class PixelMapper {
    constructor(pixelWidth, pixelHeight) {
        this.size = [pixelWidth, pixelHeight];
        this.asp = pixelWidth / pixelHeight;
        this.setFlipY(true);
        this.setExtentWidth(2);
    }

    setFlipY(value) {
        this.ySign = value ? -1 : 1;
    }

    setExtentWidth(width) {
        this.width = width;
        this.height = width / this.asp;
    }

    setExtentHeight(height) {
        this.height = height;
        this.width = asp*height;
    }

    unitToPixel(u, v) {
        const [w, h] = this.size;
        return [u*w - 0.5, v*h - 0.5];
    }


    toPixel(x, y) {
        if (y === undefined) [x, y] = x;
        let u = x / this.width + 0.5;
        let v = y * this.ySign / this.height + 0.5;
        return this.unitToPixel(u, v);
    }
}
function keyTyped() {
  if (key === 's' || key === 'S') {
    save('TΞRRAIN #'+hl.tx.tokenId+'.png');
    
    }
}

var vert = `
#ifdef GL_ES
precision highp float;
precision highp int;
#endif

attribute vec3 aPosition;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;
var frag = `
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_canvasSize;
uniform float u_randomBlend;
uniform float u_scaling;
uniform float u_noise;
uniform float u_g1;
uniform float u_g2;
uniform float u_g3;

const float PI = 3.14159265359;

// Simplex noise functions
vec3 permute(vec3 x) {
  return mod((34.0 * x +1.0) * x, u_noise);
  
}

float noise(vec2 v)
{
  const vec4 C = vec4(0.211324865405187,
                      0.366015403784439,
                      -0.576350169189626,
                      0.024590243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, u_noise);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Calculate the normal of the surface
vec3 calculateNormal(vec3 st) {
  vec2 eps = vec2(0.01, 0.);

  vec2 stXY = st.xy * 350.0;

  vec2 stCenter = stXY;
  vec2 stLeft = (stXY - vec2(eps.x, 0.0));
  vec2 stRight = (stXY + vec2(eps.x, 0.0));
  vec2 stDown = (stXY - vec2(0.0, eps.x));
  vec2 stUp = (stXY + vec2(0.0, eps.x));

  float heightCenter = noise(stCenter);
  float heightLeft = noise(stLeft);
  float heightRight = noise(stRight);
  float heightDown = noise(stDown);
  float heightUp = noise(stUp);
vec3 normal = vec3(heightLeft - heightRight, heightDown - heightUp, eps.x);
  normal = normalize(normal * 45.0 - 1.0);

  return normal;
}

const int OCTAVES = 10;

float turbulence(vec2 v){
    float turb = 0.0;
    float freq = 30.0, amp = 1.0;

    for(int i = 0; i < OCTAVES; i++){
        turb += abs(noise(v*freq))*amp;
        freq *= 0.50;
        amp *= 0.6;
    }

    return turb;
}

float random(vec2 st) {
    // Hash function
    vec2 i = floor(st);
    vec3 g = vec3(u_g1, u_g2, u_g3);
    vec2 offset = vec2(dot(g.xy, i), dot(g.yz, i));
    return fract(sin(offset.x + offset.y) * 43758.5453);
}

float stipple(vec2 st) {
    // Create a grid of cells
    vec2 grid = floor(st);
    vec2 fract_st = fract(st);

    // Calculate the distance from the center of the cell
    vec2 center = fract_st - 0.5;
    float d = length(center);

    // Generate a random threshold based on the cell's position
    float threshold = random(grid);

    // Draw a dot if the distance is less than the threshold
// Invert the distance and threshold comparison to draw the dot for distances greater than the threshold
    return step(threshold, 1.1 - d);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
    float maxCanvasDimension = max(u_canvasSize.x, u_canvasSize.y);
    vec2 scaledSt = st * maxCanvasDimension / max(u_resolution.x, u_resolution.y);

    // Use turbulence function
    float n = turbulence(scaledSt * 100.0);

    // Add tiny dots with randomized sizes
   const int numInstances = 5;

  float scalingFactors[numInstances];
  scalingFactors[0] = 50.0*u_scaling;
  scalingFactors[1] = 30.0;
  scalingFactors[2] = 70.0*u_scaling;
  scalingFactors[3] = 100.0;
  scalingFactors[4] = 60.0;

  //Scaling factor can be random to get the dif result

  for (int i = 0; i < numInstances; i++) {
    float dots = stipple(scaledSt * scalingFactors[i]);
  // Blend turbulence and dots, adjust this factor to your liking
    n += dots * u_randomBlend;
    
  }

    float greyscale = (n + 1.0) / 2.0;
    vec3 color = vec3(greyscale);

    vec3 normal = calculateNormal(vec3(scaledSt, u_time));
    normal = normal * 0.5 + 0.5;

    vec3 lightDirection = normalize(vec3(0.1, 0.9, 0.1));
    vec3 viewDirection = normalize(vec3(0.5, 0.3, 1.0));

    // Diffuse lighting
    float diffuse = max(dot(normal, lightDirection), 0.5);

    // Specular lighting
    float specular = pow(max(dot(viewDirection, reflect(-lightDirection, normal)), 0.0), 50.0);

    // Ambient light
    vec3 ambient = vec3(0.2);

    // Apply lighting to the final color
    vec3 finalColor = (color * (diffuse + ambient) + specular * 0.9);

    gl_FragColor = vec4(finalColor, 1.);
}
`;


