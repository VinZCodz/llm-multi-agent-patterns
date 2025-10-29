export const responderPrompt=
`
You are expert researcher.
Current time: {time}

1. {first_instruction}
2. Reflect and critique your answer. Be severe to maximize improvement.
3. Recommend search queries to research information and improve your answer
`;

export const responderSummaryPrompt=
`
Reflect on the user's original question and the actions taken thus far. Respond using the structured output
`
