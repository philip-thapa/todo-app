export class Urls {
    static TODO_API_PREFIX = '/api'

    static SEND_OTP = Urls.TODO_API_PREFIX + '/user/generate-otp';
    static VERIFY_OTP = Urls.TODO_API_PREFIX + '/user/verify-otp';
    static LOGIN = Urls.TODO_API_PREFIX + '/user/signin';
    static SIGN_UP = Urls.TODO_API_PREFIX + '/user/sign-up';
    static SIGN_OUT = Urls.TODO_API_PREFIX + '/user/sign-out';
    static GET_USER_DETAILS = Urls.TODO_API_PREFIX + '/user/get-user-details';
    static FORGOT_PASSWORD = Urls.TODO_API_PREFIX + '/user/forgot-password';
    static GET_MY_PROFILE = Urls.TODO_API_PREFIX + '/user/get-my-profile';
    static RESET_PASSWORD = Urls.TODO_API_PREFIX + '/user/reset-password';
    static EDIT_PROFILE = Urls.TODO_API_PREFIX + '/user/edit-my-profile';

    static GET_ALL_TODOS = Urls.TODO_API_PREFIX + '/todo/get-all-todos';
    static ADD_TODO = Urls.TODO_API_PREFIX + '/todo/add-todo';
    static MARK_TODO = Urls.TODO_API_PREFIX + '/todo/mark-todo';
    static UPDATE_TODO = Urls.TODO_API_PREFIX + '/todo/update-todo';
    static DELETE_TODO = Urls.TODO_API_PREFIX + '/todo/delete-todo';
    static ADD_MY_DAY = Urls.TODO_API_PREFIX + '/todo/add-remove-myday-todo';
    static ADD_FILE = Urls.TODO_API_PREFIX + '/todo/upload-file';
}
