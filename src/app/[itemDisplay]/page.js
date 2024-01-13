import React from 'react'
import { cookies } from "next/headers";
import { supabaseServer } from '@/lib/initSupabase'
import ItemDisplayClient from './ItemDisplay'

export async function retrieveImage ( { params }) {
    // Take the parameter from the url e.g. from "/bicycle" we take value 'bicycle'
    //  Route -> /[itemPage]
    //  URL -> /bicycle
    //  `params` -> { itemPage: 'bicycle'}

    console.log('params.itemDisplay', params.itemDisplay)
    //  Check if item exists in database
    const { data } = await supabaseServer(cookies)
        .from("images")
        .select()
        .eq('name', params.itemDisplay)

    console.log('data is', data)
}

// Server Component
export default function itemDisplay(props) {
    // Server-side logic can go here
    return (
        <div>
            {/* Other server-rendered content */}
            <ItemDisplayClient />
        </div>
    );
}