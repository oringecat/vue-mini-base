import { UrlType } from '@/constants/user'

declare global {
    namespace User {
        /** 用户登录参数 */
        interface LoginParams {
            account: string;
            password: string;
            client: string;
            version: string;
        }

        /** 用户信息 */
        interface UserInfo {
            id: number;
            roleId: number;
            userName: string;
            realName: string;
            avatar: string;
            token: string;
        }
    }
}