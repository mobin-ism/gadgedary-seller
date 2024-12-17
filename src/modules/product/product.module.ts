import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryModule } from '../category/category.module'
import { Product } from './entities/product.entity'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
    imports: [TypeOrmModule.forFeature([Product]), CategoryModule],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService]
})
export class ProductModule {}
