import { Client, Connection, WorkflowClient } from '@temporalio/client';
import { taskQueue } from './constants';

const run = async () => {

  const connection = await Connection.connect();
  const response = await connection.workflowService.listWorkflowExecutions({
    query: `WorkflowType = 'versioningExample' and ExecutionStatus = 'Running'`,
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
  const taskQueueReachability = reachability.buildIdReachability['1.0'].taskQueueReachability[taskQueue];
  for (const [taskQueue, reachability] of Object.entries(taskQueueReachability)) {
    if (reachability.length > 0) {
      if (reachability[0] === 'NotFetched') {
        console.log("rhat?")
      } else {
        console.log('Build id still reachable on:', taskQueue);
      }
    }
};
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
