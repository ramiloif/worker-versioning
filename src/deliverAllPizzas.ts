import { Client, Connection, WorkflowClient } from '@temporalio/client';
import { taskQueue } from './constants';

/**
 * 
 * This code is general for all workflows not aware of the versioning
 */
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
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
