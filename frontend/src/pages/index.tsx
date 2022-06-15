import { DockUser } from "../components/Dock/DockUser";
// function DockToShow() {
//   const loginContext = useLoginContext();

//   if (loginContext.userLogin !== null) {
//     return <DockUser />;
//   } else {
//     return <DockGuest />;
//   }
// }

//Show a Big play button to start the game in the middle of the screen.
export default function MainMenu() {
  return (
    <DockUser />
  );
}
