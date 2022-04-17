import { ReactElement } from "react";
import { SampleLayout } from "../../../layouts/samplesLayout";
import CardInterface from "../../../components/Cards/CardsInterface";
import CardHome from "../../../components/Cards/CardsHome";
import { useRouter } from "next/router";

function getComponent(pid: string | string[] | undefined) {
  if (pid === "CardsHome") {
    return <CardHome />;
  } else if (pid === "CardsInterface") {
    return <CardInterface href="/" />;
  }
  return <>No components has been found</>;
}

export default function Components() {
  const router = useRouter();
  const { pid } = router.query;

  return getComponent(pid);
}

Components.getLayout = function getLayout(page: ReactElement) {
  return <SampleLayout>{page}</SampleLayout>;
};
