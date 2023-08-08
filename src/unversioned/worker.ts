import { Connection, Client } from '@temporalio/client';
import { Worker } from '@temporalio/worker';
import * as activities from '../activities';
import { taskQueue } from '../constants';

const run = async() => {
    const connection = await Connection.connect();
    const client = new Client({
    connection,
    });

    // Start a 1.0 worker
    const worker = await Worker.create({
        workflowsPath: require.resolve('./workflows-after-change'),
        activities,
        taskQueue,
    });
    await worker.run();
}


run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
  