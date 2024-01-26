// email.service.ts
import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root',
})
export class CorreoService {
  private serviceId = 'service_n14rpvm'; 
  private templateId = 'template_9nsaan9'; 
  private userId = 'uwD71Vf1QeaR_6-WW'; 

  constructor() {
    emailjs.init(this.userId);
  }

  enviarCorreo(para: string, asunto: string, cuerpo: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_email: 'alanescobar.p@gmail.com',
      subject: asunto,
      body: cuerpo,
    };

    return emailjs.send(this.serviceId, this.templateId, templateParams, this.userId);
  }
}
