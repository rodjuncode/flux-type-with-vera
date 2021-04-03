let delaGothicOne;
let glyphBaseLine;
let glyphBaseBar;
let _xHeightRatio = {};
let fontSize;
let glyph = "a";
let glyphPoints;

let openFont;
let openGlyph;

let _selection = false;
let _selectionStart;
let _selectionEnd;
let _selectionPoints = [];

let _sliceGlyphOnNextDraw = false;

let ornament;
let ornamentGridSizeX = 15;
let ornamentGridSizeY = 25;
let ornamentTileSize = 50;

let svgCanvas;

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
  //delaGothicOne = loadFont('assets/UnifrakturMaguntia-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth,windowHeight);



  // openFont = await opentype.load('assets/DelaGothicOne-Regular.ttf')

  updateText();

  // gets the glyph's path
// path = openFont.getPath(glyph,glyphBaseBar,glyphBaseLine,fontSize);
// TEMP: openGlyph = openFont.stringToGlyphs(glyph)[0];

  //glyphPoints = txt2Points(glyph,glyphBaseBar,glyphBaseLine,fontSize,delaGothicOne);

  //svgCanvas = createGraphics(200, 200, SVG);

  document.addEventListener('contextmenu', event => event.preventDefault());

}

function draw() {

  //if(!openFont) return

  background(bg);  

  //path.draw(drawingContext);  
  text(glyph,glyphBaseBar,glyphBaseLine);
  
// TEMP: openGlyph.drawPoints(drawingContext,glyphBaseBar,glyphBaseLine,glyphSize);

  if (_selection) { // is selecting area
    push();
    translate(_selectionStart.x,_selectionStart.y);
    noFill();
    stroke('#00ff00');
    rect(0,0,mouseX-_selectionStart.x,mouseX-_selectionStart.x);
    pop();
  } else if (_selectionStart != undefined  // not selecting, but with something to show
      && _selectionEnd != undefined 
      && _selectionPoints.length > 0
      ) {
    push();
    noFill();
    stroke('#90e0ef');
    // rect(_selectionStart.x,_selectionStart.y,_selectionEnd.x-_selectionStart.x,_selectionEnd.y-_selectionStart.y);
    // for (let i = 0; i < _selectionPoints.length; i++) {
    //   ellipse(_selectionPoints[i].x,_selectionPoints[i].y,10,10);
    // }
    pop();
  }

  // show ornaments
  if (ornament != undefined) {
    push();
    imageMode(CENTER);
    let r = 0;
    for (let j = 0; j < ornamentGridSizeY; j++) {
      for (let i = 0; i < ornamentGridSizeX; i++) {    
        if (patternModes[curPatternMode] == ROTATION) {
          push();
          translate(i*ornamentTileSize+ornamentTileSize/2,j*ornamentTileSize+ornamentTileSize/2);
          rotate(radians(r*90));
          image(ornament,0,0,ornamentTileSize,ornamentTileSize);
          pop();
        } else if (patternModes[curPatternMode] == FLIPPED_H) {
          push();
          translate(i*ornamentTileSize+ornamentTileSize/2,j*ornamentTileSize+ornamentTileSize/2);
          if (r % 2 == 0) {
            scale(-1,1);
          }
          image(ornament,0,0,ornamentTileSize,ornamentTileSize);          
          pop();
        } else if (patternModes[curPatternMode] == FLIPPED_V) {
          push();
          translate(i*ornamentTileSize+ornamentTileSize/2,j*ornamentTileSize+ornamentTileSize/2);
          if (r % 2 == 0) {
            scale(1,-1);
          }
          image(ornament,0,0,ornamentTileSize,ornamentTileSize);          
          pop();
        } else if (patternModes[curPatternMode] == FLIPPED_HV) {
          push();
          translate(i*ornamentTileSize+ornamentTileSize/2,j*ornamentTileSize+ornamentTileSize/2);
          if (r % 2 == 0) {
            scale(-1,-1);
          }
          image(ornament,0,0,ornamentTileSize,ornamentTileSize);          
          pop();
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

  if (_sliceGlyphOnNextDraw) {
    sliceGlyph(glyphPoints,_selectionStart,_selectionEnd);
    _sliceGlyphOnNextDraw = false;
  }


  //textFromPoints(_selectionPoints,false);
  //drawOrnamentsFromPoints(_selectionPoints);

}

function updateText() {
  // calculates font size
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
  if (mouseButton === LEFT) {
    _selection = true;
    _selectionStart = createVector(mouseX,mouseY);
  } else if (mouseButton === RIGHT) {
    curPatternMode++;
    if (curPatternMode > patternModes.length - 1) {
      curPatternMode = 0;
    }
    console.log('pattern mode: ' + patternModes[curPatternMode]);
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    _selection = false;
    _selectionEnd = createVector(_selectionStart.x + mouseX-_selectionStart.x,
                                  _selectionStart.y + mouseX-_selectionStart.x);
    _sliceGlyphOnNextDraw = true;
  }
}  

function sliceGlyph(points,start,end) {
  _selectionPoints = []; 

  // for (let i = 0; i < points.length; i++) {
  //   for (let j = 0; j < points[i].length; j++) {
  //     let p = points[i][j];
  //     if (p.x > min(start.x,end.x)
  //       && p.x < max(start.x,end.x)
  //       && p.y > min(start.y,end.y)
  //       && p.y < max(start.y,end.y)) {
  //       _selectionPoints.push(createVector(p.x,p.y));
  //     }
  //   }
  // }

  // deprecated?
  // for (let i = 0; i < path.commands.length; i++) {
  //   let p = path.commands[i];
  //   if (p.x > min(start.x,end.x)
  //       && p.x < max(start.x,end.x)
  //       && p.y > min(start.y,end.y)
  //       && p.y < max(start.y,end.y)) {
  //         _selectionPoints.push(createVector(p.x,p.y));
  //   }
  // }
  
  
  let margin = 1;
  ornament = get(start.x+margin,
                  start.y+margin,
                  mouseX-start.x-margin,
                  mouseX-start.x-margin);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


// converts word to points
function txt2Points(txt, x, y, size, font) {
  let txtArray;
  let txtPoints;
  let _previousTxtSize = textSize();

  textSize(size);

  txtArray = font.textToPoints(txt, x, y, size, {
      sampleFactor: 0.3,
      simplifyThreshold: 0
    });

  txtPoints = [];
  
  // detailed analysis
  let _fontAnalysis = [];
  let currP, prevP;
  prevP = createVector(txtArray[0].x,txtArray[0].y);    
  let j = 0;
  let k = 0;
  _fontAnalysis[j] = [];
  _fontAnalysis[j][k] = prevP;
  for (let i = 1; i < txtArray.length; i++) {
      currP = createVector(txtArray[i].x,txtArray[i].y);
      if (prevP.dist(currP) > 5) {
          j++;
          _fontAnalysis[j] = [];
          k = 0;
          _fontAnalysis[j][k] = currP;
      } else {
          k++;            
          _fontAnalysis[j][k] = currP;
      }
      prevP = currP;
  }

  while (_fontAnalysis.length > 0) {
      let vertexHighIndex = 0;
      for (let i = 1; i < _fontAnalysis.length; i++) {
          if (_fontAnalysis[i].length > _fontAnalysis[vertexHighIndex].length) {
              vertexHighIndex = i;
          }
      }
      txtPoints.push(_fontAnalysis[vertexHighIndex]);
      _fontAnalysis.splice(vertexHighIndex,1)
  }    

  textSize(_previousTxtSize);

  return txtPoints;
  
}


function drawOrnamentsFromPoints(points) {
  push();
  fill('#FF0000');
  beginShape();
  for (let i = 0; i < points.length; i++) {
    vertex(points[i].x,points[i].y);
  }
  endShape(CLOSE);
  pop();
}


function textFromPoints(points, _showVertex) {
  beginShape();
  // draws main shape
  let c = color(random(255),random(255),random(255));
  for (let j = 0; j < points[0].length; j++) {
    if (_showVertex) {
      showVertex(points[0][j].x,points[0][j].y,c);
    }    
    vertex(points[0][j].x,points[0][j].y);
  }
  // draws remaining shapes and strings
  for (let j = 1; j < points.length; j++) {
    beginContour();
    let c = color(random(255),random(255),random(255));
    for (let k = 0; k < points[j].length; k++) {
      if (_showVertex) {
        showVertex(points[j][k].x,points[j][k].y,c);
      }
      vertex(points[j][k].x,points[j][k].y);
    }
    endContour();
  }  
  endShape();

  noLoop();
}



function showVertex(x,y,color) {
  push();
  noFill();
  stroke(color);
  ellipse(x,y,10,10);
  pop();
}


function keyTyped() {
  glyph = key;
  updateText();
  //bg = palette[floor(random(palette.length))];
}