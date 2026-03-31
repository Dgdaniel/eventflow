import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly emailService: EmailService) {}
  async sendTicketPurchasedEmail(data: {
    userId: string;
    email: string;
    name: string;
    ticketCode: string;
    eventTitle: string;
    quantity: string;
    totalPrice: number;
  }) {
    const { email, name, ticketCode, eventTitle, quantity, totalPrice } = data;

    const formattedPrice = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(totalPrice);

    const html = `
  <div style="font-family: Arial, sans-serif; background-color:#f6f6f6; padding:20px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;">
      
      <div style="background:#4CAF50;color:#fff;padding:16px;text-align:center;">
        <h2 style="margin:0;">🎉 Ticket confirmé</h2>
      </div>

      <div style="padding:20px;color:#333;">
        <p>Bonjour <strong>${name}</strong>,</p>

        <p>Votre achat de ticket a été confirmé avec succès.</p>

        <div style="margin:20px 0;padding:15px;border:1px solid #eee;border-radius:6px;">
          <p><strong>🎫 Code du ticket :</strong> ${ticketCode}</p>
          <p><strong>📅 Événement :</strong> ${eventTitle}</p>
          <p><strong>🔢 Quantité :</strong> ${quantity}</p>
          <p><strong>💰 Total payé :</strong> ${formattedPrice}</p>
        </div>

        <p>Veuillez présenter ce ticket lors de votre arrivée à l’événement.</p>

        <div style="text-align:center;margin:30px 0;">
          <a href="#" 
             style="background:#4CAF50;color:#fff;padding:12px 20px;
                    text-decoration:none;border-radius:5px;font-weight:bold;">
            Voir mon ticket
          </a>
        </div>

        <p style="font-size:12px;color:#888;">
          Si vous avez des questions, contactez notre support.
        </p>
      </div>

      <div style="background:#f0f0f0;padding:10px;text-align:center;font-size:12px;color:#666;">
        © ${new Date().getFullYear()} - Tous droits réservés
      </div>

    </div>
  </div>
  `;

    await this.emailService.sendEmail(
      email,
      `🎫 Confirmation de votre ticket - ${eventTitle}`,
      html,
    );
  }

  async sendTicketCancelledEmail(data: {
    ticketId: string;
    userId: string;
    email: string;
  }) {
    const { email, ticketId } = data;

    // 👉 Optionnel : récupérer plus d'infos depuis la DB
    // const ticket = await this.ticketService.findOne(ticketId, data.userId);

    const html = `
  <div style="font-family: Arial, sans-serif; background-color:#f6f6f6; padding:20px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;">
      
      <div style="background:#f44336;color:#fff;padding:20px;text-align:center;">
        <h2 style="margin:0;">❌ Ticket annulé</h2>
      </div>

      <div style="padding:20px;color:#333;">
        <p>Bonjour,</p>

        <p>
          Nous vous informons que votre ticket a été <strong>annulé</strong>.
        </p>

        <div style="margin:20px 0;padding:15px;border:1px solid #eee;border-radius:6px;">
          <p><strong>🎫 ID du ticket :</strong> ${ticketId}</p>
        </div>

        <p>
          Si cette annulation n’est pas de votre fait ou si vous avez des questions,
          veuillez contacter notre support.
        </p>

        <div style="text-align:center;margin:30px 0;">
          <a href="#"
             style="background:#f44336;color:#fff;padding:12px 20px;
                    text-decoration:none;border-radius:5px;font-weight:bold;">
            Contacter le support
          </a>
        </div>

        <p style="font-size:12px;color:#888;">
          Merci de votre compréhension.
        </p>
      </div>

      <div style="background:#f0f0f0;padding:10px;text-align:center;font-size:12px;color:#666;">
        © ${new Date().getFullYear()} - Tous droits réservés
      </div>

    </div>
  </div>
  `;

    await this.emailService.sendEmail(
      email,
      '❌ Annulation de votre ticket',
      html,
    );
  }
  async sendWelcomeEMail(data: {
    userId: string;
    email: string;
    name: string;
  }) {
    const { email, name } = data;

    const html = `
  <div style="font-family: Arial, sans-serif; background-color:#f6f6f6; padding:20px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;">
      
      <div style="background:#4CAF50;color:#fff;padding:20px;text-align:center;">
        <h2 style="margin:0;">👋 Bienvenue à bord !</h2>
      </div>

      <div style="padding:20px;color:#333;">
        <p>Bonjour <strong>${name}</strong>,</p>

        <p>
          Nous sommes ravis de vous accueillir sur notre plateforme 🎉  
          Votre compte a été créé avec succès.
        </p>

        <p>
          Vous pouvez dès maintenant explorer les événements, réserver vos tickets
          et profiter pleinement de nos services.
        </p>

        <div style="text-align:center;margin:30px 0;">
          <a href="#"
             style="background:#4CAF50;color:#fff;padding:12px 20px;
                    text-decoration:none;border-radius:5px;font-weight:bold;">
            Découvrir la plateforme
          </a>
        </div>

        <p>
          Si vous avez la moindre question, notre équipe reste disponible pour vous aider.
        </p>

        <p>À très bientôt 👋</p>
      </div>

      <div style="background:#f0f0f0;padding:10px;text-align:center;font-size:12px;color:#666;">
        © ${new Date().getFullYear()} - Tous droits réservés
      </div>

    </div>
  </div>
  `;

    await this.emailService.sendEmail(
      email,
      '👋 Bienvenue sur notre plateforme',
      html,
    );
  }
}
