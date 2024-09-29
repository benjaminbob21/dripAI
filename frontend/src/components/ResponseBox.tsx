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
            <div className="gap-4">
                <div className="flex flex-col gap-8">
                    <div>
                        <h2 className="font-bold">RATING</h2>
                        <p>{review.rating} {review.rating == 1 ? "Star" : "Stars"}</p>
                    </div>
                    <div>
                        <h3 className="font-bold">RECOMMENDATIONS</h3>
                        <ol className="list-decimal pl-5">{review.recommendation_1.map((rec) => <li> {rec.change} </li>)}</ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default ResponseBox;