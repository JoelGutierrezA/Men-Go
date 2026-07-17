import { RestaurantBusinessType } from '../dto/create-restaurant.dto';

export interface RestaurantBranch {
  id: string;
  label: string;
  address: string;
  isHeadquarters: boolean;
}

export interface RestaurantRecord {
  id: string;
  name: string;
  businessType: RestaurantBusinessType;
  description: string;
  logoUrl: string | null;
  branchCount: number;
  headquartersAddress: string;
  branches: RestaurantBranch[];
  createdAt: string;
  updatedAt: string;
}
