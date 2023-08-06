import { Client, Connection, WorkflowClient } from '@temporalio/client';
import { taskQueue } from './constants';

const run = async () => {

  const connection = await Connection.connect();
  const response = await connection.workflowService.listWorkflowExecutions({
    query: `ExecutionStatus = "Running"`,
    namespace: 'default',
  });

  const client = new WorkflowClient();
  response.executions.forEach(async (e) => {
    console.log(e.execution?.workflowId);
    const handle = client.getHandle(e.execution!.workflowId!);
    await handle.signal('deliverOrder', '');
  });

  const reachability = await new Client().taskQueue.getReachability({
    taskQueues: [taskQueue],
    buildIds: ['1.0'],
  });

  console.log('Reachability:', JSON.stringify(reachability));
  if (reachability.buildIdReachability['1.0'].taskQueueReachability[taskQueue].length === 0) {
    console.log('Confirmed that 1.0 is ready to be retired!');
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
