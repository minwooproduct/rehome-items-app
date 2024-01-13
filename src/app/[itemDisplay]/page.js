import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { cookies } from "next/headers";
import { supabaseServer } from '@/lib/initSupabase'



export default async function itemDisplay({ params }) {
    
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

    return <></>
}