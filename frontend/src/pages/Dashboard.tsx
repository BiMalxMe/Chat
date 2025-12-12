import Chat from "../components/Chat"
import { Logo } from "../components/Logo"
import { Profile } from "../components/Profile"

export const Dashboard = () => {
    return (
        <div className="text-white h-screen">
            <div className="flex items-start justify-between w-2/4 mx-auto mt-20">
                <Logo />
                <Profile />
            </div>
            <div>
                <Chat />
            </div>
        </div>
    )
}
