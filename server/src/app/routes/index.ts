import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { NotificationRoutes } from "../modules/notification/notification.route";



const router: Router = Router();

const routes = [
   
    {
        path: "/users",
        route: UserRoutes
    },
     
    {
        path: "/notifications",
        route: NotificationRoutes
    }
];

routes.forEach((route) => router.use(route.path, route.route));
export default router;