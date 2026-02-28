import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("login", "pages/login.tsx"),
  layout("components/layouts/authenticated.tsx", [
    route("dashboard", "pages/dashboard/index.tsx"),
    route("files", "pages/files/index.tsx"),
    route("accounts", "pages/accounts/index.tsx"),
    route("settings", "pages/settings/index.tsx"),
    route("profile", "pages/profile/index.tsx"),
  ]),
] satisfies RouteConfig;
