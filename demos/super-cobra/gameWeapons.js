
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