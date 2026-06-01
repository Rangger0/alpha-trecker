import { useCallback, useMemo, useState } from "react";
import { analyzeProject } from "@/services/projectResearchService";
import type { AnalysisStatus, ProjectResearchInput, ProjectResearchResult } from "@/types/intelligence";
import { isValidGithubUrl, isValidTwitterUrl, isValidUrl } from "@/utils/validation";

const projectSteps = [
  "Crawling docs...",
  "Fetching funding...",
  "Checking GitHub...",
  "Checking social...",
  "Generating AI summary...",
];

export function useProjectResearch() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<ProjectResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = useCallback((input: ProjectResearchInput) => {
    const errors: Record<string, string> = {};
    if (input.projectUrl && !isValidUrl(input.projectUrl)) errors.projectUrl = "Invalid website URL";
    if (input.docsUrl && !isValidUrl(input.docsUrl)) errors.docsUrl = "Invalid docs URL";
    if (input.githubUrl && !isValidGithubUrl(input.githubUrl)) errors.githubUrl = "Invalid GitHub URL";
    if (input.twitterUrl && !isValidTwitterUrl(input.twitterUrl)) errors.twitterUrl = "Invalid Twitter/X URL";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  const run = useCallback(async (input: ProjectResearchInput) => {
    setError(null);
    setResult(null);

    const hasInput = Boolean(input.projectUrl || input.docsUrl || input.githubUrl || input.twitterUrl);
    if (!hasInput) {
      setStatus("idle");
      setError("Paste a project link to begin AI research.");
      return;
    }

    if (!validate(input)) {
      setStatus("idle");
      return;
    }

    setStatus("loading");
    setStepIndex(0);

    const timer = window.setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, projectSteps.length - 1));
    }, 700);

    try {
      const analysis = await analyzeProject(input);
      setResult(analysis);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setError(error instanceof Error ? error.message : "Unable to analyze project");
    } finally {
      window.clearInterval(timer);
      setStepIndex(0);
    }
  }, [validate]);

  const reset = useCallback(() => {
    setStatus("idle");
    setStepIndex(0);
    setResult(null);
    setError(null);
    setFieldErrors({});
  }, []);

  return useMemo(() => ({
    status,
    steps: projectSteps,
    stepIndex,
    result,
    error,
    fieldErrors,
    run,
    reset,
  }), [error, fieldErrors, reset, result, run, status, stepIndex]);
}
