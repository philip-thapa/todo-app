export class Urls {
    static TODO_API_PREFIX = '/api'

    static SEND_OTP = Urls.TODO_API_PREFIX + '/user/generate-otp';
    static VERIFY_OTP = Urls.TODO_API_PREFIX + '/user/verify-otp';
    static LOGIN = Urls.TODO_API_PREFIX + '/user/signin';
    static SIGN_UP = Urls.TODO_API_PREFIX + '/user/sign-up';
    static SIGN_OUT = Urls.TODO_API_PREFIX + '/user/sign-out';
    static GET_USER_DETAILS = Urls.TODO_API_PREFIX + '/user/get-user-details';

    static GET_ALL_TODOS = Urls.TODO_API_PREFIX + '/todo/get-all-todos';
    static ADD_TODO = Urls.TODO_API_PREFIX + '/todo/add-todo';
    static MARK_TODO = Urls.TODO_API_PREFIX + '/todo/mark-todo';
    static UPDATE_TODO = Urls.TODO_API_PREFIX + '/todo/update-todo';
    static DELETE_TODO = Urls.TODO_API_PREFIX + '/todo/delete-todo';
}