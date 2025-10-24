import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { LoginGoogleDto } from './auth.dto';
import BaseResponse, { ResponseSuccess } from 'src/utils/response';
import { JwtService } from '@nestjs/jwt';

interface jwtPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  
}

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService, // panggil kelas jwt service
  ) {
    super();
  }

  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  } //membuat method untuk generate jwt

  async myProfile(id: number): Promise<ResponseSuccess> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    return this._success('OK', user);
  }

  async loginGoogle(payload: LoginGoogleDto): Promise<ResponseSuccess> {
    let checkUserExists;
    checkUserExists = await this.userRepository.findOne({
      where: {
        email: payload.email,
      },
    });

    if (!checkUserExists) {
      checkUserExists = await this.userRepository.save(payload);
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      name: checkUserExists.name,
      email: checkUserExists.email,
      role: checkUserExists.role,
     
    };

    const jwt_access = process.env.JWT_ACCESS_TOKEN as string;
    const jwt_refresh = process.env.JWT_REFRESh_TOKEN as string;

    const access_token = this.generateJWT(jwtPayload, '1d', jwt_access);
    const refresh_token = this.generateJWT(jwtPayload, '7d', jwt_refresh);

    await this.userRepository.save({
      refresh_token: refresh_token,
      id: checkUserExists.id,
      foto_profile: payload.foto_profile,
    }); // simpan refresh token ke dalam tabel

    return this._success('Berhasil', {
      ...checkUserExists,
      refresh_token,
      access_token,
    });
  }
}
