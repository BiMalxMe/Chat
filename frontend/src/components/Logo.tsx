import { MessageCircle } from "lucide-react"

export const Logo = () => {
    return(
        <div className="flex items-center" >
              <div className="flex items-center justify-center h-8 w-8 rounded-xl border-2 border-blue-400">
                <MessageCircle className="h-5 w-5 text-blue-400" fill="currentColor"/>
            </div>

            <div className="text-2xl font-bold ml-2">
                SapiensChat
            </div>
        </div>
    )
}