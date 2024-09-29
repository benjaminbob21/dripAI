import { useMutation } from "react-query";

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
