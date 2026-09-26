import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DAILY_LIMIT = 5

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // This client uses the caller's own token — only good for checking who they are
        const authHeader = req.headers.get('Authorization') ?? ''
        const userClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user }, error: userError } = await userClient.auth.getUser()

        if (userError || !user) {
            return new Response(JSON.stringify({ error: 'You must be logged in to use the chatbot.' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // This client uses the service role — bypasses RLS, only exists inside this trusted server function
        const adminClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const today = new Date().toISOString().split('T')[0]

        const { data: usage } = await adminClient
            .from('chat_usage')
            .select('message_count')
            .eq('user_id', user.id)
            .eq('usage_date', today)
            .maybeSingle()

        const currentCount = usage?.message_count ?? 0

        if (currentCount >= DAILY_LIMIT) {
            return new Response(JSON.stringify({ error: `You've reached today's limit of ${DAILY_LIMIT} messages. Try again tomorrow.` }), {
                status: 429,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const { messages } = await req.json()

        const contents = messages.map((m: { role: string; content: string }) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }))

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': Deno.env.get('GEMINI_API_KEY') ?? '',
                },
                body: JSON.stringify({
                    contents,
                    systemInstruction: {
                        parts: [{
                            text: 'You are a knowledgeable, friendly fitness assistant for the WellFit app. Only answer questions about fitness, nutrition, exercise form, and healthy habits. If asked about something unrelated to fitness, politely redirect the conversation back to fitness topics.',
                        }],
                    },
                }),
            }
        )

        const data = await response.json()

        // Only count it as "used" once we know Gemini actually responded
        await adminClient
            .from('chat_usage')
            .upsert({ user_id: user.id, usage_date: today, message_count: currentCount + 1 })

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})