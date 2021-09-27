
///////////////////////////////////////////////////////////////////////////////
class Cobra extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1, 1), 0, vec2(36, 16));

        this.lastPos = this.pos;

         this.weapon1 = new Weapon(this.pos, this);
         this.weapon2 = new Weapon(this.pos, this);

         this.addChild(this.weapon1, vec2( .1, - 0.2));
         this.addChild(this.weapon2, vec2( .1, - 0.2));

        // make a bouncy ball
        this.setCollision(1);
        this.velocity = vec2(0, 0); // vec2(randSign(), -1).scale(.2); //
        this.elasticity = 0;
        this.damping = 0;

        this.inputLeft = 0;
        this.inputRight = 0;
        this.inputThrust = 0;

        this.thrust = vec2(0, 0);
        this.rot = 0;

    }

    update() {

        // movement control
        const inputLeft = keyIsDown(37);
        const inputRight = keyIsDown(39);
        const inputThrust = keyIsDown(38);
        const inputDown = keyIsDown(40);

        this.holdingShoot = mouseIsDown(0) || keyIsDown(90) || gamepadIsDown(2);

        const FPS = 60; // frames per second

        const SHIP_BRAKE = 0.5; // acceleration of the ship in pixels per second per second
        const SHIP_THRUST = 1.0; // acceleration of the ship in pixels per second per second
        const SHIP_THRUST_FORWARD = 0.5; // acceleration of the ship in pixels per second per second
        const SHIP_TURN_SPD = 360; // turn speed in degrees per second
        const FRICTION = 0.7; // friction coefficient of space (0 = no friction, 1 = lots of friction)


        // update weapon trigger
         this.weapon1.triggerIsDown = this.holdingShoot;
         this.weapon2.triggerIsDown = this.holdingShoot;

        // left arrow (rotate ship left)
        if (inputLeft) {
            this.rot -= SHIP_TURN_SPD / 180 * Math.PI / FPS;
            this.thrust.x -= SHIP_THRUST_FORWARD/ FPS;
        } else {
            this.rot *= 0.8;
        }

        // right arrow (rotate ship right)
        if (inputRight){
            this.rot += SHIP_TURN_SPD / 180 * Math.PI / FPS;
            this.thrust.x += SHIP_THRUST_FORWARD / FPS;
        } else {
            this.rot *= 0.8;
        }

        // up arrow (thrust ship forward)
        if (inputThrust) {
            //this.thrust.x += SHIP_THRUST * Math.cos(this.rot) / FPS;
            this.thrust.y += SHIP_THRUST / FPS;
        } else {
            this.thrust.x -= FRICTION * this.thrust.x / FPS;
            this.thrust.y -= FRICTION * this.thrust.y / FPS;
        }

        // down arrow (brake ship)
        if (inputDown) {
            this.thrust.y -= SHIP_THRUST / FPS;

        } else {
            this.thrust.x -= SHIP_BRAKE * this.thrust.x / FPS;
            this.thrust.y -= SHIP_BRAKE * this.thrust.y / FPS;
        }


        // 
        // if (this.thrust.y < -gravity )
        //         this.thrust.y = -gravity;

        // track last pos for ladder collision code
        this.lastPos = this.pos.copy();

        // rotate the ship
        this.angle = this.rot;


        // move the ship
        this.pos.x += this.thrust.x;
        this.pos.y += this.thrust.y;

        // this.velocity.add(this.thrust);
        // this.pos.add(this.velocity);

        // handle limits of area
        let limits = tileCollisionSize.add(vec2(5)); //

        if (this.pos.x < 0) {
            this.pos.x = limits.x;
        } else if (this.pos.x > limits.x) {
            this.pos.x = 0;
        }
        if (this.pos.y < 0) {
            this.pos.y = limits.y;
        } else if (this.pos.y > limits.y) {
            this.pos.y = 0;
        }

        // update physics
        super.update();
    }

}
