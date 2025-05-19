import { AccountRecovery } from "@/components/security/account-recovery"

export default function AccountRecoveryPage() {
  return (
    <div className="container max-w-screen-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">RugbyConnect Account Recovery</h1>
      <AccountRecovery />
    </div>
  )
}
