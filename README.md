[![DPG Badge](https://img.shields.io/badge/Verified-DPG%20(Since%20%202024)-3333AB?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMzEiIGhlaWdodD0iMzMiIHZpZXdCb3g9IjAgMCAzMSAzMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0LjIwMDggMjEuMzY3OEwxMC4xNzM2IDE4LjAxMjRMMTEuNTIxOSAxNi40MDAzTDEzLjk5MjggMTguNDU5TDE5LjYyNjkgMTIuMjExMUwyMS4xOTA5IDEzLjYxNkwxNC4yMDA4IDIxLjM2NzhaTTI0LjYyNDEgOS4zNTEyN0wyNC44MDcxIDMuMDcyOTdMMTguODgxIDUuMTg2NjJMMTUuMzMxNCAtMi4zMzA4MmUtMDVMMTEuNzgyMSA1LjE4NjYyTDUuODU2MDEgMy4wNzI5N0w2LjAzOTA2IDkuMzUxMjdMMCAxMS4xMTc3TDMuODQ1MjEgMTYuMDg5NUwwIDIxLjA2MTJMNi4wMzkwNiAyMi44Mjc3TDUuODU2MDEgMjkuMTA2TDExLjc4MjEgMjYuOTkyM0wxNS4zMzE0IDMyLjE3OUwxOC44ODEgMjYuOTkyM0wyNC44MDcxIDI5LjEwNkwyNC42MjQxIDIyLjgyNzdMMzAuNjYzMSAyMS4wNjEyTDI2LjgxNzYgMTYuMDg5NUwzMC42NjMxIDExLjExNzdMMjQuNjI0MSA5LjM1MTI3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==)](https://digitalpublicgoods.net/r/uli)


<div align="center">
  <h1>Uli : Reclaim your Online Space</h1>
</div>
<div align="center">
  <a href="https://uli.tattle.co.in" target="_blank">
  <picture>
    <img src="https://uli.tattle.co.in/HeroIllustration.gif" width="360px" alt="Logo"/>
  </picture>
  </a>
</div>
<h4 align="center">
    <a href="https://admin417477.typeform.com/to/nVuNyG">Slack</a> |
    <a href="https://twitter.com/tattlemade/">Twitter</a> |
    <a href="mailto:uli_support@tattle.co.in">Email</a><br/><br/>
    <a href="https://uli.tattle.co.in/">Website</a> |
    <a href="https://uli.tattle.co.in/user-guide">User Guide</a> |
    <a href="https://uli.tattle.co.in/blog">Blog</a><br/><br/>
    <a href="https://github.com/tattle-made/Uli/blob/main/browser-extension/plugin/scripts/slur-list.txt">Uli Slur List licensed under ODBL</a><br/><br/>
</h4>

Uli is a browser plugin that :
- De-normalizes the everyday violence that people of marginalized genders experience online in India
- Provides tools for relief and collective response.


It is an attempt to invert the top-down logics of platform moderation and center the experiences of those subject to online gender-based violence. 

<h1 align="center">🎉 Contribution Pathways 🎉</h1>
We cherish diversity of experiences and perspectives. It adds value to our work. To this end, we strongly encourage candidates who find alignment with the project and are driven to learn, to contribute to Uli. There are both code and no-code issues that you can contribute to.

To contribute effectively, we recommend doing some of these:
- Peruse our [Wiki](https://github.com/tattle-made/Uli/wiki). It will help you navigate our repository, and adhere to our standards for contributions.
- We've labeled beginner frienly issues with [good first issue](https://github.com/tattle-made/Uli/labels/good%20first%20issue). 
- Read our `Setup Guides` on the [Uli Wiki](https://github.com/tattle-made/Uli/wiki#setup-guides) or watch a [video tutorial](https://www.youtube.com/watch?v=ya2NvjtUlVI) 
- Join the our [Slack](https://join.slack.com/t/tattle-workspace/shared_invite/zt-24g9vngdc-VEGSv4y1OnLZ~nrvBXl6hQ) to interact with the team and get any clarificatios.
Introduce yourself in the `#introductions` channel and feel free to discuss any Hacktoberfest-related questions in the `#issue_uli_hacktoberfest` channel.

### Technologies we use
- Client : React, [Grommet](https://v2.grommet.io/), [styled components](https://styled-components.com/), [Parcel](https://parceljs.org/)
- Server : NodeJS, [Express](https://expressjs.com/), [Sequelize](https://sequelize.org/)
- Storage : SQL, AWS S3
- DevOps : Github Actions, Docker, Kubernetes

If you are new to any of these, we've created a [learning guide](https://github.com/tattle-made/Uli/wiki/Uli-Learning-Guide) for you.

### Repository Structure

| Directory         | Description                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------- |
| [browser extension](https://github.com/tattle-made/Uli/tree/main/browser-extension) | Uli browser extension that helps moderate and mitigate online gender based violence on twitter. All hacktoberfest work is limited to this directory |
| [annotators](https://github.com/tattle-made/OGBV/tree/main/annotators)       | a web app to annotate tweets, unmaintained                                                                 |
| [slur-replacement](https://github.com/tattle-made/OGBV/tree/main/slur-replacement)  | Python notebook that documents our exact and approximate slur replacement techniques |
| [ogbv-ml-rest](https://github.com/tattle-made/Uli/tree/main/ogbv-ml-rest) | Hosted access for our machine learning model |



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

## Contributing <a name="Contribute"></a>
We've made a list of [good first issues](https://github.com/tattle-made/OGBV/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) to get started on. You can also track the project [here](https://github.com/orgs/tattle-made/projects/20/views/3)
Find an issue or domain that interests you and reach out to us. [Learn More](https://github.com/tattle-made/Uli/blob/main/CONTRIBUTING.md)

## Contact <a name="Contact"></a>

For more details on this project please send an email to one of the following email IDs:
- uli_support@tattle.co.in
- tarunima@tattle.co.in

## Funding:

The pilot of the project was managed by the [Centre for Internet and Society](https://cis-india.org/) and Tattle Civic Tech. It was funded by [Omidyar Network India](https://www.omidyarnetwork.in/) as part of their Digital Society Challenge grant. In addition to revenue from Tattle's other projects, Uli is supported by [Mozilla's Digital Society Challenge](https://foundation.mozilla.org/en/blog/mozilla-welcomes-2023-data-futures-lab-cohort/).

## Website

Visit the Uli website at https://uli.tattle.co.in/
