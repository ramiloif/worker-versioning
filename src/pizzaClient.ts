import { Client, Connection, WorkflowClient } from "@temporalio/client";
import { taskQueue } from "./constants";
import { uuid4 } from "@temporalio/workflow";

const run = async () => {

    const connection = await Connection.connect();
    const client = new Client({
    connection,
    });

  // Start a workflow that will run on the 1.0 worker
  const firstWorkflowID = 'order-pizza_' + uuid4();
  const firstWorkflow = await client.workflow.start('versioningExample', {
    workflowId: firstWorkflowID,
    taskQueue,
    workflowExecutionTimeout: '5 minutes',
  });

  const connectiono = await Connection.connect();
  const response = await connectiono.workflowService.listWorkflowExecutions({
  query: `ExecutionStatus = "Running"`,
  namespace: 'default'
    });

response.executions.forEach(e => { 
    console.log(e.execution?.workflowId)
    console.log(JSON.stringify(e, null, 2))
})

};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
  