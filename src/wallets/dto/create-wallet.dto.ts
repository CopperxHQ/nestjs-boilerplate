import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWalletDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  customerRefId?: string;
}
