from utils.date_time import DateTime


class TodoException(Exception):
    pass


class Constants:
    my_day = 'My Day'
    Important = 'Important'
    Planned = 'Planned'
    Tasks = 'Tasks'
    FILTERS = {
        my_day: 'My Day',
        Important: 'Important',
        Planned: 'Planned',
        Tasks: 'Tasks'
    }

    ALL_TYPES = [my_day, Important, Planned, Tasks]

    IMPORTANT = 'IMPORTANT'
    NOT_IMPORTANT = 'NOT_IMPORTANT'
    COMPLETED = 'COMPLETED'
    NOT_COMPLETED = 'NOT_COMPLETED'
