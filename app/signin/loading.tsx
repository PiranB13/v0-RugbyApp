import { Skeleton } from "@/components/ui/skeleton"

export default function SignInLoading() {
  return (
    <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-[#1e4620] dark:bg-[#1e4620]" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Skeleton className="h-6 w-6 mr-2 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="relative z-20 mt-auto">
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="relative z-20 mt-auto">
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Skeleton className="h-px w-full" />
              </div>
              <div className="relative flex justify-center">
                <Skeleton className="h-4 w-32 bg-background" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="text-center">
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
