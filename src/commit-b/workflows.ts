import { condition, defineSignal, log, proxyActivities, setHandler, sleep } from '@temporalio/workflow';
import type * as activities from '../activities';
import type * as newActivities from './new-activities';

const { bakePizza: preparePizza } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 minutes',
});

const { addOlives } = proxyActivities<typeof newActivities>({
  startToCloseTimeout: '30 minutes',
});

export const deliverOrder = defineSignal<[string]>('deliverOrder');

/**
 * The 2.0 version of the workflow, which is fully incompatible with the other workflows, since it
 * alters the sequence of commands without using `patched`.
 */
export async function versioningExample(): Promise<string> {
  log.info('Workflow V2.0 started!', {});
  let shouldFinish = false;
  await addOlives();
  await preparePizza();
  
  setHandler(deliverOrder, async () => {
      shouldFinish = true;
  });
  await condition(() => shouldFinish);
  return 'Concluded workflow on v2';
}
