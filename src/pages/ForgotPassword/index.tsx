import ForgotPasswordForm from "@/pages/ForgotPassword/ForgotPasswordForm"
import AuthImagePanel from "@/components/features/AuthImagePanel"

export default function ForgotPassword() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
      <AuthImagePanel />
    </div>
  )
}
