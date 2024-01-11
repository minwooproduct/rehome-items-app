import { supabaseServer } from "@/lib/initSupabase";
import { cookies } from "next/headers";

export default async function Page() {
  const { data } = await supabaseServer(cookies).from("images").select();
  console.log(data[0].imageSrc)
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
