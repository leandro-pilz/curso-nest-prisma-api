import { Injectable } from "@nestjs/common/decorators";
import { PrismaService } from "src/prisma/prisma.service";
import { PostEntity } from "../entities/post.entity";
import { CreatePostDto } from "../dto/create-post.dto";
import { UpdatePostDto } from "../dto/update-post.dto";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "src/common/erros/types/NotFoundError";

@Injectable()
export class PostsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(createPostDto: CreatePostDto): Promise<PostEntity> {
        const { authorEmail } = createPostDto;

        delete createPostDto.authorEmail; //Remove o atributo authorEmail do createPostDto.

        const user = await this.prisma.user.findUnique({
            where: {
                email: authorEmail
            }
        });

        if (!user) {
            throw new NotFoundError('Author not found.')
        }

        const data: Prisma.PostCreateInput = {
            ...createPostDto,
            author: {
                connect: {
                    email: authorEmail,
                }
            }
        };

        return this.prisma.post.create({
            data
        });
    }

    async findAll(): Promise<PostEntity[]> {
        return this.prisma.post.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }

    async findOne(id: number): Promise<PostEntity> {
        return this.prisma.post.findUnique({
            where: {
                id,
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
        const { authorEmail } = updatePostDto;

        if (!authorEmail) {
            return this.prisma.post.update({
                data: updatePostDto,
                where: {
                    id,
                },
                include: {
                    author: {
                        select: {
                            name: true,
                        }
                    }
                }
            });
        }

        delete updatePostDto.authorEmail; //Remove o atributo authorEmail do createPostDto.

        const user = await this.prisma.user.findUnique({
            where: {
                email: authorEmail
            },
        });

        if (!user) {
            throw new NotFoundError('Author not found.')
        }

        const data: Prisma.PostUpdateInput = {
            ...updatePostDto,
            author: {
                connect: {
                    email: authorEmail,
                }
            }
        };

        return this.prisma.post.update({
            where: {
                id,
            },
            data,
            include: {
                author: {
                    select: {
                        name: true,
                    }
                }
            }
        });
    }

    async remove(id: number): Promise<PostEntity> {
        return this.prisma.post.delete({
            where: {
                id,
            },
        });
    }
}