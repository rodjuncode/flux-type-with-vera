let blockGrid = 3;
let citySize = blockGrid*3;
let blockSize;
let city = [];
let blockRadius;
let streetSize;
//let bgColor = '#E2AFDE';
//let bgColor = '#04e762';
let bgColor = '#008bf8';
let mapCursor;
let mapOffSetX = 0.002;
let mapOffSetY = 0.003;
let mapMovingX;
let mapMovingY;

let img;
let font;

function preload() {
  font = loadFont('assets/MuseoModerno-ExtraLight.ttf');
  img = loadImage('assets/type.png');
}

function setup() {
  createCanvas(400,800);

  blockSize = width/blockGrid;
  blockRadius = blockSize/4;
  streetSize = blockSize/8;

  // init city
  for (let i = 0; i < citySize; i++) {
    city[i] = [];
    for (let j = 0; j < citySize; j++) {
      let block = {
        top: random() > 0.5,
        right: random() > 0.5,
        bottom: random() > 0.5,
        left: random() > 0.5,
      }
      city[i].push(block);
    }
  }
  
  mapCursor = createVector(-height/2,-height/2);
  mapMovingX = 0;
  mapMovingY = 0;

}

function draw() {

  push();

  rotate(radians(-10));

  // //scale(0.1);
  background(bgColor); // try with blue and green for the blocks
  fill(0);
  noStroke();
  
  mapMovingX += mapOffSetX;
  mapMovingY += mapOffSetY;

  translate(mapCursor.x + map(noise(mapMovingX),0,1,-height/2,height/2),mapCursor.y + map(noise(mapMovingY),0,1,-height/2,height/2));



  //translate(-blockSize/2,-blockSize/2);
  push();

  for (let i = 0; i < citySize; i++) {
    for (let j = 0; j < citySize; j++) {
      let corners = [
                      (city[i][j].top?blockRadius:0),
                      (city[i][j].right?blockRadius:0),
                      (city[i][j].bottom?blockRadius:0),
                      (city[i][j].left?blockRadius:0)                                            
                    ]
      if (i == ceil(blockGrid/2) + 2 &&
          j == ceil(blockGrid/2) + 2) {
            push();
            noFill();
            stroke(0);
            strokeWeight(0.5);
      }                    
      rect(i*blockSize+streetSize/2,j*blockSize+streetSize/2,blockSize-streetSize,blockSize-streetSize,corners[0],corners[1],corners[2],corners[3]);
      if (i == ceil(blockGrid/2) + 2 &&
          j == ceil(blockGrid/2) + 2) {
            pop();
      }                     
    }
  }
  pop();

//  spiral(0,0,blockSize);

//  noLoop();

  pop();


  image(img,0,height/2,width,height/2);
}


function spiral(x, y, size) {

  let spin = 0.1;
  let grow = 0.6;

  let a = 0;
  let s = 0;

  push();
  strokeWeight(width/300);
  translate(width/2,height/2);
  rectMode(CENTER);
  noStroke();
  fill(bgColor);  
  rect(0,0,size,size);
  stroke(0);
  noFill();
  beginShape();
  while(s < size/2) {
    a += spin;
    s += grow;
    let _x = cos(a)*s;
    let _y = sin(a)*s;
    vertex(_x,_y);
  }
  endShape();
  pop();


}