import { UserPreferences, ProjectSuggestion, ProjectRoadmap, SkillLevel } from "../types";

export const suggestProjects = async (prefs: UserPreferences): Promise<ProjectSuggestion[]> => {
  const prompt = `You are a Senior Academic Advisor. Research and suggest 4 high-impact, innovative engineering project ideas for 2024-2025.
    Student Profile: ${prefs.year} year in ${prefs.branch}. 
    Focus Areas: ${prefs.interests}. 
    Current Skill Level: ${prefs.skillLevel}. 
    Timeline: ${prefs.duration}. 
    
    Requirements:
    1. Projects must be academically rigorous and suitable for a portfolio.
    2. Use real-world industry trends (utilize Google Search).
    3. Include specific learning outcomes like "Real-time Data Processing" or "Systems Integration".`;

  const response = await fetch("/\.netlify/functions/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  try {
    const suggestions: ProjectSuggestion[] = data.suggestions || [];
    const uniqueUrls = data.sourceUrls || [];
    
    return suggestions.map(s => ({ ...s, sourceUrls: uniqueUrls }));
  } catch (error) {
    console.error("Failed to parse project suggestions", error);
    return [];
  }
};

export const generateRoadmap = async (project: ProjectSuggestion, prefs: UserPreferences): Promise<ProjectRoadmap> => {
  const prompt = `Act as a Project Lead. Create an actionable, 4-phase execution roadmap for: "${project.title}".
    Student Context: ${prefs.year}, ${prefs.branch}, Skill: ${prefs.skillLevel}.
    
    Phases:
    1. Research & Architecture
    2. Core Prototyping
    3. Feature Integration
    4. Testing & Documentation
    
    Provide 4 tasks per phase and 2-3 specific learning resources (docs/repos).`;

  const response = await fetch("/\.netlify/functions/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  try {
    const rawData = data.roadmap || {};
    return {
      ...rawData,
      milestones: (rawData.milestones || []).map((m: any) => ({
        ...m,
        tasks: (m.tasks || []).map((t: any) => ({ ...t, completed: false }))
      })),
      overallProgress: 0
    };
  } catch (error) {
    console.error("Roadmap generation failed", error);
    throw new Error("Failed to generate strategic roadmap.");
  }
};