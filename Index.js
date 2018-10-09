// Screen dimensions
const WIDTH = 1250;
const HEIGHT = 600;


// Create the screen canvas and context
var screen = document.createElement('canvas');
var screenCtx = screen.getContext('2d');
screen.height = HEIGHT;
screen.width = WIDTH;
document.body.appendChild(screen);
screenCtx.font = "30px Italic";


//---------sound effects
var fire = new Audio('fire.wav');
var bounce = new Audio('bounce.wav');
var big = new Audio('big.wav');
var mid = new Audio('mid.wav');

function newGame(){
   ship = newShip();
   newLevel();
}
function newLevel () {
  createRoids();
}
// Create the back buffer and context
var backBuffer = document.createElement('canvas');
var backBufferCtx = screen.getContext('2d');
backBuffer.height = HEIGHT;
backBuffer.width = WIDTH;

// game Variables
var ship ;
var timer = 0;
var Score = 0;
var level = 1;

var lives = 3;
var ROIDS_NUM = 10;

const ROIDS_SIZE = 66;
const ROIDS_SPD = 50;
const ROIDS_VERT = 10;
const ROID_JAG = 0.4;
const HIT_BOX = false;
const EXP_DUR = 0.3;
const INV_DUR = 3;
const BLINK_DUR =0.1;
const LASER_MAX = 10;
const LASER_SPD = 500;
newGame();
ship.render(screenCtx);
function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function flyOff (xroid,yroid) {
  if (distBetweenPoints (xroid.x,xroid.y,yroid.x,yroid.y) < xroid.r+yroid.r){
   console.log("collide");
  xroid.xv  =xroid.xv*-1;
    xroid.yv=  xroid.yv*-1;
  }
}


function destroyRoid (index) {
  var x = roids[index].x;
  var y = roids[index].y;
  var r = roids[index].r;
  if ( r == Math.ceil (ROIDS_SIZE/2)){
    roids.push (newAsteroid(x+40,y,Math.ceil (ROIDS_SIZE/4)));
    roids.push (newAsteroid(x-40,y,Math.ceil (ROIDS_SIZE/4)));
  }
  else if ( r == Math.ceil (ROIDS_SIZE / 4)){
    roids.push (newAsteroid(x+40,y,Math.ceil (ROIDS_SIZE/8)));
    roids.push (newAsteroid(x-40,y,Math.ceil (ROIDS_SIZE/8)));
  }
  mid.play();
  roids.splice(index,1);
  if (roids.length == 0){
    level++;
    newGame();
  }
}
function createRoids () {
  roids = [];
  var x, y;
  for (var i = 0; i < ROIDS_NUM + level; i++) {
      // random asteroid location (not touching spaceship)
      do {
          x = Math.floor(Math.random() * WIDTH);
          y = Math.floor(Math.random() * HEIGHT);
      } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);

      var tempRoid =newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 2));
      if (roids[0]==undefined) {
        roids.push(tempRoid);
        console.log("there1");
      }
      else {
      for (var j = 0; j < roids.length; j++) {
         if (distBetweenPoints (tempRoid.x,tempRoid.y,roids[j].x,roids[j].u) < tempRoid.r + roids[j].r)
         {
console.log("there2");
         }
         else{
           roids.push(tempRoid);
           break;
         }
      }
    }
  }

}
function newAsteroid(x,y,r){
  var roid = {
      a: Math.random() * Math.PI * 2, // in radians
      offs: [],
      r: r,
      vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
      x: x,
      y: y,
      xv: Math.random() * ROIDS_SPD / 45 * (Math.random() < 0.5 ? 1 : -1),
      yv: Math.random() * ROIDS_SPD / 45 * (Math.random() < 0.5 ? 1 : -1)
  };

  // populate the offsets array
  for (var i = 0; i < roid.vert; i++) {
      roid.offs.push(Math.random() * ROID_JAG * 2 + 1 - ROID_JAG);
  }

  return roid;
}
createRoids();

//----------------------------------------------------
//vectors functions!!!


/**
 * @function add
 * Sums two vectors
 * @param {Vector} a - the first vector to add
 * @param {Vector} b - the second vector to add
 * @returns a new vector representing the sum of the originals
 */

 function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  }
}

/**
 * @function subtract
 * Subtracts two vectors
 * @param {Vector} a - the vector to subtract from
 * @param {Vector} b - the second vector to subtract with
 * @returns a new vector representing the difference of the originals
 */
 function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  }
}

/**
 * @function rotate
 * Rotates a vector about the Z-axis
 * @param {Vector} a - the vector to rotate
 * @param {float} angle - the angle to roatate by (in radians)
 * @returns a new vector representing the rotated original
 */
 function rotate(a, angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

/**
 * @function dotProduct
 * Computes the dot product of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed dot product
 */
 function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y
}

/**
 * @function magnitude
 * Computes the magnitude of a vector
 * @param {Vector} a the vector
 * @returns the calculated magnitude
 */
 function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

/**
 * @function normalize
 * Normalizes the vector
 * @param {Vector} a the vector to normalize
 * @returns a new vector that is the normalized original
 */
 function normalize(a) {
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}
//------------------------------------------------------------------------------





function Bullet(x,y,angle,direction,PiAngle,velocity){
this.x=x;
this.y=y;
this.angle=angle;
this.direction=direction;
this.PiAngle=PiAngle;
this.Velocity=velocity;
this.Destroyed = false;
this.r=1;
this.update = function (){
  this.x=this.x+this.Velocity.x;
  this.y=this.y+this.Velocity.y;

}
this.render=function(ctx){
  ctx.beginPath();
  ctx.fillStyle = 'magenta';
  ctx.arc(this.x - this.r, this.y - this.r, 2*this.r, 2*this.r, 0, 2 * Math.pi);
  ctx.fill();
}//render
}//Bullet Class.


function roidsRender (ctx) {

  var a, r, x, y, offs, vert;
  for (var i = 0; i < roids.length; i++) {
    ctx.strokeStyle = "slategrey";
    ctx.lineWidth = 30 / 20;
      // get the asteroid properties
      a = roids[i].a;
      r = roids[i].r;
      x = roids[i].x;
      y = roids[i].y;
      offs = roids[i].offs;
      vert = roids[i].vert;

      // draw the path
      ctx.beginPath();
      ctx.moveTo(
          x + r * offs[0] * Math.cos(a),
          y + r * offs[0] * Math.sin(a)
      );

      // draw the polygon
      for (var j = 1; j < vert; j++) {
          ctx.lineTo(
              x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
              y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
          );
      }
      //ctx.fillStyle = "white";
      //ctx.fill();
      ctx.closePath();
      ctx.stroke();
      if(HIT_BOX){
        ctx.strokeStyle = 'lime';
        ctx.beginPath ();
        ctx.arc(x,y,roids[i].r,0,Math.PI * 2, false);
        ctx.stroke();
      }

      // move the asteroid
      roids[i].x += roids[i].xv;
      roids[i].y += roids[i].yv;

      // handle asteroid edge of screen
      if (roids[i].x < 0 - roids[i].r) {
          roids[i].x = WIDTH + roids[i].r;
      } else if (roids[i].x > WIDTH + roids[i].r) {
          roids[i].x = 0 - roids[i].r
      }
      if (roids[i].y < 0 - roids[i].r) {
          roids[i].y = HEIGHT + roids[i].r;
      } else if (roids[i].y > HEIGHT + roids[i].r) {
          roids[i].y = 0 - roids[i].r
      }
  }
  }



function newShip () {
  return new SHIP ();
}
//The player ship class.
function SHIP(){
   this.x = WIDTH/2;
   this.y = HEIGHT/2;
   this.r=15;
   this.angle = 0
   this.direction="up";
   this.PiAngle=this.angle*Math.PI/180;
   this.Velocity={x:Math.cos(this.PiAngle),y: Math.sin(this.PiAngle)};
   this.accelration=0;
   this.explodeTime = 0 ;
   this.life=3;
   this.warp=3;
   this.laser = [];
   this.canShoot = true;
   this.bullets=[];
   this.Destroyed = false;
   this.nose =this.x + 4 / 3 * this.r * Math.cos(this.angle);
   this.ynose =this.y - 4 / 3 * this.r * Math.sin(this.angle);

   this.render=function(ctx){
     ctx.fillStyle = "white";
      ctx.fillText("Score:"+Score,0,HEIGHT);
      ctx.fillText("Enemies: "+roids.length,WIDTH/3,HEIGHT);
      if (lives <= 0){
        ctx.fillText("Lives: Dead",WIDTH/2,HEIGHT);
      }
      else {
        ctx.fillText("Lives: "+lives,WIDTH/2,HEIGHT);
      }
      ctx.fillText("Level: "+level,WIDTH-100,HEIGHT);

      screenCtx.font = "10px";
      ctx.fillText("up,down,left,right to move, space to shoot",WIDTH/2-100,HEIGHT-50);
     ctx.save();
     ctx.strokeStyle = "red";
     ctx.lineWidth = 30 / 20;
     ctx.beginPath();
     //ctx.translate(this.x, this.y);
     ctx.beginPath();
     ctx.translate(this.x, this.y);

     ctx.moveTo(0, 0);
     ctx.rotate(this.angle*Math.PI/180)

     var tx = 8;
     var ty = 12;
     ctx.moveTo(4-tx,2-ty)
     ctx.lineTo(20-tx, 18-ty);
     ctx.lineTo(-4-tx, 18-ty);
     ctx.closePath();
     ctx.stroke();
     //ctx.translate(this.x, this.y)

     ctx.translate(0, 0);
  ctx.restore();
     ctx.closePath();
     ctx.stroke();

     ctx.translate(0, 0);
ctx.restore();
    if(HIT_BOX){
      ctx.strokeStyle = 'red';
      ctx.beginPath ();
      ctx.arc(this.x,this.y,15,0,Math.PI * 2, false);
      ctx.stroke();
    }

     this.bullets.forEach( function(bullet){

         if(bullet.x>WIDTH|| bullet.y>HEIGHT||bullet.x<-5|| bullet.y<-5){

         }
         else{
           if(bullet.Destroyed===false){
             bullet.render(ctx);
             bullet.update();
           }
           bullet.update();}

     });

   }
   this.explode  = function (){
   this.explodeTime = Math.ceil (EXP_DUR * 30);
   }
   this.Forward = function(){
    if(this.accelration>4){}
    else{this.accelration++;}
      this.x   = add({x:this.x,y:this.y},  this.Velocity).x;
      this.y = add({x:this.x,y:this.y},  this.Velocity).y;
  }

  this.Backward=function(){
    if(this.accelration<-4){}
    else{this.accelration--;}
     this.x= add({x:this.x,y:this.y}, {x:this.Velocity.x*-1,y:this.Velocity.y*-1}).x;
       this.y= add({x:this.x,y:this.y}, {x:this.Velocity.x*-1,y:this.Velocity.y*-1}).y;
  }

  this.update =function(input){

     this.direction = input.direction;

       // Apply our movement
       switch(this.direction) {
         case 'right':
        //this.angle -= 360 / 180 * Math.PI / 30//this.rotate(+20);
     this.rotate (20);
           break;
         case 'left':
         this.rotate(-20);
          //this.angle += 360 / 180 * Math.PI / 30; //this.rotate(-20);
           break;
           case 'up':

             this.Forward();

           break;

           case 'down':
             this.Backward();
             break;
             case 'warp':
             this.warp--;
            //   this.Backward();
               break;
             case 'Fire':
             fire.play();
  this.bullets.push(new Bullet(this.x,this.y,this.angle,this.direction,0,this.Velocity));
            break;

    }
    }

  this.rotate=function(angle){
        this.angle += angle;
        this.PiAngle=this.angle*Math.PI/180;
        this.Velocity={x:Math.cos(this.PiAngle),y: Math.sin(this.PiAngle)};
    }

  this.Move=function(){

      this.x= this.x+this.Velocity.x*this.accelration;
      this.y=this.y+this.Velocity.y*this.accelration;
    //  HEIGHT
    //  WIDTH
      if(this.x>WIDTH){this.x=0;}
      if(this.x<0){this.x=WIDTH;}
      if(this.y<0){this.y=HEIGHT;}
      if(this.y>HEIGHT){this.y=0;}
  }
}//Ship class.
var input = {
      direction: 'down'
    };

    function handleKeyDown(event) {
      if (lives <= 0){
        return;
      }
      event.preventDefault();
      switch(event.key){
        case 'w':
        case 'ArrowUp':
        console.log("Up");
        input.direction = 'up';
            ship.update(input);
          break;
        case 'a':
        case 'ArrowLeft':
          console.log("Left");
        input.direction = 'left';
          ship.update(input);
          break;
        case 's':
        case 'ArrowDown':
          console.log("Down");
      input.direction = 'down';
        ship.update(input);
          break;

        case 'd':
        case 'ArrowRight':
          console.log("Right");
        input.direction = 'right';
          ship.update(input);
          break;
          case 'f' :
            console.log("Warp");
          input.direction="warp";
          if(ship.Destroyed===false &&ship.wrap>0){

              //ship.warp();
              ship.wrap--;
              ship.x = Math.floor(Math.random() * (570- 5 + 1)) + 5;
                ship.y = Math.floor(Math.random() * (570- 5 + 1)) + 5;
              warpText.innerHTML="Warp:  "+ship.wrap;

          }

          ship.update(input);


          break;
          case'g':
          input.direction="Shatter";
            ship.shatter--;
            shatterText.innerHTML="Shatter: "+ship.shatter;
          astroids.forEach(function(astroid){
            if(ship.shatter>0){

              astroid.Destroyed=true;
              if((astroid.mass/2)>6){
                //var velocity=astroid.Velocity;
              //  velocity.x-3;
                //velocity.y-3;
                astroids.push(new Astroid(astroid.x,astroid.y,astroid.mass/2,{x:astroid.Velocity.x*-1,y:astroid.Velocity.y}));
                astroids.push(new Astroid(astroid.x,astroid.y,astroid.mass/2,astroid.Velocity));
              }


            }

          });
          break;

          case ' ':
          input.direction="Fire";
          ship.update(input);
        //  ship.shootLaser();
          break;
        }
    }//handle key down.
   window.addEventListener ('keydown',handleKeyDown);
    var handleKeyDown=handleKeyDown.bind(this);
    //var keydown = handleKeyDown(event);


function loop(){
      screenCtx.fillStyle="white";
      screenCtx.fillText("Hallejua",WIDTH/2,HEIGHT/2);


  var exploding = ship.explodeTime >  0;
   ship.bullets.forEach (function (bullet,index){
      if(bullet.x >=  WIDTH + bullet.r)
      ship.bullets.splice(index, 1);
   });

   var ax, ay, ar, lx, ly ;
   for (var i = roids.length - 1;i >= 0 ; i--) {
     ax = roids[i].x;
     ay = roids[i].y;
     ar = roids[i].r;
     for (var j =  ship.bullets.length -1 ; j >= 0; j--) {
       lx = ship.bullets[j].x;
       ly = ship.bullets[j].y;
       if (distBetweenPoints (ax,ay,lx,ly)< ar){
         ship.bullets.splice(j,1);
         Score += 100;
         destroyRoid(i);
         break;
       }
     }
   }
  for (var i = 0; i < roids.length; i++) {
      for (var j = 0; j < roids.length; j++) {

        if(i==j){

        }else
        {
         big.play();
          flyOff(roids[i],roids[j]);
        }

      }
  }

  screenCtx.clearRect(0, 0, WIDTH, HEIGHT);
  roidsRender (screenCtx);
timer++;
for (var w = 0; w < ship.laser.lengh; w++) {
  ship.laser[w].x += ship.laser[w].xv;
  ship.laser[w].y += ship.laser[w].yv;
}
      if (!exploding)
      {
        for (var i = 0; i < roids.length; i++) {
         if (distBetweenPoints(ship.x,ship.y,roids[i].x,roids[i].y) < ship.r+roids[i].r)
         {
           ship = newShip();
           if (lives > 0 ){
             ship.explode();
             mid.play();
             lives--;
           }
           else {

           }



         }
         }

           ship.Move();
         ship.render(screenCtx);


}
else {
  screenCtx.fillStyle = 'darkred';
  screenCtx.beginPath ();
  screenCtx.arc(ship.x,ship.y,ship.r*1.5,0,Math.PI * 2, false);
  screenCtx.fill();


  screenCtx.fillStyle = 'red';
  screenCtx.beginPath ();
  screenCtx.arc(ship.x,ship.y,ship.r*1.2,0,Math.PI * 2, false);
  screenCtx.fill();


  screenCtx.fillStyle = 'yellow';
  screenCtx.beginPath ();
  screenCtx.arc(ship.x,ship.y,ship.r,0,Math.PI * 2, false);
  screenCtx.fill();


  screenCtx.fillStyle = 'white';
  screenCtx.beginPath ();
  screenCtx.arc(ship.x,ship.y,ship.r*0.8,0,Math.PI * 2, false);
  screenCtx.fill();
  ship.explodeTime--;
  if (ship.explodeTime == 0 ){

  }
}

//    pullets.forEach (function(bullet){
//      bullet.render(screenCtx);
//      bullet.update();
//    });



//  if(ship.life>0 && ship.Destroyed==true &&ship.deadShipTimer>100){
//    ship.Destroyed=false;
//    ship.x=300;
//    ship.y=300;
//  }




  }




var interval = setInterval(loop,20);
loop();
