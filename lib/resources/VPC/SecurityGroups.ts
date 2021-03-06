import { Stack } from "@aws-cdk/core";
import { SecurityGroup, Peer, Port, Vpc } from "@aws-cdk/aws-ec2";
import { StackParameters } from "../../parameters";

type SecurityGroupDependency = {
    vpc: Vpc;
}
export class SGForInstance {
    public static create(stack: Stack, params: StackParameters, {
        vpc,
        sgForLB
    }: SecurityGroupDependency & {sgForLB: SecurityGroup}): SecurityGroup {
        const sgForInstance = new SecurityGroup(
            stack,
            'SecurityGroupForInstance',
            {
                vpc,
                securityGroupName: 'For EC2'
            }
        );
        sgForInstance.addEgressRule(sgForLB, Port.allTraffic());
        sgForInstance.addIngressRule(sgForLB, Port.tcp(80));
        sgForInstance.addIngressRule(sgForLB, Port.tcp(80));
        sgForInstance.addIngressRule(Peer.ipv4(params.sshLocationIpv4.valueAsString), Port.tcp(22));
        // sgForInstance.addIngressRule(Peer.ipv6(params.sshLocationIpv6.valueAsString), Port.tcp(22));
        return sgForInstance
    }
}

export class SGForDB {
    public static create(stack: Stack, params: StackParameters, {
        vpc,
        sgForInstance
    }: SecurityGroupDependency & {sgForInstance: SecurityGroup}): SecurityGroup {
        const sgForDB = new SecurityGroup(
            stack,
            'SecurityGroupForDatabase',
            {
                vpc,
                securityGroupName: 'For Database'
            }
        )
        sgForDB.connections.allowFrom(sgForInstance, Port.tcp(3306), "EC2 Allow access to RDS")
        return sgForDB
    }
}

export class SGForLB {
    public static create(stack: Stack, params: StackParameters, resources: SecurityGroupDependency) {
        const sgForLB = new SecurityGroup(
            stack,
            'SecurityGroupForLoadBalancer',
            {
                vpc: resources.vpc,
                securityGroupName: 'For LoadBalancer'
            }
        );
        sgForLB.addEgressRule(Peer.anyIpv4(), Port.allTraffic());
        sgForLB.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
        sgForLB.addIngressRule(Peer.anyIpv6(), Port.tcp(80));
        return sgForLB
    }
}