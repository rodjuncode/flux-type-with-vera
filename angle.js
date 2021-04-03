let size = 10;


function setup() {
  createCanvas(windowWidth,windowHeight);
  


}

function draw() {
  background(255);

  fill(0);

  //translate(100,100);

  let a = createVector(600,300);
  let b = createVector(200,300); // <-- angle reference
  let c = createVector(600,100);

  let ab = p5.Vector.sub(a, b);
  let cb = p5.Vector.sub(c, b);

  // line(0,0,ab.x,ab.y);
  // line(0,0,cb.x,cb.y);

  ellipse(a.x,a.y,size,size);
  ellipse(b.x,b.y,size,size);
  ellipse(c.x,c.y,size,size);

  line(b.x,b.y,a.x,a.y);
  line(b.x,b.y,c.x,c.y);  

  arc(b.x,b.y,100,100,ab.angleBetween(cb),0);

  console.log(degrees(ab.angleBetween(cb)));

  noLoop();

}

function myAngleBetween(origin,previous,next) {
  let po = p5.Vector.sub(previous, origin);
  let no = p5.Vector.sub(next, origin);
  return po.angleBetween(no);
}



