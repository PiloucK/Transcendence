import { ReactElement } from "react";
import { SampleLayout } from "../../../layouts/samplesLayout";
import ButtonInterface from "../../../components/Buttons/ButtonsInterface";
import ButtonIncrement from "../../../components/Buttons/ButtonsIncrement";
import { useRouter } from "next/router";

function getComponent(pid: string | string[] | undefined) {
  if (pid === "ButtonsIncrement") {
    return <ButtonIncrement />;
  } else if (pid === "ButtonsInterface") {
    return <ButtonInterface />;
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
