import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './entities/category.entity'

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {}

    /**
     * Create a new category
     * @param createCategoryDto
     * @returns
     */
    async create(createCategoryDto: CreateCategoryDto) {
        try {
            const aboutToCreateCategory =
                this.categoryRepository.create(createCategoryDto)
            return await this.categoryRepository.save(aboutToCreateCategory)
        } catch (error) {
            throw new HttpException(
                'An error occurred while creating a category',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    /**
     * Return all category
     * @returns
     */
    async findAll() {
        return await this.categoryRepository.find()
    }

    /**
     * Return a category
     * @param id
     * @returns
     */
    async findOne(id: string) {
        const category = await this.categoryRepository.findOne({
            where: { id }
        })
        if (!category) {
            throw new HttpException(
                `Category with ID ${id} does not exist`,
                HttpStatus.NOT_FOUND
            )
        }
        return category
    }

    /**
     * Update a category
     * @param id
     * @param updateCategoryDto
     * @returns
     */
    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        // Check if the category exists
        await this.categoryRepository.findOne({
            where: { id }
        })

        try {
            await this.categoryRepository.update(id, updateCategoryDto)
            return await this.categoryRepository.findOne({ where: { id } })
        } catch (error) {
            throw new HttpException(
                'Unable to update category. Please try again later.',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    /**
     * Delete a category
     * @param id
     * @returns
     */
    async remove(id: string) {
        // Check if the category exists
        const category = await this.categoryRepository.findOne({
            where: { id }
        })

        try {
            await this.categoryRepository.softDelete(id)
            return category
        } catch (error) {
            throw new HttpException(
                'Unable to delete category. Please try again later.',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
