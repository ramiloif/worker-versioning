import { Connection, Client } from '@temporalio/client';
import { Worker } from '@temporalio/worker';
import * as activities from '../activities';
import { taskQueue } from '../constants';

const run = async() => {
    const connection = await Connection.connect();
    const client = new Client({
    connection,
    });

    await client.taskQueue.updateBuildIdCompatibility(taskQueue, {
        operation: 'addNewIdInNewDefaultSet',
        buildId: '2.0',
    });

    const worker = await Worker.create({
        workflowsPath: require.resolve('./workflows'),
        activities,
        taskQueue,
        buildId: '2.0',
        useVersioning: true,
    });
    await worker.run();
}


run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
  