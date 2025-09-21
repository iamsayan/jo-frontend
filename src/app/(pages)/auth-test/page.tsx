import { auth, signIn, signOut } from "@/auth";

export default async function AuthTest() {
    const session = await auth();

    if (!session?.user) {
        return <form
            action={async () => {
                "use server"
                await signIn()
            }}
        >
            <button type="submit" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">Sign in</button>
        </form>
    }

    return (
        <div>
            <p>Auth Test</p>
            <p>User: {session.user.email}</p>
            <form
                action={async () => {
                    "use server"
                    await signOut()
                }}
            >
                <button type="submit" className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md">Sign out</button>
            </form>
        </div>
    )
}
