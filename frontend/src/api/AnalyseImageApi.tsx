import { useMutation } from "react-query";

export type Cloth = {
  id: number,
  cloth_type: string,
  color_s: string,
  simple_description: string,
  relative_size: string,
};

export type Recommendation = {
  cloth_id: number,
  change: string | null,
}

export type ReviewResponse = {
  clothes: Cloth[],
  rating: number,
  review: string,
  recommendation_1: Recommendation[],
  recommendation_2: Recommendation[],
  recommendation_3: Recommendation[],
  color_recommendation: Recommendation[],
}

export const analyseImageApi = () => {
  const submitAnalysisRequest = async (capturedImage: string) => {
    console.log("Deeper: " + capturedImage);
    const response = await fetch(`/api/analyze-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataImageUrl: capturedImage }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Cou8ld not analyse image");
    }
    console.log(response);
    return response.json();
  };

  const { mutateAsync: analyseImage, isLoading } = useMutation(
    submitAnalysisRequest
  );

  return { analyseImage, isLoading };
};
