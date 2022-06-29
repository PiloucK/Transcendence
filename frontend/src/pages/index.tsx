import { ReactElement } from "react";
import { IndexLayout } from "../layouts/indexLayout";

export default function IndexPage() {
  return <></>;
}

IndexPage.getLayout = function getLayout(page: ReactElement) {
  return <IndexLayout>{page}</IndexLayout>;
};
