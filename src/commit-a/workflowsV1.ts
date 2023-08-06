import { condition, defineSignal, proxyActivities, setHandler, log } from '@temporalio/workflow';
import type * as activities from '../activities';

const { preparePizza } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export const deliverOrder = defineSignal<[string]>('deliverOrder');

/**
 * The 1.0 version of the workflow we'll be making changes to
 */
export async function versioningExample(): Promise<string> {
  log.info('Pizza order V1 started!', {});
  let shouldFinish = false;
  await preparePizza('from V1 worker!');
  setHandler(deliverOrder, async () => {
      shouldFinish = true;
  });
  await condition(() => shouldFinish);
  return 'Concluded workflow on v1';
}
