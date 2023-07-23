import { SetMetadata } from "@nestjs/common";

// injectable 대용

export const TYPEORM_EX_CUSTOM_REPOSITORY = "TYPEORM_EX_CUSTOM_REPOSITORY"; 

export function CustomRepository(entity: Function): ClassDecorator { // CustomRepository 데코레이터 생성
    return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity); 
}