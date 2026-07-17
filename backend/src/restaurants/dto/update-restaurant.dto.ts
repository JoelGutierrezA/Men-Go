import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  RestaurantBranchDto,
  RestaurantBusinessType,
} from './create-restaurant.dto';

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsEnum(RestaurantBusinessType)
  businessType?: RestaurantBusinessType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  branchCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  headquartersAddress?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(19)
  @ValidateNested({ each: true })
  @Type(() => RestaurantBranchDto)
  branches?: RestaurantBranchDto[];
}
