import {Controller,Post,Body,UseInterceptors,UploadedFile,Res,HttpStatus} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {Response} from 'express';
import {Workbook} from 'exceljs'

import {BaseResponseDto} from '../common/BseResponse.dto';
import {ResultUtilsDto} from '../common/ResultUtils.dto';