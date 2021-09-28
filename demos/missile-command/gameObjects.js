
///////////////////////////////////////////////////////////////////////////////
class Tower extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1, 1), 0, vec2(16, 16));

        this.mass = 1;

        this.lastPos = this.pos;

         this.weapon1 = new TowerWeapon(this.pos, this);
         //this.weapon2 = new TowerWeapon(this.pos, this);

         this.addChild(this.weapon1, vec2( .1, - 0.2));
         //this.addChild(this.weapon2, vec2( .1, - 0.2));


    }

    update() {

        this.holdingShoot = mouseIsDown(0) || keyIsDown(90) || gamepadIsDown(2);

        // update weapon trigger
         this.weapon1.triggerIsDown = this.holdingShoot;
         //this.weapon2.triggerIsDown = this.holdingShoot;


        super.update();
    }

}

///////////////////////////////////////////////////////////////////////////////
class Rock extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1, 1), 2, vec2(16, 16), 0, randColor());

        // set to collide
        this.setCollision(1, 1);
        this.mass = 1;

        this.gravityScale = 0.01;
                

        this.velocity.x = -rand( - .015, .015);
        this.velocity.y = -rand( .015, .05);
        this.angle = rand(-Math.PI / 2, Math.PI / 2);
        this.momentum = 0.01 * rand(-Math.PI / 2, Math.PI / 2);

        this.elasticity = 0.1;
        this.damping = 1.0;

    }

    update() {
        super.update();

        // this.velocity.x += -rand( - .001, .001);
        // this.velocity.y += -rand( - .001, .001);

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
        } 
        // else 
        // if (this.pos.y > limits.y) {
        //     this.pos.y = 0;
        // }    
        
        
        if (this.pos.y > tileCollisionSize.y )
            this.kill();


    }

    collideWithObject(o) {

        if (true || o instanceof Tower || o instanceof TowerBullet) {
        // destroy block when hit with ball
        this.destroy();
        ++score;
        zzfx(...[, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);

        const color1 = this.color;
        const color2 = color1.lerp(new Color, .5);
        new ParticleEmitter(
            this.pos, this.size, .1, 400, PI, // pos, emitSize, emitTime, emitRate, emiteCone
            2, vec2(16), // tileIndex, tileSize
            color1, color2, // colorStartA, colorStartB
            color1.scale(1, 0), color2.scale(1, 0), // colorEndA, colorEndB
            .2, .6, .6, .1, .05, // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
            .99, .95, .4, PI, .1, // damping, angleDamping, gravityScale, particleCone, fadeRate,
            1, 0, 1 // randomness, collide, additive, randomColorLinear, renderOrder
        );

        }

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
