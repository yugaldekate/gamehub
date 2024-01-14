import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <p>Only authenticated users can see this page</p>
      <p>Dashboard</p>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
