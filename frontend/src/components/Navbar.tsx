import { 
    Bell, 
    HelpCircle
} from "lucide-react";

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from "@/context/authContext";

function Navbar() {

    const { user } = useAuth()

    return (
        <div className="px-6 py-3 flex items-center justify-end">

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Bell size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                    <HelpCircle size={20} />
                </Button>
                <Avatar className="h-11 w-11">
                    <AvatarImage src={user?.image.imageUrl} alt="User" />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}

export default Navbar
