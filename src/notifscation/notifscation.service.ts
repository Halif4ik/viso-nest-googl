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
            // Check if the condition for sending emails is met
            if (
                afterUpdateRowCount - beforeUpdateRowCount > 0 &&
                afterUpdateRowCount % 10 === 0
            ) {
                console.log('Sending email notifications to users...');

                // Create email messages for all customers
                const emails = cusmomersWithEmail.map((customer) => ({
                    to: customer.email,
                    from: 'no-reply@viso-nest-googl.onrender.com',
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

                // Send emails in bulk
                await sgMail.send(emails);
                console.log('Email notifications sent successfully.');
            }
        } catch (error) {
            console.error('Error sending email notifications:', error);
            throw new Error('Failed to send email notifications.');
        }
    }


}
