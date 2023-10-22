import { Module } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';
import { Zone, ZoneSchema } from './schemas/zone.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { PaysModule } from 'src/pays/pays.module';
import { Zoneca, ZonecaSchema } from './schemas/zoneca.schema';
import { Primesz, PrimeszSchema } from './schemas/primesz.schema';

@Module({
  imports: [
    PaysModule,   
    HttpModule,
    MongooseModule.forFeature(
      [
        { 
          name: Zone.name, 
          schema: ZoneSchema 
        },
        { 
          name: Zoneca.name, 
          schema: ZonecaSchema 
        },
        { 
          name: Primesz.name, 
          schema: PrimeszSchema 
        }
      ]
      )
  ],
  controllers: [ZoneController],
  providers: [ZoneService],
  exports: [ZoneService]

})
export class ZoneModule {}
