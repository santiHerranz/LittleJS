/*
LittleJS Asteroids Objects
 */

'use strict';

///////////////////////////////////////////////////////////////////////////////
class Asteroid extends EngineObject {
    constructor(pos) {
        super(pos, vec2(4, 2), 1, vec2(32, 16), 0, randColor());

        // set to collide
        this.setCollision(1, 1);
        this.mass = 0.1;

        this.velocity.x = -rand( - .15, .15);
        this.velocity.y = -rand( - .15, .15);
        this.angle = rand(-Math.PI / 2, Math.PI / 2);
        this.momentum = 0.1 * rand(-Math.PI / 2, Math.PI / 2);

        this.elasticity = 0.1;
        this.damping = 0.1;

    }

    update() {
        super.update();

        this.velocity.x += -rand( - .001, .001);
        this.velocity.y += -rand( - .001, .001);

        this.angle += this.momentum;

        this.pos.add(this.velocity);


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

    }

    collideWithObject(o) {

        if (o instanceof Ship || o instanceof Bullet) {
        // destroy block when hit with ball
        this.destroy();
        ++score;
        zzfx(...[, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);

        const color1 = this.color;
        const color2 = color1.lerp(new Color, .5);
        new ParticleEmitter(
            this.pos, this.size, .1, 400, PI, // pos, emitSize, emitTime, emitRate, emiteCone
            0, vec2(16), // tileIndex, tileSize
            color1, color2, // colorStartA, colorStartB
            color1.scale(1, 0), color2.scale(1, 0), // colorEndA, colorEndB
            .2, .6, .6, .1, .05, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
            .99, .95, .4, PI, .1, // damping, angleDamping, gravityScale, particleCone, fadeRate,
            1, 0, 1 // randomness, collide, additive, randomColorLinear, renderOrder
        );

        }

        return 1;
    }
}

class Weapon extends EngineObject {
    constructor(pos, parent) {
        //        super(pos, vec2(.6), 2, vec2(8));
        super(pos, vec2(.6), 2, vec2(4));

        //this.angle = 0;

        // weapon settings
        this.fireRate = 8;
        this.bulletSpeed = .5;
        this.bulletSpread = .1;
        this.damage = 1;

        // prepare to fire
        this.renderOrder = parent.renderOrder + 1;
        this.fireTimeBuffer = this.localAngle = 0;
        this.recoilTimer = new Timer;

        // shell effect
        this.addChild(this.shellEmitter = new ParticleEmitter(
                    vec2(), 0, 0, 0, .1, // pos, emitSize, emitTime, emitRate, emiteCone
                    undefined, undefined, // tileIndex, tileSize
                    new Color(1, .8, .5), new Color(.9, .7, .5), // colorStartA, colorStartB
                    new Color(1, .8, .5), new Color(.9, .7, .5), // colorEndA, colorEndB
                    3, .1, .1, .15, .1, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
                    1, .95, 1, 0, 0, // damping, angleDamping, gravityScale, particleCone, fadeRate,
                    .1, 1 // randomness, collide, additive, randomColorLinear, renderOrder
                ));
        this.shellEmitter.elasticity = .5;
        this.shellEmitter.particleDestroyCallback = persistentParticleDestroyCallback;
    }

    update() {
        super.update();

        const bulletRange = 16;        

        // // update recoil
        // if (this.recoilTimer.active())
        //     this.localAngle = lerp(this.recoilTimer.getPercent(), 0, this.localAngle);


        this.mirror = this.parent.mirror;
        this.fireTimeBuffer += timeDelta;
        if (this.triggerIsDown) {
            // try to fire
            for (; this.fireTimeBuffer > 0; this.fireTimeBuffer -= 1 / this.fireRate) {
                // create bullet
                playSound(sound_shoot, this.pos);
                this.localAngle = -rand( - .015, .015);
                this.recoilTimer.set(.4);
                const direction = vec2(1, 0).rotate(-this.angle); //vec2(this.getMirrorSign(this.bulletSpeed), 0);
                const velocity = direction.rotate(rand(1, -1) * this.bulletSpread);
                const bullet = new Bullet(this.pos, this.parent, velocity, this.damage);
                bullet.range = bulletRange;

                // spawn shell particle
                this.shellEmitter.localAngle =  - .8 * this.getMirrorSign();
                this.shellEmitter.emitParticle();
            }
        } else
            this.fireTimeBuffer = min(this.fireTimeBuffer, 0);
    }
}

///////////////////////////////////////////////////////////////////////////////

class Bullet extends EngineObject {
    constructor(pos, attacker, velocity, damage) {
        super(pos, vec2());
        this.color = new Color(1, 1, 0);
        this.lastVelocity = this.velocity;
        this.velocity = velocity;
        this.attacker = attacker;
        this.damage = damage;
        this.damping = 1;
        this.gravityScale = 0;
        this.renderOrder = 100;
        this.drawSize = vec2(.2, .5);
        this.setCollision(1,1);
    }

    update() {
        this.lastVelocity = this.velocity;
        super.update();


        this.range -= this.velocity.length();
        if (this.range < 0 )
        {
            const emitter = new ParticleEmitter(
                this.pos, .2, .1, 100, PI, // pos, emitSize, emitTime, emitRate, emiteCone
                0, undefined,     // tileIndex, tileSize
                new Color(1,1,0,.5), new Color(1,1,1,.5), // colorStartA, colorStartB
                new Color(1,1,0,0), new Color(1,1,1,0), // colorEndA, colorEndB
                .1, .5, .1, .1, .1, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
                1, 1, .5, PI, .1,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
                .5, 0, 1           // randomness, collide, additive, randomColorLinear, renderOrder
            );

            this.destroy();
            return;
        }


        // check if hit someone
        forEachObject(this.pos, this.size, (o) => {
            if (o.isGameObject)
                this.collideWithObject(o)
        });

        this.angle = this.velocity.angle();
    }

    collideWithObject(o) {
        if (o.isGameObject && o != this.attacker) {
            o.damage(this.damage, this);
            o.applyForce(this.velocity.scale(.1));
        }

        this.kill();
        return 1;
    }

    collideWithTile(data, pos) {
        if (data <= 0)
            return 0;

        destroyTile(pos);
        this.kill();
        return 1;
    }

    kill() {
        if (this.destroyed)
            return;
        this.destroy();

        // spark effects
        const emitter = new ParticleEmitter(
                this.pos, 0, .1, 100, .5, // pos, emitSize, emitTime, emitRate, emiteCone
                undefined, undefined, // tileIndex, tileSize
                new Color(1, 1, 0), new Color(1, 0, 0), // colorStartA, colorStartB
                new Color(1, 1, 0), new Color(1, 0, 0), // colorEndA, colorEndB
                .2, .2, 0, .1, .1, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
                1, 1, .5, PI, .1, // damping, angleDamping, gravityScale, particleCone, fadeRate,
                .5, 1, 1 // randomness, collide, additive, randomColorLinear, renderOrder
            );
        emitter.trailScale = 1;
        emitter.elasticity = .3;
        emitter.angle = this.velocity.angle() + PI;
    }
}

///////////////////////////////////////////////////////////////////////////////
class Ship extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1, 1), 0);

        this.lastPos = this.pos;

        this.weapon1 = new Weapon(this.pos, this);
        this.weapon2 = new Weapon(this.pos, this);

        this.addChild(this.weapon1, vec2( - .1, 0.2));
        this.addChild(this.weapon2, vec2( - .1, -0.2));

        // make a bouncy ball
        this.setCollision(1);
        this.velocity = vec2(0, 0); // vec2(randSign(), -1).scale(.2); //
        this.elasticity = 0;
        this.damping = 1;

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
        const inputBrake = keyIsDown(40);

        this.holdingShoot = mouseIsDown(0) || keyIsDown(90) || gamepadIsDown(2);

        const FPS = 60; // frames per second

        const SHIP_BRAKE = 0.05; // acceleration of the ship in pixels per second per second
        const SHIP_THRUST = 0.05; // acceleration of the ship in pixels per second per second
        const SHIP_TURN_SPD = 360; // turn speed in degrees per second
        const FRICTION = 0.7; // friction coefficient of space (0 = no friction, 1 = lots of friction)


        // update weapon trigger
        this.weapon1.triggerIsDown = this.holdingShoot;
        this.weapon2.triggerIsDown = this.holdingShoot;

        // left arrow (rotate ship left)
        if (inputLeft)
            this.rot -= SHIP_TURN_SPD / 180 * Math.PI / FPS;

        // right arrow (rotate ship right)
        if (inputRight)
            this.rot += SHIP_TURN_SPD / 180 * Math.PI / FPS;

        // up arrow (thrust ship forward)
        if (inputThrust) {
            this.thrust.x += SHIP_THRUST * Math.cos(this.rot) / FPS;
            this.thrust.y -= SHIP_THRUST * Math.sin(this.rot) / FPS;
        } else {
            this.thrust.x -= FRICTION * this.thrust.x / FPS;
            this.thrust.y -= FRICTION * this.thrust.y / FPS;
        }

        // down arrow (brake ship)
        if (inputBrake) {
            this.thrust.x -= SHIP_BRAKE * this.thrust.x / FPS;
            this.thrust.y -= SHIP_BRAKE * this.thrust.y / FPS;
        }

        // track last pos for ladder collision code
        this.lastPos = this.pos.copy();

        // rotate the ship
        this.angle = this.rot;
        //this.weapon.angle = Math.PI; //this.angle+Math.PI/2;

        // move the ship
        this.pos.x += this.thrust.x;
        this.pos.y += this.thrust.y;

        // this.pos.add(this.thrust);

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
