import Hls, {
  LoaderCallbacks,
  LoaderConfiguration,
  LoaderContext,
} from "hls.js";
import { md5 } from "js-md5";

export class VideoLoader extends Hls.DefaultConfig.loader {
  load(
    context: LoaderContext,
    config: LoaderConfiguration,
    callbacks: LoaderCallbacks<LoaderContext>
  ): void {
    if (context.url.includes("?id=")) {
      const url = new URL(context.url, location.origin); // 基准 URL 可随便写一个
      const id = url.searchParams.get("id");
      const array = md5.array(`fansplus.${id}-Nr3y`);
      const uint8 = new Uint8Array(array);
      callbacks.onSuccess(
        {
          url: context.url,
          data: uint8,
        },
        {} as any,
        context,
        null
      );
    } else {
      super.load(context, config, callbacks);
    }
  }
}

export function generateSign(auth: string) {
  const t = Date.now();
  const sign = md5(`${auth}FansPlus${t}`);
  return {
    auth,
    t,
    sign,
  };
}
