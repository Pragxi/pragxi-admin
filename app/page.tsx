import {redirect} from 'next/navigation'
import {createClient} from "@/utils/supabase/server";

export default async function Home() {

    const supabase = await createClient();

    const {data: {user}} = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    console.log("home screen")

    return (
        <div>
            <h1>Pragxi Home Page</h1>
        </div>
    )
} 