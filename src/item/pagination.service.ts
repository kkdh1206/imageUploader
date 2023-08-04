// import { Injectable } from '@nestjs/common';
// import { ItemsService } from './item.service';
// import { Item } from './item.entity';

// @Injectable()
// export class ItemPaginationService {
//   constructor(private readonly productService: ItemsService) {}

//   async getPaginatedProducts(page: number, pageSize: number, items: Item[]): Promise<Item[]> { 
//     const startIndex = (page - 1) * pageSize;
//     const endIndex = startIndex + pageSize;
//     return items.slice(startIndex, endIndex);
//   }
// }