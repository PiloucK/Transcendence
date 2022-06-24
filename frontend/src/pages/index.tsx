import { ReactElement } from "react";
import { IndexLayout } from "../layouts/indexLayout";
import {UserStatusLayout} from "../layouts/userStatusLayout";

export default function IndexPage() {
  return <></>;
}

IndexPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserStatusLayout>
      <IndexLayout>{page}</IndexLayout>
    </UserStatusLayout>
  );
};
