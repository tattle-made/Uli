**This is a joint project by the [Centre for Internet and Society](https://cis-india.org/) and Tattle Civic Tech. It is funded by [Omidyar Network India](https://www.omidyarnetwork.in/) as part of their Digital Society Challenge grant.**

## About

The graphic narrative titled ‘Personal (Cyber) Space’ published in 2016 by Parthasarthy and Malhotra narrates an experience of a young internet user. The animated short comic hosted by Kadak, a South Asian women collective, asks: ‘If one says something, there’s the fear of hateful response. But if one doesn’t say something, isn’t that silence counterproductive?’ only to end with the question, ‘so what does one say?’

Violence, abuse, and hate speech on web 2.0 has become pervasive to one’s experience of social media and the existing scholarship suggests that it is those situated at the margins who are worst affected. The question posed by the comic evokes a range of problems that are at the heart of this everyday violence. The problem of online violence encompasses within itself legal, political, social, cultural and technological complexities that make any easy solution impossible. This overdetermined nature mandates that we seek solutions from multiple avenues.

Funded by [Omidyar Network India](https://www.omidyarnetwork.in/) as part of their Digital Society Challenge grant, the [Centre for Internet and Society](https://cis-india.org/) and Tattle Civic Tech are building a free-to-use user-facing web plugin. The plug-in will help users to moderate instances of online violence in Indian languages with a focus on the experience of persons situated at the margins of gender, caste, religion and sexuality.

## Approach

The project borrows from feminist approaches to Machine Learning technology and aims to intervene into the ongoing debate around content moderation. The existing algorithmic approaches to automated content moderation strategies are generally biased towards English-language content paying very limited attention to social, cultural and linguistic diversity elsewhere. Moreover, the existing approaches understand moderation through a binary logic of: leave content up or remove it. With multiple political and legal implications emerging from these biases, the existing approaches threaten to pose more problems rather than solving them. With this tool, the project aims to redress these problems and find creative ways in which moderation can empower multiple users, especially the ones that are most affected.

Through extensive qualitative data collection methods and participatory analysis, the project will seek participation from different communities to arrive at a co-liberation model. This model will be based on needs articulated by communities, rather than the priorities of powerful institutions. We will also aim to make our model for content moderation transparent and easily understandable for users. Our methodology, annotation guidelines, datasets, and the limitations in the dataset will be archived in public repositories online. Through this, we will aim to raise awareness about content moderation systems and gender-based violence online.

The ultimate aim of the project is to envision creative and collective responses to the structural problem of violence experienced online and help build solidarity and shared understanding while empowering users to take back control of their digital experience.

### Situating machine learning:
Machine learning based approaches are a commonly used technique to automate decision making when the volume of data is large. To put it briefly, machine learning works by finding patterns in existing data to ascribe a value to future queries. Instead of telling an algorithm what to do, in machine learning, the algorithm figures out what to do based on the data it is fed. The data used to train a machine learning system as well as the algorithm used to classify the data, can encode social beliefs and values. These are perpetuated in the performance of the machine learning systems. 

The moderation decisions of social media platforms often make international news. Some decisions can be attributed to error. Machine learning system, like every prediction system, makes errors. But some decisions reflect the social values in the data and algorithms behind the model. So, what many communities find harmful may not be harmful as per the guidelines set by social media platforms. 
Machine learning tools can also be designed to reflect the values of those at the forefront of tackling violence, to protect those who will be at the receiving end of the violence. This is precisely the goal of our project. 

### Repository Structure

| Directory | Description |
| --- | --- |
| browser extension | a browser extension that helps moderate and mitigate online gender based violence on twitter |
| annotators | a web app to annotate tweets |
|slur-replacement| Python notebook that documents our exact and approximate slur replacement techniques |
| Scrapers | Twitter and Instagram scrapers we used to collect data for training ML models |

# Contributing
We are currently working wowards the Chrome and Firefox Extension's v0.2.0 Release.
You can track the project [here](https://github.com/orgs/tattle-made/projects/20/views/3)
Find an issue or domain that interests you and reach out to us.

There's also a list of [good first issues](https://github.com/tattle-made/OGBV/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to get started on.

## Contact
For more details on this project please send an email to one of the following email IDs:
* cheshta@cis-india.org
* ambika@cis-india.org
* tarunima@tattle.co.in
