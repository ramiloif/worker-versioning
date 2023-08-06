import { Connection, Client } from '@temporalio/client';
import { Worker } from '@temporalio/worker';
import * as activities from '../activities';
import * as newActivities from './new-activities';
import { taskQueue } from '../constants';

const run = async() => {
    const connection = await Connection.connect();
    const client = new Client({
    connection,
    });

    // First, let's make the task queue use the build id versioning feature by adding an initial
    // default version to the queue:
    await client.taskQueue.updateBuildIdCompatibility(taskQueue, {
        operation: 'addNewIdInNewDefaultSet',
        buildId: '2.0',

    });

    // Start a 1.0 worker
    const worker1 = await Worker.create({
        workflowsPath: require.resolve('./workflowsV2'),
        activities: {...activities, ...newActivities},
        taskQueue,
        buildId: '2.0',
        useVersioning: true,
    });
    await worker1.run();
}


run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
  