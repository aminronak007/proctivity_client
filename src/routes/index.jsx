import Layout from "layouts/DashboardLayout.jsx";
import {
  Login,
  Register,
  Error400,
  ForgotPassword,
  ResetPassword,
  Error500,
  LoginAs,
  CustomerQuotesAccept
} from "./../views/pages/index";

const indexRoutes = [
  { path: "/login", component: Login },
  { path: "/login_as/:id", component: LoginAs },
  { path: "/register", component: Register },
  { path: "/error400", component: Error400 },
  { path: "/error500", component: Error500 },
  { path: "/forgotPassword", component: ForgotPassword },
  { path: "/resetPassword/:token", component: ResetPassword },
  {
    path: "/quotes-accept/:user_id/:id",
    component: CustomerQuotesAccept
  },
  { path: "/", component: Layout }
];

export default indexRoutes;
