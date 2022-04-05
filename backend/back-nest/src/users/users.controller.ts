import { Body, Controller, Get, Post, UploadedFile, UseInterceptors, Query, Res, Request,  } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model'
import { CreateUserDto } from './dto/create-user.dto';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; 
import { v4 as uuid} from 'uuid'; 
import path = require('path'); 
import { join } from 'path'; 
import { fileURLToPath } from 'url'; 

export const storage = {
    storage: diskStorage({
        destination: './profil-picture', 
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuid(); 
            const extension: string = path.parse(file.originalname).ext; 

            cb(null, '${filename}${extension}')

        }
    })
}



@Controller('users')
export class UsersController { 
    constructor(private usersService: UsersService) {
    }

    @Get()
    getAllTask(): User []{
        return this.usersService.getAllUsers(); 
    } 

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) : User {
            return this.usersService.createUser(createUserDto); 
        }

    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './profil-picture', 
            filename: (req, file, cb) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuid(); 
                const extension: string = path.parse(file.originalname).ext; 
    
                cb(null, `${filename}${extension}`)
    
            }
        })
    })) 
    uploadFile(@UploadedFile() file): Observable<Object> { 
        console.log(file); 
        return of({imagePath: file.path})

    }

    
}
