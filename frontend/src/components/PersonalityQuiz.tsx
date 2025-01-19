import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { postPersonality } from "@/lib/api";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

interface Question {
  text: string;
  trait:
    | "extraversion"
    | "openness"
    | "conscientiousness"
    | "agreeableness"
    | "neuroticism";
  scale: number;
}

interface PersonalityProfile {
  extraversion: number;
  openness: number;
  conscientiousness: number;
  agreeableness: number;
  neuroticism: number;
  interests: string;
  energy_level: number;
  preferred_time: string;
  social_preference: number;
}

const questions: Question[] = [
  // Extraversion questions
  {
    text: "I enjoy being the center of attention",
    trait: "extraversion",
    scale: 0.8,
  },
  {
    text: "I feel energized after social interactions",
    trait: "extraversion",
    scale: 0.7,
  },
  {
    text: "I prefer working in groups rather than alone",
    trait: "extraversion",
    scale: 0.6,
  },

  // Openness questions
  { text: "I enjoy trying new experiences", trait: "openness", scale: 0.8 },
  { text: "I am interested in abstract ideas", trait: "openness", scale: 0.7 },
  {
    text: "I enjoy artistic and creative activities",
    trait: "openness",
    scale: 0.6,
  },

  // Conscientiousness questions
  {
    text: "I like to follow a schedule",
    trait: "conscientiousness",
    scale: 0.8,
  },
  {
    text: "I pay attention to details",
    trait: "conscientiousness",
    scale: 0.7,
  },
  {
    text: "I keep my belongings organized",
    trait: "conscientiousness",
    scale: 0.6,
  },

  // Agreeableness questions
  { text: "I care about others' feelings", trait: "agreeableness", scale: 0.8 },
  { text: "I enjoy helping others", trait: "agreeableness", scale: 0.7 },
  { text: "I try to avoid conflicts", trait: "agreeableness", scale: 0.6 },

  // Neuroticism questions
  { text: "I often worry about things", trait: "neuroticism", scale: 0.8 },
  { text: "I get stressed easily", trait: "neuroticism", scale: 0.7 },
  { text: "My mood changes frequently", trait: "neuroticism", scale: 0.6 },
];

const timeOptions = ["morning", "afternoon", "evening", "any"] as const;
type TimeOption = (typeof timeOptions)[number];

const PersonalityQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [preferredTime, setPreferredTime] = useState<TimeOption>("any");
  const [socialPreference, setSocialPreference] = useState<number>(3);
  const [interests, setInterests] = useState<string>("");
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const totalSteps = 3;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const isQuestionnaireComplete = () => {
    return questions.every((q) => responses[q.text] !== undefined);
  };

  const handleQuestionResponse = (
    questionText: string,
    value: number
  ): void => {
    setResponses((prev) => ({
      ...prev,
      [questionText]: (value - 1) / 4, // Normalize to 0-1 scale
    }));
  };

  const calculateTraitScores = (): Record<Question["trait"], number> => {
    const traitScores = {
      extraversion: 0,
      openness: 0,
      conscientiousness: 0,
      agreeableness: 0,
      neuroticism: 0,
    };

    questions.forEach((q) => {
      if (responses[q.text]) {
        traitScores[q.trait] += responses[q.text] * q.scale;
      }
    });

    // Normalize scores
    Object.keys(traitScores).forEach((trait) => {
      const relevantQuestions = questions.filter((q) => q.trait === trait);
      const totalScale = relevantQuestions.reduce((sum, q) => sum + q.scale, 0);
      traitScores[trait as Question["trait"]] = Math.min(
        Math.max(traitScores[trait as Question["trait"]] / totalScale, 0),
        1
      );
    });

    return traitScores;
  };

  const handleNext = () => {
    if (!isQuestionnaireComplete()) {
      setError("Please answer all questions before proceeding");
      return;
    }
    setError("");
    setCurrentStep(1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!interests.trim()) {
      setError("Please enter your interests");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const traitScores = calculateTraitScores();
      const finalProfile: PersonalityProfile = {
        ...traitScores,
        interests: interests.trim(),
        energy_level: (energyLevel - 1) / 4,
        preferred_time: preferredTime,
        social_preference: (socialPreference - 1) / 4,
      };

      await postPersonality(finalProfile);
      setProfile(finalProfile);
      setCurrentStep(2);
    } catch (err) {
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPersonalityQuestions = () => (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <div key={index} className="space-y-2">
          <p className="text-lg md:text-base sm:text-sm font-medium text-foreground">
            {q.text}
          </p>
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleQuestionResponse(q.text, value)}
                className={`px-3 py-2 rounded-md transition-all duration-200
                  ${
                    responses[q.text] === (value - 1) / 4
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/60"
                  }
                  focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none
                  active:scale-95`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleNext}
        className="w-full mt-6 bg-primary text-primary-foreground py-2 rounded-md
          hover:bg-primary/90 dark:hover:bg-primary/80
          transition-all duration-200 active:scale-[0.98]
          focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
      >
        Next
      </button>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-4">
      {/* Energy Level */}
      <div className="space-y-2">
        <p className="text-lg md:text-base font-medium text-foreground">
          Energy Level
        </p>
        <div className="grid grid-cols-5 gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setEnergyLevel(value)}
              className={`px-3 py-2 rounded-md transition-all duration-200
              ${
                energyLevel === value
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/60"
              }
              focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none
              active:scale-95`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Time */}
      <div className="space-y-2">
        <p className="text-lg md:text-base font-medium text-foreground">
          Preferred Time
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => setPreferredTime(time)}
              className={`px-3 py-2 rounded-md capitalize transition-all duration-200
              ${
                preferredTime === time
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/60"
              }
              focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none
              active:scale-95`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Social Preference */}
      <div className="space-y-2">
        <p className="text-lg md:text-base font-medium text-foreground">
          Social Preference
        </p>
        <div className="grid grid-cols-5 gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setSocialPreference(value)}
              className={`px-3 py-2 rounded-md transition-all duration-200
          ${
            socialPreference === value
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/60"
          }
          focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none
          active:scale-95`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-2">
        <p className="text-lg md:text-base font-medium text-foreground">
          Interests
        </p>
        <p className="text-sm text-muted-foreground">
          Enter your interests separated by commas
        </p>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="e.g., reading, hiking, cooking"
          className="w-full p-2 rounded-md bg-secondary text-secondary-foreground 
          border border-input hover:bg-secondary/80 dark:hover:bg-secondary/60
          focus:border-ring focus:ring-2 focus:ring-ring focus:ring-offset-2 
          focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => setCurrentStep(0)}
          className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-md
            hover:bg-secondary/80 dark:hover:bg-secondary/60
            transition-all duration-200 active:scale-[0.98]
            focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-primary text-primary-foreground py-2 rounded-md
            hover:bg-primary/90 dark:hover:bg-primary/80
            transition-all duration-200 active:scale-[0.98]
            focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
        >
          Submit
        </button>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!profile) return null;

    const chartData = [
      { subject: "Extraversion", score: profile.extraversion, fullMark: 1 },
      { subject: "Openness", score: profile.openness, fullMark: 1 },
      {
        subject: "Conscientiousness",
        score: profile.conscientiousness,
        fullMark: 1,
      },
      { subject: "Agreeableness", score: profile.agreeableness, fullMark: 1 },
      { subject: "Neuroticism", score: profile.neuroticism, fullMark: 1 },
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">
          Your Personality Profile
        </h2>

        <div className="w-full h-96 bg-secondary/50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="hsl(var(--secondary-foreground))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 1]}
                tick={{ fill: "hsl(var(--foreground))", fontSize: 9 }}
              />
              <Radar
                name="Personality"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4">
          {/* Progress Bars */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">Energy Level:</span>
            <div className="w-32 h-7 bg-secondary rounded-full border border-input">
              <div
                className="h-full bg-primary text-primary-foreground text-center py-1.5 rounded-full text-xs font-medium shadow-sm transition-all"
                style={{ width: `${profile.energy_level * 100}%` }}
              >
                {(profile.energy_level * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">
              Social Preference:
            </span>
            <div className="w-32 h-7 bg-secondary rounded-full border border-input">
              <div
                className="h-full bg-primary text-primary-foreground text-center py-1.5 rounded-full text-xs font-medium shadow-sm transition-all"
                style={{ width: `${profile.social_preference * 100}%` }}
              >
                {(profile.social_preference * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">Preferred Time:</span>
            <span className="text-primary font-medium capitalize">
              {profile.preferred_time}
            </span>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-foreground">Interests:</p>
            <p className="text-secondary-foreground bg-secondary/50 p-3 rounded-md border border-input">
              {profile.interests}
            </p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
    <Card className="w-full bg-card shadow-lg">
      <CardHeader className="border-b bg-muted/50">
        <CardTitle className="text-2xl md:text-xl sm:text-lg font-semibold">
          Activity Recommender Personality Quiz
        </CardTitle>
        <div className="w-full h-2 bg-secondary rounded-full mt-4">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-4 sm:p-3">
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        <div className="rounded-lg bg-muted/30">
          {currentStep === 0 && (
            <div className="space-y-4 p-4 animate-in fade-in-50" role="form">
              {renderPersonalityQuestions()}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4 p-4 animate-in slide-in-from-right-50">
              {renderPreferences()}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 p-4 animate-in zoom-in-50">
              {renderResults()}
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    {currentStep === 2 && (
    <Button asChild className="w-full bg-emerald-500 mt-4 hover:bg-emerald-600">
      <Link to="/app">
        Get Started <ArrowRightIcon />
      </Link>
    </Button>
  )}
    </>
  );
};

export default PersonalityQuiz;
