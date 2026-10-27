import type { OmrRequest, OmrResponse } from './worker';

export type { OmrResponse, OmrStats } from './worker';

export function recognizeImage(imageData: ImageData, debug = false): Promise<OmrResponse> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    const finish = (response: OmrResponse) => {
      worker.terminate();
      resolve(response);
    };
    worker.onmessage = (event: MessageEvent<OmrResponse>) => finish(event.data);
    worker.onerror = () => finish({ ok: false, error: '识别线程异常，请重试' });
    const copy = new Uint8ClampedArray(imageData.data);
    const request: OmrRequest = {
      width: imageData.width,
      height: imageData.height,
      data: copy,
      debug,
    };
    worker.postMessage(request, [copy.buffer]);
  });
}
