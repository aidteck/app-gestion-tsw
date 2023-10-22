import { Injectable } from '@nestjs/common';
import { CreateMouvementstockDto } from './dto/create-mouvementstock.dto';
import { UpdateMouvementstockDto } from './dto/update-mouvementstock.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Mouvementstock, MouvementstockDocument } from './schemas/mouvementstock.schema';
import { HydratedDocument, Model, Schema as MongooseSchema } from "mongoose";
import { StockagenceService } from 'src/stockagence/stockagence.service';
import { SalaireService } from 'src/salaire/salaire.service';
import { CreateStockagenceDto } from 'src/stockagence/dto/create-stockagence.dto';
import { StockPaysService } from 'src/stock-pays/stock-pays.service';
import { CreateStockPaysDto } from 'src/stock-pays/dto/create-stock-pay.dto';
import { AgenceService } from 'src/angence/agence.service';
import { UpdateStockPaysDto } from 'src/stock-pays/dto/update-stock-pay.dto';
import { UpdateStockagenceDto } from 'src/stockagence/dto/update-stockagence.dto';

@Injectable()
export class MouvementstockService {

  constructor(@InjectModel(Mouvementstock.name) private readonly mvtstockModel: Model<MouvementstockDocument>,
  private stockpaysService: StockPaysService,
  private agenceStockService: StockagenceService,
  private agenceService: AgenceService
  ){}

  async create(createMouvementstockDto: CreateMouvementstockDto): Promise<{any}> {
    
    for(let i = 0; i<createMouvementstockDto.items.length; i++){
      const mvtstock = {
        bureauId: createMouvementstockDto.bureauId,
        date_sortie: createMouvementstockDto.date_sortie,
        productId: createMouvementstockDto.items[i].productId,
        quantity: createMouvementstockDto.items[i].quantity,
      };

      const createdStock = await this.mvtstockModel.create(mvtstock);
      if(createdStock){
        const bureau = await this.agenceService.findSingleAgengence(createMouvementstockDto.bureauId);
        const product = await this.agenceStockService.findagenceproduit(createMouvementstockDto.bureauId, createMouvementstockDto.items[i].productId);

        if(product == null){
          const createStockagenceDto: CreateStockagenceDto = {
            agenceId: createMouvementstockDto.bureauId,
            productId: createMouvementstockDto.items[i].productId,
            quantity: createMouvementstockDto.items[i].quantity,
            quantitytotalenmagasin: 0
          };
          const result = await this.agenceStockService.create(createStockagenceDto);
          if(result){
            const productpays = await this.stockpaysService.findpaysproduit(createMouvementstockDto.items[i].productId, bureau.countryId);

             const updateProduitDto: CreateStockPaysDto = {
              paysId: bureau.countryId,
              productId: createMouvementstockDto.items[i].productId,
              quantity: productpays.quantity - createMouvementstockDto.items[i].quantity
            };

            await this.stockpaysService.updatepaysStock(updateProduitDto.paysId, updateProduitDto.productId, updateProduitDto);

          }
        }else{
          
          const updateStockagenceDto: UpdateStockagenceDto = {
            agenceId: createMouvementstockDto.bureauId,
            productId: createMouvementstockDto.items[i].productId,
            quantity: createMouvementstockDto.items[i].quantity,
            quantitytotalenmagasin: product.quantity + createMouvementstockDto.items[i].quantity,
          };

          const result = await this.agenceStockService.updateagenceStock(updateStockagenceDto.agenceId, updateStockagenceDto.productId, updateStockagenceDto);

          if(result){
            const productpays = await this.stockpaysService.findpaysproduit(createMouvementstockDto.items[i].productId, bureau.countryId);

            // console.log('productpays', productpays);

             const updateProduitDto: UpdateStockPaysDto = {
              paysId: bureau.countryId,
              productId: createMouvementstockDto.items[i].productId,
              quantity: productpays.quantity - createMouvementstockDto.items[i].quantity
            };

            await this.stockpaysService.updatepaysStock(updateProduitDto.paysId, updateProduitDto.productId, updateProduitDto);

          }
    
        }  
      }
      
    }
    return;
  }

  async findOne(id: string){

  }

  async findAll() {
    const mvtstock = await this.mvtstockModel.find().populate('bureauId').populate('productId').exec();
    if(mvtstock){

    }
    return mvtstock;
  }

  async findOnebyBureau(id: string) {
    const bureaumvt = await this.mvtstockModel.find({bureauId: id}).exec();
    return bureaumvt;
  }

  async findOnebyBureauForDelete(id: string) {
    const bureaumvt = await this.mvtstockModel.find({bureauId: id}).exec();
    if(bureaumvt !=null){
      for(let i=0; i<bureaumvt.length; i++){
        this.mvtstockModel.findByIdAndRemove(bureaumvt[i]._id);
      }
    }
    return "deleted";
  }

  update(id: number, updateMouvementstockDto: UpdateMouvementstockDto) {
    return `This action updates a #${id} mouvementstock`;
  }

  remove(id: number) {
    return `This action removes a #${id} mouvementstock`;
  }
}
