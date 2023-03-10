**
## About

![Uli Logo-Header-03](https://user-images.githubusercontent.com/13188366/224236305-6a3b3f26-f5b3-4256-b0dc-5d2b4b8d5e27.png)

Uli is a browser plugin that:
* De-normalizes the everyday violence that people of marginalized genders experience online in India, and
* Provides tools for relief and collective response.

It is an attempt to invert the top-down logics of platform moderation and center the experiences of those subject to online gender-based violence. 

![Uli September posts](https://user-images.githubusercontent.com/13188366/224235833-e6493aab-9706-4b05-ac5a-fb1c0cc97f03.gif)


## Motivation

The graphic narrative titled ‘Personal (Cyber) Space’ published in 2016 by Parthasarthy and Malhotra narrates an experience of a young internet user. The animated short comic hosted by Kadak, a South Asian women collective, asks: ‘If one says something, there’s the fear of hateful response. But if one doesn’t say something, isn’t that silence counterproductive?’ only to end with the question, ‘so what does one say?’

Violence, abuse, and hate speech on the web has become pervasive to one’s experience of social media and the existing scholarship suggests that it is those situated at the margins who are worst affected. People of marginalized genders in India are disproportionately affected. Simultaneously, the business models of social media platforms skew the incentives against protecting users who use social media in non-dominant languages. Uli is an attempt to build tools to protect and enable collective response for social media users of marginalizd genders. 


## Approach

The problem of online violence encompasses within itself legal, political, social, cultural and technological complexities that make any easy solution impossible. This overdetermined nature mandates that we seek solutions from multiple avenues. As with all Tattle projects, we don't expect technology to provide all the answers, but for it to be intertwined in human action. 

Specifically around redaction, the project borrows from feminist approaches to Machine Learning technology and aims to intervene into the ongoing debate around content moderation. The existing algorithmic approaches to automated content moderation strategies are generally biased towards English-language content paying very limited attention to social, cultural and linguistic diversity elsewhere. Moreover, the existing approaches understand moderation through a binary logic of: leave content up or remove it. With multiple political and legal implications emerging from these biases, the existing approaches threaten to pose more problems rather than solving them. With this tool, the project aims to redress these problems and find creative ways in which moderation can empower multiple users, especially the ones that are most affected.

Through extensive qualitative data collection methods and participatory analysis, the project will seek participation from different communities to arrive at a co-liberation model. This model will be based on needs articulated by communities, rather than the priorities of powerful institutions. We will also aim to make our model for content moderation transparent and easily understandable for users. Our methodology, annotation guidelines, datasets, and the limitations in the dataset will be archived in public repositories online. Through this, we will aim to raise awareness about content moderation systems and gender-based violence online.

The ultimate aim of the project is to envision creative and collective responses to the structural problem of violence experienced online and help build solidarity and shared understanding while empowering users to take back control of their digital experience.

### Situating machine learning:

Machine learning based approaches are a commonly used technique to automate decision making when the volume of data is large. To put it briefly, machine learning works by finding patterns in existing data to ascribe a value to future queries. Instead of telling an algorithm what to do, in machine learning, the algorithm figures out what to do based on the data it is fed. The data used to train a machine learning system as well as the algorithm used to classify the data, can encode social beliefs and values. These are perpetuated in the performance of the machine learning systems.

The moderation decisions of social media platforms often make international news. Some decisions can be attributed to error. Machine learning system, like every prediction system, makes errors. But some decisions reflect the social values in the data and algorithms behind the model. So, what many communities find harmful may not be harmful as per the guidelines set by social media platforms.
Machine learning tools can also be designed to reflect the values of those at the forefront of tackling violence, to protect those who will be at the receiving end of the violence. This is precisely the goal of our project.

### Repository Structure

| Directory         | Description                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------- |
| browser extension | a browser extension that helps moderate and mitigate online gender based violence on twitter |
| annotators        | a web app to annotate tweets                                                                 |
| slur-replacement  | Python notebook that documents our exact and approximate slur replacement techniques         |
| scrapers          | Twitter and Instagram scrapers we used to collect data for training ML models                |
| ogbv-ml-rest      | REST API server and OGBV classifier                                                          |

# Contributing

We are currently working towards the Chrome and Firefox Extension's v0.1.13.
You can track the project [here](https://github.com/orgs/tattle-made/projects/20/views/3)
Find an issue or domain that interests you and reach out to us.

There's also a list of [good first issues](https://github.com/tattle-made/OGBV/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to get started on.

## Contact

For more details on this project please send an email to one of the following email IDs:

- cheshta@cis-india.org
- ambika@cis-india.org
- tarunima@tattle.co.in

## Funding:

The pilot of the project was managed by the [Centre for Internet and Society](https://cis-india.org/) and Tattle Civic Tech. It was funded by [Omidyar Network India](https://www.omidyarnetwork.in/) as part of their Digital Society Challenge grant.**

## Website

Visit the Uli website at https://uli.tattle.co.in/
