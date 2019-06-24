class DigiCar{
  constructor(){
    this.length = 25;
    this.width = 10;
    this.position = p5e.createVector(100.0,100.0);
    this.speed = p5e.createVector(0.0,0.0);
    this.maxSpeed = 3;
    this.acceleration = 0.01;
    this.friction = 0.002;
    this.braking = 0.03;
    this.maxSteeringAngle = 55;
    this.minSteeringAngle = 10;
    this.rotation = 0.0;
    this.turn = 0;
    this.color = p5e.color('yellow');
  }
  
  update(delta){
    this.speed.x -= this.friction;
    this.speed.x = p5e.constrain(this.speed.x, 0.0, this.maxSpeed);
    var speedNormalized = this.speed.x/this.maxSpeed;
    var steerAngle = (1 - speedNormalized) * this.maxSteeringAngle;
    var steer = p5e.constrain(steerAngle, this.minSteeringAngle, this.maxSteeringAngle);
    var steering = this.turn * steer;
    var angular_velocity = 0;
    if(steering){
        var turning_radius = this.length / p5e.tan(steering);
        angular_velocity = this.speed.x * 1.2 / turning_radius;
    }
    this.rotation += p5e.degrees(angular_velocity);
    this.rotation %= 360;
    var speedtmp = p5e.createVector(this.speed.x, this.speed.y);
    this.position.add(speedtmp.rotate(this.rotation));
    this.turn = 0;
    //console.log("position--"+this.position.x+":"+this.position.y);
    //console.log("speed--"+this.speed.x+":"+this.speed.y);
    //console.log("rotation--"+this.rotation);
  }
  
  draw(){
    p5e.fill(this.color);
    p5e.noStroke();
    p5e.translate(this.position.x, this.position.y);
    p5e.rotate(this.rotation);
    p5e.rect(-this.length/2, -this.width/2, this.length, this.width);
    p5e.rotate(-this.rotation);
    p5e.translate(-this.position.x, -this.position.y);
  }
  
  ai_up(){
    this.speed.x += this.acceleration;
  }
  ai_down(){
    this.speed.x -= this.braking;
  }
  ai_left(){
    this.turn = -1;
  }
  ai_right(){
    this.turn = 1;
  }
}

class Wall{
  constructor(sx, sy, ex, ey){
    this.start = p5e.createVector(sx, sy);
    this.end = p5e.createVector(ex, ey);
    this.end.sub(this.start); // has disadvantage doing like this
    this.color = p5e.color('blue');
  }
  
  update(delta){
  }
  
  draw(){
    p5e.stroke(this.color);
    p5e.translate(this.start.x, this.start.y); //sub in constructor is because of this
    p5e.line(0,0,this.end.x, this.end.y);
    p5e.translate(-this.start.x, -this.start.y);
  }
}

class Game{
  constructor() {
    if (!!Game.instance) {
      return Game.instance;
    }
    p5e.angleMode(p5e.DEGREES);
    this.digicar = new DigiCar();
    this.wall = new Wall(10,500, 100, 100);
    this.delta = p5e.millis();//TODO: Verify! provide delta arg where needed!
    Game.instance = this;
    return this;
  }
  
  update(){
    this.delta = p5e.millis() - this.delta;
    this.digicar.update(this.delta);
    this.wall.update(this.delta);
    if(p5e.keyIsDown(65)){
      this.digicar.ai_left();
    }
    if(p5e.keyIsDown(68)){
      this.digicar.ai_right();
    }
    if(p5e.keyIsDown(87)){
      this.digicar.ai_up();
    }
    if(p5e.keyIsDown(83)){
      this.digicar.ai_down();
    }
  }
  
  draw(){
    p5e.background(0); // Refresh screen
    this.digicar.draw();
    this.wall.draw();
  }
}

const p5e = new p5((sketch) => {
  sketch.setup = () => {
    sketch.createCanvas(640, 480);
    new Game();
  };
  
  sketch.draw = () => {
    var game = new Game(); //Singleton
    game.update();
    game.draw();
  };
}, 'p5DigiCars');
