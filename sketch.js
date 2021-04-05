let delaGothicOne;
let glyphBaseLine;
let glyphBaseBar;
let _xHeightRatio = {};
let fontSize;
let glyph = "a";

let _selection = false;
let _selectionStart;
let _selectionPoints = [];

let _sliceGlyphOnNextDraw = false;

let ornament;
let ornamentGridSizeX = 15;
let ornamentGridSizeY = 25;
let ornamentTileSize = 50;

let ROTATION = 'rotation';
let FLIPPED_H = 'flipped horizontal';
let FLIPPED_V = 'flipped vertical';
let FLIPPED_HV = 'flipped horizontal & vertical';
let FLOWER = 'flower';

let patternModes = [ROTATION, FLIPPED_H, FLIPPED_V, FLIPPED_HV, FLOWER];
let curPatternMode = 0;

let palette = ['#f3b61f','#F15BB5','#9B5DE5','#00BBF9','#00F5D4'];
let bg = palette[0];

function preload() {
  delaGothicOne = loadFont('assets/DelaGothicOne-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  updateText();

  document.addEventListener('contextmenu', event => event.preventDefault());
}

function draw() {

  background(bg);  

  text(glyph,glyphBaseBar,glyphBaseLine);
  
  if (_selection) { // is selecting area
    push();
    translate(_selectionStart.x,_selectionStart.y);
    noFill();
    stroke('#00ff00');
    rect(0,0,mouseX-_selectionStart.x,mouseX-_selectionStart.x);
    pop();
  } 

  // show ornaments
  if (ornament != undefined) {
    push();
    imageMode(CENTER);
    let r = 0;
    for (let j = 0; j < ornamentGridSizeY; j++) {
      for (let i = 0; i < ornamentGridSizeX; i++) {    
        // ROTATION PATTERN
        if (patternModes[curPatternMode] == ROTATION) {
          push();
          translate(i*ornamentTileSize+ornamentTileSize/2,j*ornamentTileSize+ornamentTileSize/2);
          rotate(radians(r*90));
          image(ornament,0,0,ornamentTileSize,ornamentTileSize);
          pop();
        // FLIPPED HORIZONTAL       
        } else if (patternModes[curPatternMode] == FLIPPED_H) {
          push();
          translate(i*ornamentTileSize+ornamentTileSize/2,j*ornamentTileSize+ornamentTileSize/2);
          if (r % 2 == 0) {
            scale(-1,1);
          }
          image(ornament,0,0,ornamentTileSize,ornamentTileSize);          
          pop();
        // FLIPPED VERTICAL          
        } else if (patternModes[curPatternMode] == FLIPPED_V) {
          push();
          translate(i*ornamentTileSize+ornamentTileSize/2,j*ornamentTileSize+ornamentTileSize/2);
          if (r % 2 == 0) {
            scale(1,-1);
          }
          image(ornament,0,0,ornamentTileSize,ornamentTileSize);          
          pop();
        // FLIPPED HORIZONTAL & VERTICAL        
        } else if (patternModes[curPatternMode] == FLIPPED_HV) {
          push();
          translate(i*ornamentTileSize+ornamentTileSize/2,j*ornamentTileSize+ornamentTileSize/2);
          if (r % 2 == 0) {
            scale(-1,-1);
          }
          image(ornament,0,0,ornamentTileSize,ornamentTileSize);          
          pop();
        // FLOWER PATTERN
        } else if (patternModes[curPatternMode] == FLOWER) {
          push();
          translate(i*ornamentTileSize+ornamentTileSize/2,j*ornamentTileSize+ornamentTileSize/2);
          if (i % 2 == 0) {
            scale(-1,1);
          }
          if (j % 2 == 0) {
            scale(1,-1);
          }
          image(ornament,0,0,ornamentTileSize,ornamentTileSize);          
          pop();
        }
        r++;
      }
    }
    pop();    
  }

  // prevents from capturing the selection highlight box
  if (_sliceGlyphOnNextDraw) {
    sliceGlyph(_selectionStart);
    _sliceGlyphOnNextDraw = false;
  } 

}


function updateText() {
  // calculates font size based on width
  fontSize = width/2;
  textFont(delaGothicOne);
  textSize(width);
  while(textWidth(glyph) > width/2*.7) {
    fontSize--;
    textSize(fontSize);
  }

  // calculates baseline
  glyphBaseLine = textAscent()*xHeightRatio(delaGothicOne)/2 + height/2;

  // calculates basebar
  // middle of screen glyphBaseBar = width/2 - textWidth(glyph)/2;
  glyphBaseBar = width*0.68 - textWidth(glyph)/2;
}

// calculates x-height ration related to textAscent()
function xHeightRatio(f) {
  let fontName = f.font.names.fullName;
  if (!(f.font.names.fullName in _xHeightRatio)) {
      let _prevTxtFont = textFont();
      let _prevTxtSize = textSize();
      textFont(f);
      textSize(width);
      let x = f.textToPoints("x", 0, textAscent(), width);
      let xHeightLevel = x[0].y;
      for (let i = 1; i < x.length; i++) {
          if (x[i].y < xHeightLevel) {
              xHeightLevel = x[i].y;
          }
        
      }
      let xHeight = (textAscent() - xHeightLevel);
      _xHeightRatio[fontName] = xHeight/textAscent();
      textFont(_prevTxtFont);
      textSize(_prevTxtSize);
  }

  return _xHeightRatio[fontName];
}


function mousePressed() {
  if (mouseButton === LEFT) { // start selecting area
    _selection = true;
    _selectionStart = createVector(mouseX,mouseY);
  } else if (mouseButton === RIGHT) { // changes pattern
    curPatternMode++;
    if (curPatternMode > patternModes.length - 1) {
      curPatternMode = 0;
    }
    console.log('pattern mode: ' + patternModes[curPatternMode]);
  }
}

function mouseReleased() { // stops selecting
  if (mouseButton === LEFT) { 
    _selection = false;
    _sliceGlyphOnNextDraw = true;
  }
}  

function sliceGlyph(start) { // copies selected area to memory
  _selectionPoints = []; 
  ornament = get(start.x,
                  start.y,
                  mouseX-start.x,
                  mouseX-start.x);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyTyped() { // changes glyph
  glyph = key;
  updateText();
  //bg = palette[floor(random(palette.length))];
}