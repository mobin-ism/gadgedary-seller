import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductService } from './product.service'

@ApiTags('Product Mangement API')
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'Product created successfully',
        status: HttpStatus.CREATED
    })
    async create(@Body() createProductDto: CreateProductDto) {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Product created successfully',
            result: await this.productService.create(createProductDto)
        }
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ description: 'Products found', status: HttpStatus.OK })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number'
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of items per page'
    })
    @ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Search by product name. Its a wildcard search'
    })
    @ApiQuery({
        name: 'category',
        required: false,
        type: String,
        description: 'Filter by category name.'
    })
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit') limit: number,
        @Query('search', new DefaultValuePipe('')) search = '',
        @Query('category', new DefaultValuePipe('')) category = '',
        @Query('orderBy', new DefaultValuePipe('createdAt'))
        orderBy = 'createdAt',
        @Query('desc', new DefaultValuePipe(true), ParseBoolPipe)
        desc = true
    ) {
        limit = limit
            ? limit > parseInt(process.env.DEFAULT_PAGE_SIZE)
                ? parseInt(process.env.DEFAULT_PAGE_SIZE)
                : limit
            : parseInt(process.env.DEFAULT_PAGE_SIZE)

        const result = await this.productService.paginate(
            {
                page,
                limit,
                route: process.env.APP_URL + '/api/v1/product'
            },
            search,
            category,
            orderBy,
            desc
        )

        return {
            statusCode: HttpStatus.OK,
            message: 'Data found',
            result: result.items,
            meta: result.meta,
            links: result.links
        }
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a product' })
    @ApiResponse({ description: 'Product found', status: HttpStatus.OK })
    @ApiResponse({
        description: 'Product not found',
        status: HttpStatus.NOT_FOUND
    })
    async findOne(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Product found',
            result: await this.productService.findOne(id)
        }
    }

    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a product' })
    @ApiResponse({
        description: 'Product updated successfully',
        status: HttpStatus.OK
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'Product updated successfully',
        status: HttpStatus.OK
    })
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto
    ) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Product updated successfully',
            result: await this.productService.update(id, updateProductDto)
        }
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a product' })
    @ApiResponse({
        description: 'Product deleted successfully',
        status: HttpStatus.OK
    })
    @ApiResponse({
        description: 'Product not found',
        status: HttpStatus.NOT_FOUND
    })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    async remove(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Product deleted successfully',
            result: await this.productService.remove(id)
        }
    }
}
