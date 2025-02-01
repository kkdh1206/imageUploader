import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as firebase from 'firebase-admin';
import * as serviceAccount from 'supomarket-a3483-firebase-adminsdk-p4zki-c20dcb6dd8.json';
// import * as serviceAccount from '../loginlogout-a2fce-firebase-adminsdk-jzdcb-d17ecdae08.json';
import * as config from 'config';


const firebaseParams = { // json(파이어베이스 Admin SDK json 파일) 을 읽기위해 미리 적어둠
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientX509CertUrl: serviceAccount.client_x509_cert_url,
};

async function bootstrap() { // 파이어베이스를 쓰겠다고 알려주는것
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');
  const port = 3000//serverConfig.port 
  firebase.initializeApp({
    credential: firebase.credential.cert(firebaseParams)
  })

  await app.listen(port);
}
bootstrap();
