import { S3Client } from "@aws-sdk/client-s3";
import { S3ConfigService } from "./s3.config.service";

export const getS3Factory = () => {
  return {
    useFactory: (s3ConfigService: S3ConfigService): S3Client => {
      return new S3Client({
        endpoint: s3ConfigService.getEndpoint,
        region: s3ConfigService.getRegion,
        credentials: {
          accessKeyId: s3ConfigService.getAccessKey,
          secretAccessKey: s3ConfigService.getSecretKey,
        },
        forcePathStyle: true,
      });
    },
    inject: [S3ConfigService],
  };
};
