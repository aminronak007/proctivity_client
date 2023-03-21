import Intro from "views/Intro";
import { UserProfile } from "views/pages/index";
import Subscribe from "views/pages/subscription/Subscribe";
import SubscriptionSucess from "views/pages/subscription/SubscriptionSucess";
import ChangePassword from "views/pages/ChangePassword/ChangePassword";
import MarketingData from "views/pages/MarketingData/MarketingData";
import MarketingDataList from "views/pages/MarketingDataList/MarketingDataList";
import Users from "views/pages/SubUsers/SubUsers";
import Groups from "views/pages/Groups/Groups";
import SubUsersPermissions from "views/pages/SubUsers/SubUsersPermissions";
import CustomerNotes from "views/pages/Customer/Notes/Notes";
import CustomerDocs from "views/pages/Customer/Documents/Documents";
import CustomerQuotes from "views/pages/Customer/Quotes/Quotes";
import CustomerInvoices from "views/pages/Customer/Invoices/Invoices";
import CastomerCalander from "views/pages/Customer/calender/Calender";
import Customer from "views/pages/Customer/Customer";
import CustomerAdd from "views/pages/Customer/CustomerAdd";
import Settings from "views/pages/settings/Settings";

const dashboardRoutes = [
  { path: "/intro", component: Intro },
  { path: "/profile", component: UserProfile },
  { path: "/settings", component: Settings },
  { path: "/subscription", component: Subscribe, module: "subscription" },
  {
    path: "/subscription/success",
    component: SubscriptionSucess,
    module: "subscription"
  },
  { path: "/change-password", component: ChangePassword },
  { path: "/users", component: Users, module: "users" },
  {
    path: "/marketing-data",
    component: MarketingData,
    module: "marketing_data"
  },
  {
    path: "/marketing-data-list",
    component: MarketingDataList,
    module: "marketing_data_list"
  },
  { path: "/groups", component: Groups, module: "groups" },
  { path: "/users/permissions/:id", component: SubUsersPermissions },
  {
    path: "/customer/:id/calendar",
    component: CastomerCalander,
    module: "calendar"
  },
  {
    path: "/customer/calendar",
    component: CastomerCalander,
    module: "calendar"
  },
  {
    path: "/customer-entries/:group_id/:status_id/list",
    component: Customer,
    module: "customer_entries"
  },
  {
    path: "/customer-entries/:group_id/:status_id/:id/notes",
    component: CustomerNotes,
    module: "customer_entries"
  },
  {
    path: "/customer-entries/:group_id/:status_id/:id/docs",
    component: CustomerDocs,
    module: "customer_entries"
  },
  {
    path: "/customer-entries/:group_id/:status_id/:id/quotes",
    component: CustomerQuotes,
    module: "customer_entries"
  },
  {
    path: "/customer-entries/:group_id/:status_id/:id/invoices",
    component: CustomerInvoices,
    module: "customer_entries"
  },
  { path: "/customer-entries/add", component: CustomerAdd }
];

export default dashboardRoutes;
