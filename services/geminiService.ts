import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

export const generateOutfitSuggestion = async (
  cityName: string,
  weather: WeatherData
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Prepare a concise prompt based on the weather data
    const prompt = `
      You are a fashion stylist. Give a short, one-sentence outfit suggestion for someone in ${cityName} right now.
      Current weather:
      - Temperature: ${weather.currentTemp}°C
      - Condition Code: ${weather.weatherCode}
      - Wind Speed: ${weather.windSpeed} km/h
      - Humidity: ${weather.humidity}%
      - Chance of Rain: ${weather.precipitationProb}%
      
      Keep the tone friendly, aesthetic, and helpful. Do not use markdown. Just plain text.
      Example: "Wear a light trench coat and bring an umbrella just in case."
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate outfit suggestion at this time. Please check your connection.";
  }
};