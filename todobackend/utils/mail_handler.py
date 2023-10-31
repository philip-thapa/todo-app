from django.core.mail import send_mail

from todobackend.settings import DEFAULT_FROM_EMAIL


class MailHandler:

    @staticmethod
    def custom_send_mail(mail_subject, message, send_to):
        try:
            send_mail(mail_subject, message, DEFAULT_FROM_EMAIL, [send_to])
        except Exception as e:
            print(e)
            raise Exception('Mail send fail')
