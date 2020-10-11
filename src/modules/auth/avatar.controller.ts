import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly configService: ConfigService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':imagepath')
  async getAvatar(@Param('imagepath') image, @Res() res) {
    return res.sendFile(image, { root: this.configService.get('MULTER_DEST') });
  }
}
