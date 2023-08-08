import { condition, defineSignal, proxyActivities, setHandler, log } from '@temporalio/workflow';
import type * as activities from '../activities';

const { bakePizza } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 minutes',
});

export const deliverOrder = defineSignal<[string]>('deliverOrder');

/**
 * The 1.0 version of the workflow we'll be making changes to
 */
export async function versioningExample(): Promise<string> {
  log.info('Pizza order not versioned started!', {});
  let shouldFinish = false;
  await bakePizza();
  setHandler(deliverOrder, async () => {
      shouldFinish = true;
  });
  await condition(() => shouldFinish);
  return 'Concluded workflow unversioned';
}
