/**
 * Defines some shortcuts to creating and adding objects to a world.
 */
import {oimo} from 'oimophysics';
import MathUtil = oimo.common.MathUtil;
import SphericalJoint = oimo.dynamics.constraint.joint.SphericalJoint;
import ShapeConfig = oimo.dynamics.rigidbody.ShapeConfig;
import RevoluteJointConfig = oimo.dynamics.constraint.joint.RevoluteJointConfig;
import World = oimo.dynamics.World;
import UniversalJointConfig = oimo.dynamics.constraint.joint.UniversalJointConfig;
import Vec3 = oimo.common.Vec3;
import Mat3 = oimo.common.Mat3;
import CylindricalJoint = oimo.dynamics.constraint.joint.CylindricalJoint;
import PrismaticJoint = oimo.dynamics.constraint.joint.PrismaticJoint;
import PrismaticJointConfig = oimo.dynamics.constraint.joint.PrismaticJointConfig;
import RigidBodyConfig = oimo.dynamics.rigidbody.RigidBodyConfig;
import CapsuleGeometry = oimo.collision.geometry.CapsuleGeometry;
import RevoluteJoint = oimo.dynamics.constraint.joint.RevoluteJoint;
import RagdollJoint = oimo.dynamics.constraint.joint.RagdollJoint;
import RigidBodyType = oimo.dynamics.rigidbody.RigidBodyType;
import CylindricalJointConfig = oimo.dynamics.constraint.joint.CylindricalJointConfig;
import SphericalJointConfig = oimo.dynamics.constraint.joint.SphericalJointConfig;
import RagdollJointConfig = oimo.dynamics.constraint.joint.RagdollJointConfig;
import SpringDamper = oimo.dynamics.constraint.joint.SpringDamper;
import TranslationalLimitMotor = oimo.dynamics.constraint.joint.TranslationalLimitMotor;
import RotationalLimitMotor = oimo.dynamics.constraint.joint.RotationalLimitMotor;
import UniversalJoint = oimo.dynamics.constraint.joint.UniversalJoint;
import RigidBody = oimo.dynamics.rigidbody.RigidBody;
import SphereGeometry = oimo.collision.geometry.SphereGeometry;
import BoxGeometry = oimo.collision.geometry.BoxGeometry;
import CylinderGeometry = oimo.collision.geometry.CylinderGeometry;
import ConeGeometry = oimo.collision.geometry.ConeGeometry;
import Geometry = oimo.collision.geometry.Geometry;
import Shape = oimo.dynamics.rigidbody.Shape;


class OimoUtil {
    public static addRagdollJoint(w: World, rb1: RigidBody, rb2: RigidBody, anchor: Vec3, twistAxis: Vec3, swingAxis: Vec3, swingSd: SpringDamper = null, maxSwing1Deg: number = 180, maxSwing2Deg: number = 180, twistSd: SpringDamper = null, twistLm: RotationalLimitMotor = null): RagdollJoint {
        let invRot1: Mat3 = rb1.getRotation().transpose();
        let invRot2: Mat3 = rb2.getRotation().transpose();
        let jc: RagdollJointConfig = new RagdollJointConfig();
        jc.init(rb1, rb2, anchor, twistAxis, swingAxis);
        if (twistSd != null) jc.twistSpringDamper = twistSd;
        if (twistLm != null) jc.twistLimitMotor = twistLm;
        if (swingSd != null) jc.swingSpringDamper = swingSd;
        jc.maxSwingAngle1 = maxSwing1Deg * MathUtil.TO_RADIANS;
        jc.maxSwingAngle2 = maxSwing2Deg * MathUtil.TO_RADIANS;
        let j: RagdollJoint = new RagdollJoint(jc);
        w.addJoint(j);
        return j;
    }

    public static addUniversalJoint(w: World, rb1: RigidBody, rb2: RigidBody, anchor: Vec3, axis1: Vec3, axis2: Vec3, sd1: SpringDamper = null, lm1: RotationalLimitMotor = null, sd2: SpringDamper = null, lm2: RotationalLimitMotor = null): UniversalJoint {
        let invRot1: Mat3 = rb1.getRotation().transpose();
        let invRot2: Mat3 = rb2.getRotation().transpose();
        let jc: UniversalJointConfig = new UniversalJointConfig();
        jc.init(rb1, rb2, anchor, axis1, axis2);
        if (sd1 != null) jc.springDamper1 = sd1;
        if (lm1 != null) jc.limitMotor1 = lm1;
        if (sd2 != null) jc.springDamper2 = sd2;
        if (lm2 != null) jc.limitMotor2 = lm2;
        let j: UniversalJoint = new UniversalJoint(jc);
        w.addJoint(j);
        return j;
    }

    public static addPrismaticJoint(w: World, rb1: RigidBody, rb2: RigidBody, anchor: Vec3, axis: Vec3, sd: SpringDamper = null, lm: TranslationalLimitMotor = null): PrismaticJoint {
        let jc: PrismaticJointConfig = new PrismaticJointConfig();
        jc.init(rb1, rb2, anchor, axis);
        if (sd != null) jc.springDamper = sd;
        if (lm != null) jc.limitMotor = lm;
        let j: PrismaticJoint = new PrismaticJoint(jc);
        w.addJoint(j);
        return j;
    }

    public static addRevoluteJoint2(w: World, rb1: RigidBody, rb2: RigidBody, localAnchor1: Vec3, localAnchor2: Vec3, localAxis1: Vec3, localAxis2: Vec3, sd: SpringDamper = null, lm: RotationalLimitMotor = null): RevoluteJoint {
        let jc: RevoluteJointConfig = new RevoluteJointConfig();
        jc.rigidBody1 = rb1;
        jc.rigidBody2 = rb2;

        jc.localAnchor1.copyFrom(localAnchor1);
        jc.localAnchor2.copyFrom(localAnchor2);

        jc.localAxis1.copyFrom(localAxis1);
        jc.localAxis2.copyFrom(localAxis2);

        if (sd != null) jc.springDamper = sd;
        if (lm != null) jc.limitMotor = lm;
        let j: RevoluteJoint = new RevoluteJoint(jc);
        w.addJoint(j);
        return j;
    }

    public static addRevoluteJoint(w: World, rb1: RigidBody, rb2: RigidBody, anchor: Vec3, axis: Vec3, sd: SpringDamper = null, lm: RotationalLimitMotor = null): RevoluteJoint {
        let jc: RevoluteJointConfig = new RevoluteJointConfig();
        jc.init(rb1, rb2, anchor, axis);
        if (sd != null) jc.springDamper = sd;
        if (lm != null) jc.limitMotor = lm;
        let j: RevoluteJoint = new RevoluteJoint(jc);
        w.addJoint(j);
        return j;
    }

    public static addCylindricalJoint(w: World, rb1: RigidBody, rb2: RigidBody, anchor: Vec3, axis: Vec3, rotSd: SpringDamper = null, rotLm: RotationalLimitMotor = null, traSd: SpringDamper = null, traLm: TranslationalLimitMotor = null): CylindricalJoint {
        let jc: CylindricalJointConfig = new CylindricalJointConfig();
        jc.init(rb1, rb2, anchor, axis);
        if (rotSd != null) jc.rotationalSpringDamper = rotSd;
        if (rotLm != null) jc.rotationalLimitMotor = rotLm;
        if (traSd != null) jc.translationalSpringDamper = traSd;
        if (traLm != null) jc.translationalLimitMotor = traLm;
        let j: CylindricalJoint = new CylindricalJoint(jc);
        w.addJoint(j);
        return j;
    }

    public static addSphericalJoint(w: World, rb1: RigidBody, rb2: RigidBody, anchor: Vec3): SphericalJoint {
        let jc: SphericalJointConfig = new SphericalJointConfig();
        jc.init(rb1, rb2, anchor);
        let j: SphericalJoint = new SphericalJoint(jc);
        w.addJoint(j);
        return j;
    }

    public static addSphericalJoint2(w: World, rb1: RigidBody, rb2: RigidBody, localAnchor1: Vec3, localAnchor2: Vec3): SphericalJoint {
        let jc: SphericalJointConfig = new SphericalJointConfig();
        jc.localAnchor1.copyFrom(localAnchor1);
        jc.localAnchor2.copyFrom(localAnchor2);

        jc.rigidBody1 = rb1;
        jc.rigidBody2 = rb2;

        let j: SphericalJoint = new SphericalJoint(jc);
        w.addJoint(j);
        return j;
    }

    public static addSphere(w: World, center: Vec3, radius: number, wall: boolean): RigidBody {
        return OimoUtil.addRigidBody(w, center, new SphereGeometry(radius), wall);
    }

    public static addBox(w: World, center: Vec3, halfExtents: Vec3, wall: boolean): RigidBody {
        return OimoUtil.addRigidBody(w, center, new BoxGeometry(halfExtents), wall);
    }

    public static addCylinder(w: World, center: Vec3, radius: number, halfHeight: number, wall: boolean): RigidBody {
        return OimoUtil.addRigidBody(w, center, new CylinderGeometry(radius, halfHeight), wall);
    }

    public static addCone(w: World, center: Vec3, radius: number, halfHeight: number, wall: boolean): RigidBody {
        return OimoUtil.addRigidBody(w, center, new ConeGeometry(radius, halfHeight), wall);
    }

    public static addCapsule(w: World, center: Vec3, radius: number, halfHeight: number, wall: boolean): RigidBody {
        return OimoUtil.addRigidBody(w, center, new CapsuleGeometry(radius, halfHeight), wall);
    }

    public static addRigidBody(w: World, center: Vec3, geom: Geometry, wall: boolean): RigidBody {
        let shapec: ShapeConfig = new ShapeConfig();
        shapec.geometry = geom;
        let bodyc: RigidBodyConfig = new RigidBodyConfig();
        bodyc.type = wall ? RigidBodyType.STATIC : RigidBodyType.DYNAMIC;
        bodyc.position = center;
        let body: RigidBody = new RigidBody(bodyc);
        body.addShape(new Shape(shapec));
        w.addRigidBody(body);
        return body;
    }

    // ---------------------------------------------------------------------------
    public static addRagdoll(w: World, pos: Vec3): RigidBody {
        let head: RigidBody;
        let body1: RigidBody;
        let body2: RigidBody;
        let armL1: RigidBody;
        let armL2: RigidBody;
        let armR1: RigidBody;
        let armR2: RigidBody;
        let legL1: RigidBody;
        let legL2: RigidBody;
        let legR1: RigidBody;
        let legR2: RigidBody;
        let headHeight: number = 0.3;
        let upperBody: number = 0.35;
        let lowerBody: number = 0.35;
        let bodyRadius: number = 0.2;
        let legRadius: number = 0.1;
        let legInterval: number = 0.15;
        let upperLeg: number = 0.5;
        let lowerLeg: number = 0.5;
        let armRadius: number = 0.075;
        let upperArm: number = 0.35;
        let lowerArm: number = 0.35;
        head = OimoUtil.addCapsule(w, pos.add(new Vec3(0, lowerBody + upperBody + bodyRadius + headHeight / 2, 0)), headHeight / 2 * 0.8, headHeight / 2 * 0.2, false);
        body1 = OimoUtil.addCapsule(w, pos.add(new Vec3(0, lowerBody + upperBody / 2, 0)), bodyRadius, upperBody / 2, false);
        body2 = OimoUtil.addCapsule(w, pos.add(new Vec3(0, lowerBody / 2, 0)), bodyRadius, lowerBody / 2, false);
        legL1 = OimoUtil.addCapsule(w, pos.add(new Vec3(-legInterval, -upperLeg / 2 - legInterval, 0)), legRadius, upperLeg / 2, false);
        legL2 = OimoUtil.addCapsule(w, pos.add(new Vec3(-legInterval, -upperLeg - lowerLeg / 2 - legInterval, 0)), legRadius, lowerLeg / 2, false);
        legR1 = OimoUtil.addCapsule(w, pos.add(new Vec3(legInterval, -upperLeg / 2 - legInterval, 0)), legRadius, upperLeg / 2, false);
        legR2 = OimoUtil.addCapsule(w, pos.add(new Vec3(legInterval, -upperLeg - lowerLeg / 2 - legInterval, 0)), legRadius, lowerLeg / 2, false);
        armL1 = OimoUtil.addCapsule(w, pos.add(new Vec3(-bodyRadius - upperArm / 2, lowerBody + upperBody, 0)), armRadius, upperArm / 2, false);
        armL2 = OimoUtil.addCapsule(w, pos.add(new Vec3(-bodyRadius - upperArm - lowerArm / 2, lowerBody + upperBody, 0)), armRadius, lowerArm / 2, false);
        armR1 = OimoUtil.addCapsule(w, pos.add(new Vec3(bodyRadius + upperArm / 2, lowerBody + upperBody, 0)), armRadius, upperArm / 2, false);
        armR2 = OimoUtil.addCapsule(w, pos.add(new Vec3(bodyRadius + upperArm + lowerArm / 2, lowerBody + upperBody, 0)), armRadius, lowerArm / 2, false);
        let rotZ90: Mat3 = new Mat3(null).appendRotationEq(90 * MathUtil.TO_RADIANS, 0, 0, 1);
        armL1.setRotation(rotZ90);
        armL2.setRotation(rotZ90);
        armR1.setRotation(rotZ90);
        armR2.setRotation(rotZ90);
        let x: Vec3 = new Vec3(1, 0, 0);
        let y: Vec3 = new Vec3(0, 1, 0);
        let z: Vec3 = new Vec3(0, 0, 1);
        let sd: SpringDamper = new SpringDamper();
        sd.setSpring(10, 1);
        let lm180: RotationalLimitMotor = new RotationalLimitMotor().setLimits(-90 * MathUtil.TO_RADIANS, 90 * MathUtil.TO_RADIANS);
        let lm90: RotationalLimitMotor = new RotationalLimitMotor().setLimits(-45 * MathUtil.TO_RADIANS, 45 * MathUtil.TO_RADIANS);
        let lmElbow: RotationalLimitMotor = new RotationalLimitMotor().setLimits(0 * MathUtil.TO_RADIANS, 160 * MathUtil.TO_RADIANS);
        let lmKnee: RotationalLimitMotor = new RotationalLimitMotor().setLimits(0 * MathUtil.TO_RADIANS, 160 * MathUtil.TO_RADIANS);
        OimoUtil.addRagdollJoint(w, body1, head, pos.add(new Vec3(0, lowerBody + upperBody + bodyRadius, 0)), y, x, sd, 90, 70, sd, lm180);
        OimoUtil.addRagdollJoint(w, body1, body2, pos.add(new Vec3(0, lowerBody, 0)), y, x, sd, 60, 45, sd, lm90);
        OimoUtil.addRagdollJoint(w, body1, armL1, pos.add(new Vec3(-bodyRadius, lowerBody + upperBody, 0)), x, z, sd, 90, 90, sd, lm180);
        OimoUtil.addRagdollJoint(w, body1, armR1, pos.add(new Vec3(bodyRadius, lowerBody + upperBody, 0)), x.negate(), z, sd, 90, 90, sd, lm180);
        OimoUtil.addRevoluteJoint(w, armL1, armL2, pos.add(new Vec3(-bodyRadius - upperArm, lowerBody + upperBody, 0)), y, sd, lmElbow);
        OimoUtil.addRevoluteJoint(w, armR1, armR2, pos.add(new Vec3(bodyRadius + upperArm, lowerBody + upperBody, 0)), y.negate(), sd, lmElbow);
        let jc = new RagdollJointConfig();
        jc.swingSpringDamper = sd;
        jc.maxSwingAngle1 = 90 * MathUtil.TO_RADIANS;
        jc.maxSwingAngle2 = 70 * MathUtil.TO_RADIANS;
        jc.twistSpringDamper = sd;
        jc.twistLimitMotor = lm180;
        jc.init(body2, legL1, pos.add(new Vec3(-legInterval, -legInterval, 0)), y, x);
        jc.localTwistAxis1 = z.negate();
        w.addJoint(new RagdollJoint(jc));
        jc.init(body2, legR1, pos.add(new Vec3(legInterval, -legInterval, 0)), y, x);
        jc.localTwistAxis1 = z.negate();
        w.addJoint(new RagdollJoint(jc));
        OimoUtil.addRevoluteJoint(w, legL1, legL2, pos.add(new Vec3(-legInterval, -legInterval - upperLeg, 0)), x, sd, lmKnee);
        OimoUtil.addRevoluteJoint(w, legR1, legR2, pos.add(new Vec3(legInterval, -legInterval - upperLeg, 0)), x, sd, lmKnee);

        return body1;
    }
}

export default OimoUtil;