import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { userAuthGuard } from 'src/shared/auth.guard';

@Controller('api/upload')
export class FileController {

  @Get(':fileName')
  async getUploadedFile(@Param('fileName') file: Express.Multer.File, @Res() res: any) {
    return await res.sendFile(file, { root: './upload' });
  }
 
  @Post()
  @UseGuards(userAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload',
      filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), null);
          return null;
        }
        cb(null, file.originalname)
      }
    }),
    limits: { fileSize: 1 * 1024 * 1024}
  }))
  async uploadedFile(@UploadedFile() file: Express.Multer.File, @Res() res: any) {
    return await res.send(file)
  }
   
  @Delete(':fileName')
  @UseGuards(userAuthGuard)
  deleteUploadedFile(@Param('fileName') file: Express.Multer.File, @Res() res: any) {
    try {
      unlinkSync('./upload/' + file);
      res.status(200);
      return res.send('successfully deleted file');
    } catch (error) {
      res.status(400);
      return res.send(`File: ${file} not found in path: './upload/${file}'`);
    }
  }
}
