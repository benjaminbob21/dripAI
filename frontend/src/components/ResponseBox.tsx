import { ReviewResponse } from "@/api/AnalyseImageApi";

type ResponseBoxProps = {
    review: ReviewResponse | null;
}

function ResponseBox({ review }: ResponseBoxProps) {
    if (review == null) return <>error</>
    return <div>
        {review.rating}
    </div>
}

export default ResponseBox;