import { ReviewResponse } from "@/api/AnalyseImageApi";

type ResponseBoxProps = {
    review: ReviewResponse | null;
}

function ResponseBox({ review }: ResponseBoxProps) {
    if (review == null) return <>error</>
    return <div className="bg-gray-200 h-full pb-12">
        <div className="flex flex-col h-full">
            <div className="grow">
                {""}
            </div>
            <div>
                Hi
            </div>
        </div>
    </div>
}

export default ResponseBox;