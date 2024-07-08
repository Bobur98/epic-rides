import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
	CRUISER = 'CRUISER',
	SPORTBIKE = 'SPORTBIKE',
	NAKED = 'NAKED',
	TOURING = 'TOURING',
	ADVENTURE = 'ADVENTURE',
	DUAL_SPORT = 'DUAL_SPORT',
	MOTOCROSS = 'MOTOCROSS',
	SUPERMOTO = 'SUPERMOTO',
	RETRO = 'RETRO',
	SPORT_TOURING = 'SPORT_TOURING',
	SCRAMBLER = 'SCRAMBLER',
}
registerEnumType(ProductType, {
	name: 'ProductType',
});

export enum ProductStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(ProductStatus, {
	name: 'ProductStatus',
});

export enum ProductCondition {
	NEW = 'NEW',
	USED = 'USED',
}

registerEnumType(ProductCondition, {
	name: 'ProductCondition',
});

export enum ProductLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
}
registerEnumType(ProductLocation, {
	name: 'ProductLocation',
});
