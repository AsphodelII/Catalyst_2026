# Portfolio Bakery

By Byte Sized Edgarians,  Team of Three Unimelb First Years. 

## Site URL

https://catalyst-2026-w5l7.vercel.app
Enter manager username and password for functions

## 

> **You kept the model, but did you keep the recipe?**

A simple tool that assists mid to big quant trading teams hand over research properly. When a researcher leaves or moves to a new project, our bakery keeps all the important context (code, data, assumptions and notes on what didn't work), alongside important elements such as points of contact and a link to the codebase, attached to the model, essentially as a hubbase to assist quant trading teams.

## The Initial Problem

When a quant researcher builds a trading strategy, the final code is only part of the picture. Thing like which dataset they used, what assumptions they made, what they tried and didn't work, and why. If that person leaves the team, whoever inherits their work is stuck with code they don't fully understand.

## What We Built

After conducting careful research and an important interview with a canva engineer, we vastly improved upon the applicability of our tool.
- **Portfolio page:** Displays team models/strategies, their current readiness, ownership, missing handover information and quick links to each recipe card and repositories.
- **Recipe Cards:** Detailed documentation links of each model, including strategy hypothesis, code version, parameters, research notes + assumptions, GitHub link, team feedback and more. Schedule meeting function is also included within allowing team members to request a potential meeting schedule via zoom or in person for the speicif model.
- **Bread Basket:** The handover workspace for strategies after owners have either left or moved teams. Members can review preserved code and request ownership whilst team leaders/managers can allocate models.
- **Team:** Team directory showing each researcher's role, availability, contact email, active strategies and backup responsibilities. The goal of this page is to assist team members to identify who owns or supports each model.
- **Archive:** Historical storage area of past retired models or unowned models that are unable to be successfully handed over situated in Limbo. ALl models include codebase link, research data, description, archive date and more. 
- **Manager Console:** Manager view for administrative functions including creating projects, assigning new owners, managing employees and monitoring handovers.
- Notiifications and FAQs to assist with ease of access.

## Our Assumptions and Interviews
 
We started off thinking the main problem was merely ownership, that research just sits there with no clear reason once a researcher leaves, resulting in our plan to implement an assistance handover system. Our research uncovered that small quant teams have the highest risk of "key person" allocation where if a key researcher leaves, a major crisis results where their research becomes difficult for other members to continue or reproduce without the same environment, versions or execution paths.

However, after interviewing a Canva engineer, we were driven to understand that our assumption and proposed plan was flawed for small startups. He mentioned that from his personal experience, small startups would not rely as much on a handover website due to small teams already having their process planned out and implicit shared processes, and that turnover rate is lower.

Hence, we shifted our focus towards designing our Bakery to be more applicable to medium to larger corporations. After having a conversation with the Canva engineer, he suggested a plethora of suggestions that would benefit a team hubbase-styled handover site, in order to increase its "value" within a corporation, including points of contact, codebases, FAQs and recordings/notes (resource hub). Though, the engineer did mention that a checklist system would be quite convenient to incorporate inside, and after viewing our site, recommended the prior suggestions.

Our decision of adding the Limbo into the archive was mentioned to potentially assist with a real issue the Canva engineer admitted he had experinced, where he noted some projects would be held on hiatus without a proper handover. For us first years, that was a pretty neat nod.

With discussion, we realised to elevate our tool's efficiency and function, major additions had to be implemented. One major implementation was the archive, where older unused models would be stored for future reference essentially as a resource hub. Another critical addition was GitHub/repository links to each codebase outside of our checklist function. The canva engineer told us that currently during handovers, team members woild often scehdule a meeting and a presentation and that a checklist or dashboard style function could be convenient. Therefore, we also opted to include meeting functions inside the recipe, allowing old recordings to be rewatched or new meetings to be condutcted.

## What We'd Do With More Time

Unfortunately, we were unable to come in contact with many industry professionals outside of the Canva engineer. Hence, we spent much time researching research notes and anecdotes online, to see if it needed to be built into an existing workflow to start. The Canva engineer mentioned that current handover queues revolved around meetings and presentations by researchers and that our concept was surprisingly new on the market, and may be useful depending on concise incorporations. Hence, we would do more research to see how to increase its value and efficiency within corporations.

