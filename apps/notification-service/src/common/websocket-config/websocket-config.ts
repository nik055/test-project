import { WebsocketConfigService } from "./websocket-config.service";
import { WebsocketConfigModule } from "./websocket-config.module";

export const getWebsocketConfig = () => {
  return {
    useFactory: (websocketConfigService: WebsocketConfigService) => ({
      port: websocketConfigService.webSocketPort,
      namespace: websocketConfigService.webSocketNamespace,
      cors: {
        origin: "*",
      },
    }),
    inject: [WebsocketConfigService],
    import: [WebsocketConfigModule],
  };
};

// @Injectable()
// export class WebsocketConfig {
//   constructor(private readonly websocketConfigService: WebsocketConfigService) {}
//
//   get() {
//     return {
//       port: this.websocketConfigService.webSocketPort,
//       namespace: this.websocketConfigService.webSocketNamespace,
//       cors: {
//         origin: "*",
//       },
//     };
//   }
// }
