let font;
let fontBaseLine;
let fontBaseBar;
let text = "bolsonaro genocidal";
let textPoints;

let svgCanvas;

let _xHeightRatio = {}; // singleton (to make sure it doenst recalculate what is not needed)

function preload() {
  font = loadFont('assets/DelaGothicOne-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  // calculates font size
  fontSize = width/2;
  textFont(font);
  textSize(width);
  while(textWidth(text) > width*0.8) {
    fontSize--;
    textSize(fontSize);
  }

  // calculates baseline
  fontBaseLine = textAscent()*xHeightRatio(font)/2 + height/2;

  // calculates basebar
  fontBaseBar = width/2 - textWidth(text)/2;

  textPoints = txt2Points(text,fontBaseBar,fontBaseLine,fontSize,font);

}

function draw() {

  background('#000');
  fill(255);
  noStroke();

  textFromPoints(textPoints,true);

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


// converts word to points and separates the shapes
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


function showVertex(x,y,color) {
  push();
  noFill();
  stroke(color);
  ellipse(x,y,10,10);
  pop();
}