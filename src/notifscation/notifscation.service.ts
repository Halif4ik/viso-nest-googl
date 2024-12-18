import { Injectable } from '@nestjs/common';
import {Customer} from "@prisma/client";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class NotifscationService {

  constructor(private readonly configService: ConfigService) {
    // Set SendGrid API key from environment variables
    const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (sendGridApiKey) {
      sgMail.setApiKey(sendGridApiKey);
    } else {
      throw new Error('SENDGRID_API_KEY is not defined in environment variables.');
    }
  }

  async createEmailNotific(
      afterUpdateRowCount: number,
      beforeUpdateRowCount: number,
      withEmailCustomers: Customer[],
  ): Promise<void> {
    try {
      // Check if the condition for sending emails is met
      if (
          afterUpdateRowCount - beforeUpdateRowCount > 0 &&
          afterUpdateRowCount % 10 === 0
      ) {
        console.log('Sending email notifications to users...');

        // Create email messages for all customers
        const emails = withEmailCustomers.map((customer) => ({
          to: customer.email,
          from: 'no-reply@yourdomain.com', // Update with your verified sender email
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
