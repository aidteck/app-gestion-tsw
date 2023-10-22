import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ManagerModule } from './manager/manager.module';
import { ProduitModule } from './produit/produit.module';
import { SalaireModule } from './salaire/salaire.module';
import { AgenceModule } from './angence/agence.module';
import { PaysModule } from './pays/pays.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configs from 'src/config/index';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { ExpensesModule } from './expenses/expenses.module';
import { StockModule } from './stock/stock.module';
import { AssignmentModule } from './assignment/assignment.module';
import { TauxModule } from './taux/taux.module';
import { AffectationModule } from './affectation/affectation.module';
import { CotisationModule } from './cotisation/cotisation.module';
import { SalaireManagerModule } from './salaire_manager/salaire_manager.module';
import { StockagenceModule } from './stockagence/stockagence.module';
import { WeekendyModule } from './weekendy/weekendy.module';
import { MouvementstockModule } from './mouvementstock/mouvementstock.module';
import { ZoneModule } from './zone/zone.module';
import { SectionModule } from './section/section.module';
import { EmployerModule } from './employer/employer.module';
import { CongeModule } from './conge/conge.module';
import { StockPaysModule } from './stock-pays/stock-pays.module';
import { MvtStockModule } from './mvt-stock/mvt-stock.module';
import { RoleModule } from './role/role.module';
import { TauxzoneModule } from './tauxzone/tauxzone.module';
import { SuperviseurzoneModule } from './superviseurzone/superviseurzone.module';
import { ChefsectionModule } from './chefsection/chefsection.module';
import { CaisseModule } from './caisse/caisse.module';
import { EntrepotModule } from './entrepot/entrepot.module';
import { PayscaModule } from './paysca/paysca.module';
import { MoisanneeModule } from './moisannee/moisannee.module';
import { PatientModule } from './patient/patient.module';
import { DelecountryModule } from './delecountry/delecountry.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
    }),
     MongooseModule.forRoot(
       // `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_CLUSTER}.ftyqrzd.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`,
       `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}.railway.app:6692/${process.env.MONGODB_DATABASE}?authSource=admin`,
     ),
    MongooseModule.forRootAsync({
      inject: [DatabaseService],
      imports: [DatabaseModule],
      useFactory: (databaseService: DatabaseService) => databaseService.createMongooseOptions(),
    }),
    UserModule,
    ManagerModule, 
    ProduitModule, 
    WeekendyModule, 
    SalaireModule, 
    AgenceModule, 
    PaysModule, 
    AuthModule, ExpensesModule, StockModule, AssignmentModule, TauxModule, AffectationModule, CotisationModule, SalaireManagerModule, StockagenceModule, MouvementstockModule, ZoneModule, SectionModule, EmployerModule, CongeModule, StockPaysModule, MvtStockModule, RoleModule, TauxzoneModule, SuperviseurzoneModule, ChefsectionModule, CaisseModule, EntrepotModule, PayscaModule, MoisanneeModule, PatientModule, DelecountryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
