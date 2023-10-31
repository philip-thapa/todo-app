from datetime import datetime, timedelta


class DateTime:

    @staticmethod
    def get_current_date():
        return datetime.today().date()

    @staticmethod
    def get_yesterdays_date():
        return datetime.today() - timedelta(days=1)

    @staticmethod
    def get_tomorrows_date():
        return datetime.today() + timedelta(days=1)

    @staticmethod
    def parse_sql_date(date):
        try:
            return datetime.strptime(date, "%Y-%m-%d" if '-' in date else '%m/%d/%Y').date()
        except Exception as e:
            raise Exception('Invalid date format')
