import { Controller, Get, Post, Body, Query, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { DictService } from '../services/DictService';
import {CreateDicDto,UpdateDicDto,QueryDictDto,DeleteDicDto} from '../models/dto/DictDto';
import { AuthGuard } from '../annotations/AuthGuard';
import { User } from '../models/entity/User';
import { UserEntity } from '../models/entity/UserEntity';
import { PageRequestDto } from '../common/PageRequest.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
