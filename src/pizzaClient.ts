import { Client, Connection, WorkflowClient } from "@temporalio/client";
import { taskQueue } from "./constants";
import { uuid4 } from "@temporalio/workflow";

/**
 * Notice! pizza client is not aware of the versionoing this is the point of all this sample project
 */
const run = async () => {

    const connection = await Connection.connect();
    const client = new Client({
    connection,
    });

  const firstWorkflow = await client.workflow.start('versioningExample', {
    workflowId: 'order-pizza_' + uuid4(),
    taskQueue,
    workflowExecutionTimeout: '5 minutes',
  });

  console.log(`Started pizza order: ${firstWorkflow.workflowId}`);

};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
  