import {Injectable} from '@nestjs/common';
import {Customer} from "@prisma/client";
import {ConfigService} from "@nestjs/config";
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class NotifscationService {

   constructor(private readonly configService: ConfigService) {
      const sendGridApiKey: string = this.configService.get<string>('SENDGRID_API_KEY');
      sgMail.setApiKey(sendGridApiKey);
   }

   async createEmailNotific(afterUpdateRowCount: number, beforeUpdateRowCount: number, cusmomersWithEmail: Customer[]): Promise<void> {
      try {
         if (
             afterUpdateRowCount - beforeUpdateRowCount > 0 &&
             afterUpdateRowCount % 10 === 0
         ) {
            // Create email messages for all customers
            const emails = cusmomersWithEmail.map((customer) => ({
               to: customer.email,
               from: this.configService.get<string>('VERIFIED_EMAIL'),
               subject: 'File Update Notification',
               text: `A new update has been made to the file! The file now has ${afterUpdateRowCount} rows.`,
               html: `
            <p>Hello ${customer.email},</p>
            <p>A new update has been made to the file!</p>
            <p>The file now has <strong>${afterUpdateRowCount}</strong> rows.</p>
            <p>Thank you,</p>
            <p>Your Team</p>
          `,
            }));
            await sgMail.send(emails);
            console.log(`Emails notifications sent successfully to ${emails}emails.`);
         }
      } catch (error) {
         console.error('Error sending email notifications:', error);
         throw new Error('Failed to send email notifications.');
      }
   }


}
