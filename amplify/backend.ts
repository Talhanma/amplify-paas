import { defineBackend } from '@aws-amplify/backend';
import { Aspects, type IAspect } from 'aws-cdk-lib';
import { CfnFunction } from 'aws-cdk-lib/aws-lambda';
import type { IConstruct } from 'constructs';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data,
});

class DeploymentMemoryLimit implements IAspect {
  visit(node: IConstruct): void {
    if (
      node instanceof CfnFunction &&
      node.node.path.includes('CDKBucketDeployment')
    ) {
      node.memorySize = 512;
    }
  }
}

Aspects.of(backend.data.stack).add(new DeploymentMemoryLimit());
