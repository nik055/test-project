import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Avatar {
  @ApiProperty({ type: String })
  path: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  personId: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date;

  @ApiProperty({ type: Boolean })
  isDeleted: boolean;
}
