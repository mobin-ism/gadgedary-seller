import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
    IPaginationOptions,
    paginate,
    Pagination
} from 'nestjs-typeorm-paginate'
import { EntityManager, FindOptionsOrder, Repository } from 'typeorm'
import { ProductService } from '../product/product.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderedProductDto } from './dto/ordered-product.dto'
import { UpdatePaymentStatusDto } from './dto/upate-payment-status.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Order } from './entities/order.entity'

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly productService: ProductService
    ) {}

    /**
     * Create a new order
     * @param createOrderDto
     * @returns
     */
    async create(createOrderDto: CreateOrderDto) {
        return this.orderRepository.manager.transaction(
            async (transactionalEntityManager) => {
                // Extract product stock update logic to a separate method
                const { totalPrice, processedProducts } =
                    await this.processOrderedProducts(
                        transactionalEntityManager,
                        createOrderDto.orderedProducts
                    )

                // Create order
                const orderData = {
                    ...createOrderDto,
                    totalPrice,
                    orderedProducts: processedProducts
                }

                const newOrder = transactionalEntityManager.create(
                    Order,
                    orderData
                )
                return transactionalEntityManager.save(newOrder)
            }
        )
    }

    /**
     * Processing ordered products
     * @param transactionalEntityManager
     * @param orderedProducts
     * @returns
     */
    private async processOrderedProducts(
        transactionalEntityManager: EntityManager,
        orderedProducts: OrderedProductDto[]
    ) {
        let totalPrice = 0
        const processedProducts = []

        for (const orderedProduct of orderedProducts) {
            // Use ProductService method instead of direct repository access
            const product =
                await this.productService.findOneWithPessimisticLock(
                    orderedProduct.productId,
                    transactionalEntityManager
                )

            if (product.quantity < orderedProduct.quantity) {
                throw new HttpException(
                    `Product ${product.name} is out of stock`,
                    HttpStatus.BAD_REQUEST
                )
            }

            // Update product stock
            await this.productService.updateStock(
                product.id,
                -orderedProduct.quantity,
                transactionalEntityManager
            )

            // Calculate total price
            totalPrice += product.price * orderedProduct.quantity

            processedProducts.push({
                productId: product.id,
                quantity: orderedProduct.quantity
            })
        }

        return { totalPrice, processedProducts }
    }

    /**
     * Return all orders
     * @returns
     */
    async findAll() {
        return await this.orderRepository.find({
            relations: {
                orderedProducts: {
                    product: {
                        category: true
                    }
                }
            }
        })
    }

    /**
     * Return an order
     * @param id
     * @returns
     */
    async findOne(id: string) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: {
                orderedProducts: {
                    product: {
                        category: true
                    }
                }
            }
        })

        if (!order) {
            throw new HttpException(
                `Order with ID ${id} does not exist`,
                HttpStatus.NOT_FOUND
            )
        }

        return order
    }

    /**
     * Update an order
     * @param id
     * @param updateOrderDto
     * @returns
     */
    async update(id: string, updateOrderDto: UpdateOrderDto) {
        const order = await this.findOne(id)
        order.status = updateOrderDto.status
        try {
            return await this.orderRepository.save(order)
        } catch (error) {
            throw new HttpException(
                'Unable to update the order status',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    /**
     * Delete an order
     * @param id
     * @returns
     */
    async remove(id: string) {
        const order = await this.findOne(id)
        try {
            await this.orderRepository.softDelete(id)
            return order
        } catch (error) {
            throw new HttpException(
                'Unable to delete the order',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    /**
     * Paginated orders ordering
     * @param options
     * @param orderBy
     * @param desc
     * @returns
     */
    async paginate(
        options: IPaginationOptions,
        orderBy: string,
        desc: boolean
    ): Promise<Pagination<Order>> {
        const orderByQueries = ['createdAt']
        if (orderByQueries.indexOf(orderBy) === -1) {
            orderBy = 'createdAt'
        }

        const orderByCondition: FindOptionsOrder<Order> = {
            [orderBy]: desc ? 'DESC' : 'ASC'
        }

        return paginate<Order>(this.orderRepository, options, {
            order: orderByCondition,
            relations: {
                orderedProducts: {
                    product: {
                        category: true
                    }
                }
            }
        })
    }

    /**
     * implement a method to update the payment status of an order
     */
    async updatePaymentStatus(
        id: string,
        updatePaymentStatusDto: UpdatePaymentStatusDto
    ) {
        const order = await this.findOne(id)
        order.paymentStatus = updatePaymentStatusDto.paymentStatus
        try {
            return await this.orderRepository.save(order)
        } catch (error) {
            throw new HttpException(
                'Unable to update the payment status',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
