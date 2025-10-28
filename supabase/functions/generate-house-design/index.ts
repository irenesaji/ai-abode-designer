import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { architecturalStyle, colorScheme, roomLayout, specialFeatures } = preferences;

    // Define view descriptions
    const views = [
      {
        name: 'floor_plan',
        prompt: `Create a detailed architectural floor plan view of a ${architecturalStyle} house with ${roomLayout} layout. 
        Use ${colorScheme} color scheme. Include room labels, dimensions, and furniture placement. 
        ${specialFeatures.length > 0 ? `Special features: ${specialFeatures.join(', ')}.` : ''} 
        Professional architectural drawing style with clean lines, measurements, and annotations. Top-down view showing all rooms and spaces.`
      },
      {
        name: 'front_view',
        prompt: `Create a detailed architectural front elevation view of a ${architecturalStyle} house. 
        Use ${colorScheme} color scheme with appropriate exterior materials and finishes. 
        ${specialFeatures.length > 0 ? `Show ${specialFeatures.join(', ')}.` : ''} 
        Professional architectural rendering with proper scale, details of windows, doors, roof, and landscaping. Clear, technical drawing style.`
      },
      {
        name: 'back_view',
        prompt: `Create a detailed architectural back elevation view of a ${architecturalStyle} house. 
        Use ${colorScheme} color scheme. Show the rear facade with backyard elements. 
        ${specialFeatures.length > 0 ? `Include ${specialFeatures.join(', ')}.` : ''} 
        Professional architectural rendering showing windows, doors, outdoor spaces, and any patio or deck areas.`
      },
      {
        name: 'top_view',
        prompt: `Create a detailed architectural top/roof view of a ${architecturalStyle} house. 
        Show roof structure, materials, and design in ${colorScheme} style. 
        ${specialFeatures.includes('Solar panels') ? 'Include solar panel placement on the roof.' : ''} 
        Professional architectural drawing showing roof pitch, chimneys, vents, and overall footprint. Bird's eye perspective.`
      },
      {
        name: 'side_view',
        prompt: `Create a detailed architectural side elevation view of a ${architecturalStyle} house. 
        Use ${colorScheme} color scheme showing the profile of the building. 
        ${specialFeatures.length > 0 ? `Incorporate ${specialFeatures.join(', ')}.` : ''} 
        Professional architectural rendering with proper proportions, height details, and side landscaping elements.`
      }
    ];

    const results = [];
    
    // Generate all views
    for (const view of views) {
      console.log(`Generating ${view.name}...`);
      
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            {
              role: 'user',
              content: view.prompt
            }
          ],
          modalities: ['image', 'text']
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error generating ${view.name}:`, response.status, errorText);
        throw new Error(`Failed to generate ${view.name}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      if (imageUrl) {
        results.push({
          view: view.name,
          imageUrl: imageUrl
        });
      }
    }

    return new Response(
      JSON.stringify({ designs: results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in generate-house-design:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
