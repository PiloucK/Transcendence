import Link from "next/link";
import { ReactElement } from "react";
import { SampleLayout } from "../../layouts/samplesLayout";
// import type { NextPage } from 'next'
import styles from "../../styles/Home.module.css";

function getCards() {
  return (
    <>
      <h3>Cards</h3>
      <li>
        <Link href="samples/Cards/CardsInterface">CardsInterface</Link>
      </li>
      <li>
        <Link href="samples/Cards/CardsHome">CardsHome</Link>
      </li>
    </>
  );
}

function getButtons() {
  return (
    <>
      <h3>Buttons</h3>
      <li>
        <Link href="samples/Buttons/ButtonsInterface">ButtonsInterface</Link>
      </li>
    </>
  );
}

function getIcons() {
  return (
    <>
      <h3>Icons</h3>
      <li>
        <Link href="samples/Icons/RedirectionIcon">RedirectionIcon</Link>
      </li>
    </>
  );
}

export default function Page() {
  return (
    <div>
      <h1> Welcome to the sample page! </h1>

      <div className={styles.code}>
        {getCards()}

        {getButtons()}

        {getIcons()}
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <SampleLayout>{page}</SampleLayout>;
};
