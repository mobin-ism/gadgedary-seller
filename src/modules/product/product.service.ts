import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
    IPaginationOptions,
    Pagination,
    paginate
} from 'nestjs-typeorm-paginate'
import { EntityManager, FindOptionsOrder, ILike, Repository } from 'typeorm'
import { CategoryService } from '../category/category.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'
@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly categoryService: CategoryService
    ) {}

    /**
     * Create a new product
     * @param createProductDto
     * @returns
     */
    async create(createProductDto: CreateProductDto) {
        // Check if category exists
        if (createProductDto.categoryId) {
            await this.categoryService.findOne(createProductDto.categoryId)
        }

        try {
            const aboutToCreateProduct =
                this.productRepository.create(createProductDto)
            return await this.productRepository.save(aboutToCreateProduct)
        } catch (error) {
            throw new HttpException(
                'An error occurred while creating a product',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    /**
     * Retrieve all products
     * @returns
     */
    async findAll() {
        return await this.productRepository.find({
            relations: {
                category: true
            }
        })
    }

    /**
     * Return a product
     * @param id
     * @returns
     */
    async findOne(id: string) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: {
                category: true
            }
        })

        if (!product) {
            throw new HttpException(
                `Product with ID ${id} does not exist`,
                HttpStatus.NOT_FOUND
            )
        }

        return product
    }

    /**
     * Find a product with pessimistic write lock
     * @param productId
     * @param transactionalEntityManager
     * @returns
     */
    async findOneWithPessimisticLock(
        productId: string,
        transactionalEntityManager?: EntityManager
    ) {
        const manager =
            transactionalEntityManager || this.productRepository.manager

        const product = manager.findOne(Product, {
            where: { id: productId },
            lock: { mode: 'pessimistic_write' }
        })

        if (!product) {
            throw new HttpException(
                `Product with ID ${productId} not found`,
                HttpStatus.NOT_FOUND
            )
        }

        return product
    }

    /**
     * Update a product
     * @param id
     * @param updateProductDto
     * @returns
     */
    async update(id: string, updateProductDto: UpdateProductDto) {
        // Check if the product exists
        await this.findOne(id)

        // Check if category exists
        if (updateProductDto.categoryId) {
            await this.categoryService.findOne(updateProductDto.categoryId)
        }

        try {
            await this.productRepository.update(id, updateProductDto)
            return await this.productRepository.findOne({
                where: { id },
                relations: {
                    category: true
                }
            })
        } catch (error) {
            throw new HttpException(
                'An error occurred while updating a product',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    /**
     * Soft delete a product
     * @param id
     * @returns
     */
    async remove(id: string) {
        const product = await this.findOne(id)

        if (!product) {
            throw new HttpException(
                `Product with ID ${id} does not exist`,
                HttpStatus.NOT_FOUND
            )
        }

        try {
            await this.productRepository.softDelete(id)
            return product
        } catch (error) {
            throw new HttpException(
                'An error occurred while deleting a product',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    /**
     * Paginated products with search and ordering
     * @param options
     * @param search
     * @param category
     * @param orderBy
     * @param desc
     * @returns
     */
    async paginate(
        options: IPaginationOptions,
        search: string,
        category: string,
        orderBy: string,
        desc: boolean
    ): Promise<Pagination<Product>> {
        const orderByQueries = ['name', 'createdAt']
        if (orderByQueries.indexOf(orderBy) === -1) {
            orderBy = 'createdAt'
        }

        const orderByCondition: FindOptionsOrder<Product> = {
            [orderBy]: desc ? 'DESC' : 'ASC'
        }

        let categoryCondition = {}
        if (category != '') {
            categoryCondition = {
                name: ILike(category.toLowerCase())
            }
        }
        return paginate<Product>(this.productRepository, options, {
            where: {
                name: ILike(`%${search.toLowerCase()}%`),
                category: categoryCondition
            },
            order: orderByCondition,
            relations: {
                category: true
            }
        })
    }

    /**
     * Update stock
     * @param productId
     * @param quantityChange
     * @param transactionalEntityManager
     * @returns
     */
    async updateStock(
        productId: string,
        quantityChange: number,
        transactionalEntityManager?: EntityManager
    ) {
        const manager =
            transactionalEntityManager || this.productRepository.manager

        // Find the product
        const product = await manager.findOne(Product, {
            where: { id: productId }
        })

        if (!product) {
            throw new HttpException(
                `Product with ID ${productId} not found`,
                HttpStatus.NOT_FOUND
            )
        }

        // Update stock
        product.quantity += quantityChange

        return manager.save(product)
    }
}
