import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWeather = async (locationQuery: string): Promise<WeatherData> => {
  const model = "gemini-2.5-flash";
  
  // We define the expected structure in the prompt since we can't use responseSchema with googleSearch
  const jsonStructure = `
  {
    "location": {
      "city": "string",
      "country": "string",
      "lat": number,
      "lon": number
    },
    "current": {
      "temp": number (Celsius),
      "condition": "String (Sunny, Clear, Cloudy, PartlyCloudy, Rain, Drizzle, Thunderstorm, Snow, Mist, Fog)",
      "description": "string",
      "humidity": number (0-100),
      "windSpeed": number (km/h),
      "feelsLike": number (Celsius),
      "uvIndex": number,
      "visibility": number (km),
      "isDay": boolean (true if local time is between sunrise and sunset)
    },
    "hourly": [
      { "time": "HH:MM", "temp": number, "condition": "string", "precipChance": number }
    ],
    "daily": [
      { "day": "string", "date": "string", "minTemp": number, "maxTemp": number, "condition": "string", "precipChance": number }
    ],
    "aiSummary": "string (A witty, 2-sentence lifestyle recommendation)"
  }
  `;

  const prompt = `
    Perform a Google Search to find the CURRENT and REAL-TIME weather forecast for "${locationQuery}".
    
    Task:
    1. Search for current temperature, conditions, humidity, wind, and UV index for ${locationQuery}.
    2. Search for the 24-hour hourly forecast and 7-day daily forecast.
    3. Extract this data and format it STRICTLY as a raw JSON object matching the structure below.
    4. Do NOT include markdown formatting (like \`\`\`json). Just return the raw JSON string.
    5. Ensure "isDay" is accurate based on the current local time at the location.
    
    Required JSON Structure:
    ${jsonStructure}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        // Google Search Tool enabled for real-time data
        tools: [{ googleSearch: {} }],
        // Note: responseSchema is NOT allowed when using googleSearch tool
        temperature: 0.7, 
      },
    });

    let text = response.text;
    
    // Cleanup: Sometimes the model still wraps in markdown
    if (text) {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    if (!text) throw new Error("No data received from Gemini.");

    return JSON.parse(text) as WeatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};