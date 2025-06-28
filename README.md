# Kid's friendly assessment generator app using AI 

![assessment-generator-demo-pic](/public//assessment-ai.png)

A web application for generating assessments for kids. Built with next.js and @ai-sdk/openai, This app helps building assessments for school going kids, supports offline mode if ai not available, 100% accurately generate assessments, supports export as text, pdf and print.

## Features

- Who can use this: anyone particularly teachers, parents and students
- Number of questions suport: 5, 10, 15, 20
- Age group: Preschool(3-5 years), Early Elementary School(6-8 years), Late Elementary School(9-11 years), Middle School(12-14 years)
- Difficulty level: very Easy, Easy, Medium, Hard, Very Hard
- Offline mode available for Topic: Math
- Schools, coaching centers will be benefited using this virtually.
- Teachers can send assessments, take tests.

## Areas of Improvements

- Share assessment to parents via email or whatsapp (new feature)
- Submit assessment feature (save to database)
- Generate assessment score in the score board based on given answers by students (automatic score generator)


## Tech Stack

- next.js (v15) for frontend part
- integrated open-ai api via ai-sdk
- used model - gpt-3.5-turbo
- used xlsx for .csv export


## Getting Started

1. Clone the repository
2. copy `.env` and fill your credentials
3. Install dependencies with `pnpm install`
4. Run development server with `pnpm run dev`
5. Build for production with `pnpm run build`




