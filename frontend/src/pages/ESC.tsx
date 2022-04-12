import { ReactElement } from "react";
import SampleLayout from "../layouts/samplesLayout";
import Card from "../components/Cards/CardsInterface";
import Dock from "../components/Dock";

export default function MainMenu() {
  return (
    <Dock>
      <Card href="/profile" title="Profile" />
      <Card href="/chat" title="Chat" />
      <Card href="/social" title="Social" />
      <Card href="/leaderboard" title="Leaderboard" />
      <Card href="/gamemode" title="GameMode" />
    </Dock>
  );
}

MainMenu.getLayout = function getLayout(page: ReactElement) {
  return <SampleLayout>{page}</SampleLayout>;
};
