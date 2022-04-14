import { ReactElement } from "react";
import DockUser from "../components/Dock/DockUser";
import DockGuest from "../components/Dock/DockGuest";
import MainLayout from "../layouts/mainLayout";

export default function MainMenu() {
  return (
	<DockGuest />
  );
}

MainMenu.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
