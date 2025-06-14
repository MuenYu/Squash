import {cache} from "@/lib/redis";
import {NextRequest} from "next/server";

interface RouteParam {
    params: Promise<{
        id: string;
    }>
}

export async function GET(request: NextRequest, {params}: RouteParam) {
    try {
        const {id} = await params;
        // Get progress from Redis
        const progress = await cache.get(id);
        if (!progress) {
            return new Response(null, {status: 404});
        }

        return new Response(progress, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching progress:", error);
        return new Response(JSON.stringify({error: "Internal Server Error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
