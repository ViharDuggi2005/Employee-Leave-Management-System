
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateLeaveRejectionReason = async (userName: string, leaveType: string, startDate: string, endDate: string, reason: string): Promise<string> => {
    if (!API_KEY) return "Gemini API key not configured.";
    
    const prompt = `Generate a polite and professional reason for rejecting a leave request.
    Employee Name: ${userName}
    Leave Type: ${leaveType}
    Dates: ${startDate} to ${endDate}
    Reason for rejection: ${reason}
    Keep it concise, empathetic, and clear. Suggest discussing alternative dates if possible.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating rejection reason:", error);
        return "Could not generate a reason at this time.";
    }
};

export const generateLeaveRequestReason = async (leaveType: string, context: string): Promise<string> => {
    if (!API_KEY) return "Gemini API key not configured.";

    const prompt = `Generate a formal and concise reason for an employee leave request.
    Leave Type: ${leaveType}
    Context: ${context}
    The tone should be professional and appropriate for a leave application.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating leave reason:", error);
        return "Could not generate a reason at this time.";
    }
};
