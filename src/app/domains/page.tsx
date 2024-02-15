import client from '@/utils/grpc-client'
import styles from "./page.module.css";

export default async function Domains() {
  client.listDomains({ pageSize: 10 }).then((v) => console.log(v)).catch((e) => console.log(e))

  return (
    <main className={styles.main}>
      Hello
    </main>
  );
}
