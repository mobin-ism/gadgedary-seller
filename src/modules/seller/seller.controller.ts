import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateSellerDto } from './dto/create-seller.dto'
import { UpdateSellerDto } from './dto/update-seller.dto'
import { SellerService } from './seller.service'

@ApiTags('Seller Management API')
@Controller('seller')
export class SellerController {
    constructor(private readonly sellerService: SellerService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new seller' })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    @ApiResponse({
        description: 'Seller created successfully',
        status: HttpStatus.CREATED
    })
    async create(@Body() createSellerDto: CreateSellerDto) {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Seller created successfully',
            result: await this.sellerService.create(createSellerDto)
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all sellers' })
    @ApiResponse({ description: 'Sellers found', status: HttpStatus.OK })
    async findAll() {
        return {
            statusCode: HttpStatus.OK,
            message: 'List of sellers',
            result: await this.sellerService.findAll()
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a seller' })
    @ApiResponse({ description: 'Seller found', status: HttpStatus.OK })
    @ApiResponse({
        description: 'Seller not found',
        status: HttpStatus.NOT_FOUND
    })
    async findOne(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Seller details',
            result: await this.sellerService.findOne(id)
        }
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a seller' })
    @ApiResponse({
        description: 'Seller updated successfully',
        status: HttpStatus.OK
    })
    @ApiResponse({
        description: 'Seller not found',
        status: HttpStatus.NOT_FOUND
    })
    @ApiResponse({ description: 'Bad Request', status: HttpStatus.BAD_REQUEST })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.INTERNAL_SERVER_ERROR
    })
    async update(
        @Param('id') id: string,
        @Body() updateSellerDto: UpdateSellerDto
    ) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Seller updated successfully',
            result: await this.sellerService.update(id, updateSellerDto)
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a seller' })
    @ApiResponse({ description: 'Seller deleted', status: HttpStatus.OK })
    @ApiResponse({
        description: 'Seller not found',
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
            message: 'Seller deleted successfully',
            result: await this.sellerService.remove(id)
        }
    }
}
