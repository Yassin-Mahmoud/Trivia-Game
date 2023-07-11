import React, { useState, useEffect } from "react";
import "./App.css";
import {
    Card,
    CardBody,
    Typography,
    CardFooter,
    Button,
    Input,
} from "@material-tailwind/react";

interface Question {
    category: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answer: string[];
}

const TriviaGame: React.FC = () => {
    const [question, setQuestion] = useState<Question | null>(null);
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState<"correct" | "incorrect" | "">("");
    const [error, setError] = useState<string | null>(null);
    const [hint, setHint] = useState<boolean>(false);

    useEffect(() => {
        void getQuestion();
    }, []);

    const getQuestion = async () => {
        try {
            const response = await fetch(
                "https://opentdb.com/api.php?amount=1"
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const data = await response.json();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            setQuestion(data.results[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!answer) {
            setError("Please enter an answer");
            return;
        }

        if (answer.toLowerCase() === question?.correct_answer.toLowerCase()) {
            setResult("correct");
            setHint(false);
            setError("");
        } else {
            setResult("incorrect");
            setError("");
        }

        setAnswer("");
        void getQuestion();
    };

    if (!question) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col mt-28  text-white items-center justify-center">
            <Card className="mt-6 w-[330px] lg:w-[540px]">
                <CardBody className="justify-center items-center flex flex-col">
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        Category: {question.category}
                    </Typography>
                    <Typography variant="h6" color="blue-gray" className="mb-2">
                        difficulty: {question.difficulty}
                    </Typography>
                    <Typography>Question: {question.question}</Typography>
                </CardBody>
                <CardFooter className="pt-0">
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            placeholder="Answer"
                            className="focus:!border-t-blue-500 col-span-2 focus:!border-blue-500 ring-4 ring-transparent focus:ring-blue-500/20 !border !border-blue-gray-50 bg-white shadow-lg shadow-blue-gray-900/5 placeholder:text-blue-gray-200 text-blue-gray-500"
                            labelProps={{
                                className: "hidden",
                            }}
                            containerProps={{ className: "min-w-[100px]" }}
                            id="answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                        <div className="flex justify-around mt-9">
                            <Button type="submit" className="">
                                Submit
                            </Button>
                            <Button onClick={() => setHint(true)} className="">
                                Hint
                            </Button>
                        </div>
                    </form>
                    {hint && (
                        <p className="flex items-center justify-center mt-4">
                            Hint: {question.correct_answer}
                        </p>
                    )}
                    <p>
                        {result && (
                            <div className="flex items-center justify-center mt-4">
                                {" "}
                                {result}
                            </div>
                        )}
                    </p>
                    <p className="flex items-center justify-center mt-4">
                        {error}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default TriviaGame;
