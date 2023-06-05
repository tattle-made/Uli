## About

![Uli Logo-Header-03](https://user-images.githubusercontent.com/13188366/224236305-6a3b3f26-f5b3-4256-b0dc-5d2b4b8d5e27.png)

Uli is a browser plugin that:
* De-normalizes the everyday violence that people of marginalized genders experience online in India, and
* Provides tools for relief and collective response.

It is an attempt to invert the top-down logics of platform moderation and center the experiences of those subject to online gender-based violence. 

The plugin installation link and the user-guide can be found here: [https://uli.tattle.co.in/](https://uli.tattle.co.in/)

![Uli September posts](https://user-images.githubusercontent.com/13188366/224235833-e6493aab-9706-4b05-ac5a-fb1c0cc97f03.gif)

## Quick Guide
1. [Motivation](#motivation-)
2. [Approach](#approach-)
3. [Roadmap](roadmap.md)
4. [Contribute](#contributing-)
5. [Contact](#contact-)


## Motivation <a name="Motivation"></a>

The graphic narrative titled ‘Personal (Cyber) Space’ published in 2016 by Parthasarthy and Malhotra narrates an experience of a young internet user. The animated short comic hosted by Kadak, a South Asian women collective, asks: ‘If one says something, there’s the fear of hateful response. But if one doesn’t say something, isn’t that silence counterproductive?’ only to end with the question, ‘so what does one say?’

Violence, abuse, and hate speech on the web has become pervasive to one’s experience of social media and the existing scholarship suggests that it is those situated at the margins who are worst affected. People of marginalized genders in India are disproportionately affected. Simultaneously, the business models of social media platforms skew the incentives against protecting users who use social media in non-dominant languages. Uli is an attempt to build tools to protect and enable collective response for social media users of marginalizd genders. 


## Approach <a name="Approach"></a>

The problem of online violence encompasses within itself legal, political, social, cultural and technological complexities that make any easy solution impossible. This overdetermined nature mandates that we seek solutions from multiple avenues. As with all Tattle projects, we don't expect technology to provide all the answers, but for it to be intertwined in human action. 

Specifically around redaction, the project borrows from feminist approaches to Machine Learning technology and aims to intervene into the ongoing debate around content moderation. The existing algorithmic approaches to automated content moderation strategies are generally biased towards English-language content paying very limited attention to social, cultural and linguistic diversity elsewhere. Moreover, the existing approaches understand moderation through a binary logic of: leave content up or remove it. With multiple political and legal implications emerging from these biases, the existing approaches threaten to pose more problems rather than solving them. With this tool, the project aims to redress these problems and find creative ways in which moderation can empower multiple users, especially the ones that are most affected.

We started the projeect through a period of qualitative data collection methods and participatory analysis. Based on the needs articulated by gender rights activists and researchers we focused on building the following features:
* Detection/ filtering of abuse
* Tools for archiving locally and through email.
* Localized resources for understanding the effects of online gender based violence. 
* Invoking networks for action on abusive content. 

Based on feedback from the beta on potential misuse of the feature, it has been removed from the current version till more checks and balances can be built in. 

The ultimate aim of the project is to envision creative and collective responses to the structural problem of violence experienced online and help build solidarity and shared understanding while empowering users to take back control of their digital experience.

### Situating machine learning:

Machine learning based approaches are a commonly used technique to automate decision making when the volume of data is large. To put it briefly, machine learning works by finding patterns in existing data to ascribe a value to future queries. Instead of telling an algorithm what to do, in machine learning, the algorithm figures out what to do based on the data it is fed. The data used to train a machine learning system as well as the algorithm used to classify the data, can encode social beliefs and values. These are perpetuated in the performance of the machine learning systems.

The moderation decisions of social media platforms often make international news. Some decisions can be attributed to error. Machine learning system, like every prediction system, makes errors. But some decisions reflect the social values in the data and algorithms behind the model. So, what many communities find harmful may not be harmful as per the guidelines set by social media platforms.
Machine learning tools can also be designed to reflect the values of those at the forefront of tackling violence, to protect those who will be at the receiving end of the violence. This is precisely the goal of our project. 

The ML model is based on needs articulated by communities, rather than the priorities of powerful institutions. We are working to publish our methodology, annotation guidelines, datasets, and the limitations in the dataset. Our goal remains to make the models interpretable to the users of the plugi. We believe this will help to raise awareness about content moderation systems as well as gender-based violence online.

### Repository Structure

| Directory         | Description                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------- |
| [browser extension](https://github.com/tattle-made/OGBV/tree/main/annotators) | a browser extension that helps moderate and mitigate online gender based violence on twitter |
| [annotators](https://github.com/tattle-made/OGBV/tree/main/annotators)       | a web app to annotate tweets                                                                 |
| [slur-replacement](https://github.com/tattle-made/OGBV/tree/main/slur-replacement)  | Python notebook that documents our exact and approximate slur replacement techniques 

### Features supported by versions

| Feature         | Chrome Production Version     | Firefox Production Version |
|--------------|-----------|------------|
| Slur Replacement on Twitter | :heavy_check_mark:      | :heavy_check_mark:       |
| Machine Learning based OGBV filter    | :heavy_check_mark:  | :heavy_check_mark:       |
| Feedback for the ML feature    | :heavy_check_mark:  | :heavy_multiplication_x:       |
| Addition of Slurs Via Right Click    | :heavy_check_mark:  | :heavy_check_mark:       |
| New Parsing system    | :heavy_check_mark:  | :heavy_multiplication_x:       |
| Slur Replacement on Web | :heavy_check_mark:      | :heavy_multiplication_x:       |

Some of the features in Firefox are broken/missing because of the following issue: https://github.com/tattle-made/OGBV/issues/233

# Contributing <a name="Contribute"></a>

You can track the project [here](https://github.com/orgs/tattle-made/projects/20/views/3)
Find an issue or domain that interests you and reach out to us.

There's also a list of [good first issues](https://github.com/tattle-made/OGBV/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to get started on.

## Contact <a name="Contact"></a>

For more details on this project please send an email to one of the following email IDs:
- uli_support@tattle.co.in
- tarunima@tattle.co.in

## Funding:

The pilot of the project was managed by the [Centre for Internet and Society](https://cis-india.org/) and Tattle Civic Tech. It was funded by [Omidyar Network India](https://www.omidyarnetwork.in/) as part of their Digital Society Challenge grant. In addition to revenue from Tattle's other projects, Uli is supported by [Mozilla's Digital Society Challenge](https://foundation.mozilla.org/en/blog/mozilla-welcomes-2023-data-futures-lab-cohort/).

## Website

Visit the Uli website at https://uli.tattle.co.in/
