import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateSellerDto } from './dto/create-seller.dto'
import { UpdateSellerDto } from './dto/update-seller.dto'
import { Seller } from './entities/seller.entity'

@Injectable()
export class SellerService {
    constructor(
        @InjectRepository(Seller)
        private sellerRepository: Repository<Seller>
    ) {}

    async create(createSellerDto: CreateSellerDto) {
        try {
            const seller = this.sellerRepository.create(createSellerDto)
            return await this.sellerRepository.save(seller)
        } catch (error) {
            throw new HttpException(
                'Unable to create a seller account',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async findAll() {
        return await this.sellerRepository.find()
    }

    async findOne(id: string) {
        const seller = await this.sellerRepository.findOne({
            where: {
                id
            }
        })
        if (seller) {
            return seller
        }
        throw new HttpException('Seller not found', HttpStatus.NOT_FOUND)
    }

    async update(id: string, updateSellerDto: UpdateSellerDto) {
        const seller = await this.findOne(id)
        if (seller) {
            await this.sellerRepository.update(id, updateSellerDto)
            return await this.findOne(id)
        }
        return null
    }

    async remove(id: string) {
        const seller = await this.findOne(id)
        if (seller) {
            await this.sellerRepository.softDelete(id)
            return seller
        }
        return null
    }
}
